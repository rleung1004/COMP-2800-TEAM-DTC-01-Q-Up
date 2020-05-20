import { db, dbTrigger} from "../util/firebaseConfig";
import {getOnlineEmployees} from "./queues";
import {getCounts, getHighestTicketNumbers} from "../util/helpers";

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
            if (prevCounts !== newCounts) {
                if (newHighestTickets.highestNonVIPTicketNumber !== prevHighestTickets.highestNonVIPTicketNumber) {
                    await changeQueueSlotHighestTicketNumber(newData.name, newData.queue.highestVipTicketNumber, false);
                } else {
                    await changeQueueSlotHighestTicketNumber(newData.name, newData.queue.highestNonVipTicketNumber, true);
                }
                await changeCurrentWaitTimeOfQueue(newData);
            }
        }
        console.log("successfully updated the queue information by the trigger");
        return null;
    });