import {db, dbTrigger} from "../util/firebaseConfig";
import {getOnlineEmployees} from "./queues";
import {getCounts, getHighestTicketNumbers, isEmail} from "../util/helpers";
import {sendMail} from "./notifications";

/**
 * Changes the counts on either vipCount of the queue or nonVipCount of it when the queue is updated.
 *
 * @param businessName          a string
 * @param newTicketNumber       a number
 * @param isVIP                 a boolean
 */
const changeQueueSlotHighestTicketNumber = async (businessName: string, newTicketNumber: number, isVIP: boolean) => {
    if (isVIP) {
        await db
            .collection("businesses")
            .doc(businessName)
            .update({"queue.highestVipTicketNumber": newTicketNumber})
            .catch(err => console.error(err));
    } else {
        await db
            .collection("businesses")
            .doc(businessName)
            .update({"queue.highestNonVipTicketNumber": newTicketNumber})
            .catch(err => console.error(err));
    }
};

/**
 * Changes the currentWaitTime of a queue when its updated.
 *
 * @param newBusiness   an Object
 */
const changeCurrentWaitTimeOfQueue = async (newBusiness: any) => {
    const queue: any = newBusiness.queue;
    const onlineEmployees: number = await getOnlineEmployees(newBusiness.name);
    const newCurrentWaitTime = Math.round((queue.queueSlots.length * queue.averageWaitTime) / onlineEmployees);
    await db
        .collection("businesses")
        .doc(newBusiness.name)
        .update({'queue.currentWaitTime': newCurrentWaitTime})
        .catch(err => console.error(err));
};

/**
 * Triggers on any queue updates.
 * first checks if the queue of the business that has been updated has been changed, if so, changes the queueSlot counts
 * and the currentWaitTime of the queue fields in the queue for the business.
 * Sends an email to the customers in 3rd to 5th position slot of the queue.
 *
 * @return  null to determine the end of the trigger for the cloud function
 */
export const onQueueUpdate = dbTrigger
    .document("businesses/{businessName}")
    .onUpdate(async change => {
        const prevData: any = await change.before.data();
        const newData: any = change.after.data();
        if (prevData.queue.queueSlots.length !== newData.queue.queueSlots.length) {
            const prevCounts = getCounts(prevData.queue.queueSlots);
            const newCounts = getCounts(newData.queue.queueSlots);
            const prevHighestTickets = getHighestTicketNumbers(prevData.queue.queueSlots);
            const newHighestTickets = getHighestTicketNumbers(newData.queue.queueSlots);
            const newQueueSlots: Array<any> = newData.queue.queueSlots;
            const prevQueueSlots: Array<any> = prevData.queue.queueSlots;
            if (prevCounts !== newCounts) {
                if (newHighestTickets.highestNonVIPTicketNumber !== prevHighestTickets.highestNonVIPTicketNumber) {
                    await changeQueueSlotHighestTicketNumber(newData.name, newData.queue.highestVipTicketNumber, false);
                } else {
                    await changeQueueSlotHighestTicketNumber(newData.name, newData.queue.highestNonVipTicketNumber, true);
                }
                await changeCurrentWaitTimeOfQueue(newData);
            }
            if (newQueueSlots.length < prevQueueSlots.length && newQueueSlots.length >= 3) {
                let customerSlots = newQueueSlots.filter((queueSlot: any) => isEmail(queueSlot.customer));
                customerSlots = customerSlots.splice(0, 3);
                customerSlots.forEach((customerSlot: any) => {
                    const customerIndex: number = newQueueSlots.findIndex((queueSlot: any) => {
                        return (queueSlot.customer === customerSlot.customer
                            && queueSlot.ticketNumber === customerSlot.ticketNumber
                            && queueSlot.customerType === customerSlot.customerType)
                    });
                    if (customerIndex !== -1 && customerIndex < 5 && customerIndex > 2) {
                        const sentResponse = sendMail(customerSlot.customer);
                        if (!sentResponse) {
                            console.error(`did not send the email to ${customerSlot.customer} successfully!`)
                        } else {
                            customerSlot.receivedEmail = true;
                            newQueueSlots[customerIndex] = customerSlot;
                            console.log(`email sent successfully to ${customerSlot.customer}, the response is: ${sentResponse}`);
                        }
                    }
                });
                db.collection('businesses').doc(newData.name).update({'queue.queueSlots': newQueueSlots});
            }
        }
        return null;
    });
