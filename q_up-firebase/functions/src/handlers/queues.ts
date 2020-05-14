import {db} from "../util/admin";
import {Request, Response} from "express";
import * as firebase from "firebase-admin";
import {
    createQueueSlotCredentials,
    createVIPSlotCredentials,
    getTheDayOfTheWeekForArray,
    queue,
    queueSlot,
} from "../util/helpers";

/**
 * Creates a queue for a business.
 */
export const createQueue = async (req:Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        businessName: req.body.name,
        averageWaitTime: req.body.averageWaitTime,
    };
    if (requestData.userType !== 'manager') {
        return res.status(401).json({general: 'unauthorized'});
    }
    const newQueue: queue = {
        averageWaitTIme: requestData.averageWaitTime,
        queueName: requestData.businessName,
        queueSlots: [],
        isActive: false,
    };
    return await db
        .collection('queues')
        .doc(requestData.businessName)
        .set(newQueue)
        .then(() => res.status(201).json({general: 'created the business and its queue successfully!'}))
        .catch((err) => {
            console.error(err);
            return res.status(404).json({
                general: "something went wrong!",
                error: err,
            })
        })
};

/**
 * gets the queueList for the teller.
 */
export const getQueueListForEmployee = async (req: Request, res: Response) => {
    const requestData = {
        userEmail: req.body.userEmail,
        userType: req.body.userType,
        queueName: req.body.queueName,
    };
    if (requestData.userType !== 'employee') {
        return res.status(401).json({general: 'unauthorized'});
    }
    const isEmployeeOfBusiness: boolean =
        await db
            .collection('users')
            .where('email', '==', requestData.userEmail)
            .get()
            .then((data) => data.docs[0].data().businessName === requestData.queueName)
            .catch((err) => {
                console.error(err);
                return false;
            });
    if (!isEmployeeOfBusiness) {
        return res.status(401).json({general: 'employee is not part of the business'});
    }
    return await db
        .collection("queues")
        .where("queueName", "==", requestData.queueName)
        .get()
        .then((data) => {
            const queueList = data.docs[0].data().queueSlots;
            return res.status(200).json({
                general: "success!",
                queueList: queueList,
                isActive: data.docs[0].data().isActive,
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(404).json({
                general: "something went wrong!",
                error: err,
            });
        });
};

/**
 * Gets the number of online Employees for the business.
 */
const getOnlineEmployees = async (businessName: string) => {
    return await db
            .collection("users")
            .where("userType", "==", "employee")
            .where("businessName", "==", businessName)
            .get()
            .then((dataList) => {
                if (dataList.empty) {
                    return -1
                }
                let onlineEmployeeCount: number = 0;
                dataList.docs.forEach((data) => {
                    if (data.data().isOnline) {
                        onlineEmployeeCount++;
                    }
                });
                return onlineEmployeeCount
            })
            .catch( (err) => {
                console.error(err);
                return -1;
            });
};

/**
 * shows the queue information, is Active, currentWaitTImeForWholeQueue and NumberOfQueueSlots
 */
export const getQueueInfoForBusiness = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        businessName: req.body.name,
    };
    if (requestData.userType !== 'manager') {
        return res.status(401).json({general: 'unauthorized'});
    }
    return await db
        .collection("queues")
        .where("queueName", "==", requestData.businessName)
        .get()
        .then(async (data) => {
            const usableData = data.docs[0].data();
            const onlineEmployees: number = await getOnlineEmployees(requestData.businessName);
            if (onlineEmployees === -1) {
                return res.status(401).json({
                    general: "did not obtain the number of online employees correctly",
                })
            }
            return res.status(200).json({
                resData: {
                    currentWaitTime: usableData.queueSlots.length * usableData.averageWaitTime / onlineEmployees,
                    queueLength: usableData.queueSlots.length,
                    isActive: usableData.isActive,
                },
                general: "successful",
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                general: "Something went wrong. Please try again",
                error: err,
            });
        });
};

/**
 shows the queue position, current time wait, pass and ticketNumber
 */
export const getQueueSlotInfo = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        userEmail: req.body.userEmail,
        queueName: req.body.currentQueue,
    };
    if (requestData.userType !== 'customer') {
        return res.status(401).json({ general: 'unauthorized!'});
    }
    return await db
        .collection("queues")
        .where("queueName", "==", requestData.queueName)
        .get()
        .then(async (data) => {
            const usableData = data.docs[0].data();
            const isActive = usableData.isActive;
            if (!isActive) {
                db.collection("users").doc(requestData.userEmail).update({currentQueue: null});
                return res.status(403).json({
                    general: "Queue is no longer available, queue up for another business",
                });
            }
            const queueSlots = usableData.queueSlots;
            const queueSlotIndex: number = queueSlots.findIndex((object: any) => {
                return object.customer === requestData.userEmail;
            });
            if (queueSlotIndex === -1) {
                return res.status(404).json({
                    general: "could not find the customer position.",
                });
            }
            const onlineEmployees: number = await getOnlineEmployees(requestData.queueName);
            return res.status(200).json( {
                general: "successful",
                resData : {
                    ticketNumber: queueSlots[queueSlotIndex].ticketNumber,
                    password: queueSlots[queueSlotIndex].password,
                    currentWaitTime: queueSlotIndex * usableData.averageWaitTime / onlineEmployees,
                    queuePosition: queueSlotIndex + 1,
                },
            });

        })
        .catch((err) => {
            console.error(err);
            return res.status(401).json({
                general: "Something went wrong. Please try again",
                error: err,
            });
        });
};

/**
 * Adds a logged in customer to a queue
 */
export const customerEnterQueue = async (req: Request, res: Response) => {
    const requestData = {
        userEmail: req.body.userEmail,
        queueName: req.body.queueName,
    };
    db.collection("queues")
        .where("queueName", "==", requestData.queueName)
        .get()
        .then((data) => {
            const usableData = data.docs[0].data();
            const isActive: boolean = usableData.isActive;
            const queueSlots: Array<any> = usableData.queueSlots;
            if (isActive) {
                let customer = createQueueSlotCredentials(requestData.userEmail, 0);
                if (queueSlots.length > 0) {
                    customer.ticketNumber = queueSlots[queueSlots.length - 1].ticketNumber + 1;
                }
                db.collection("queues").doc(requestData.queueName).update({
                    queueSlots: firebase.firestore.FieldValue.arrayUnion(customer),
                });
                db.collection("users")
                    .doc(requestData.userEmail)
                    .update({currentQueue: requestData.queueName});

                return res.status(201).json({
                    general: `${requestData.userEmail} has been added into queue ${requestData.queueName} successfully`,
                });
            } else {
                return res
                    .status(403)
                    .json({general: "Queue is currently not active"});
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(404).json({general: "Queue is not found"});
        });
};

/**
 * Remove the customer's current queue from the
 */
export const abandonQueueSlot = async (req: Request, res: Response) => {
    const userData = {
        currentQueue: req.body.currentQueue,
        userEmail: req.body.userEmail,
        userType: req.body.userType,
    };

    if (userData.userType === "customer") {
        if (userData.currentQueue === null) {
            return res
                .status(404)
                .json({general: "You are not currently in a queue"});
        }

        await db
            .collection("queues")
            .where("queueName", "==", userData.currentQueue)
            .get()
            .then((data) => {
                let queueSlots: Array<queueSlot> = data.docs[0].data().queueSlots;
                let index = queueSlots.findIndex(
                    (queueSlot) => queueSlot.customer === userData.userEmail
                );
                // if index is not found it return -1, otherwise remove element from index of queueSlot
                if (index > -1) {
                    queueSlots.splice(index, 1);
                }
                // update new status of queue
                db.collection("queues")
                    .doc(userData.currentQueue)
                    .update({queueSlots});
                // remove currentQueue from customer account
                db.collection("users")
                    .doc(userData.userEmail)
                    .update({currentQueue: null});

                // return OK response to client
                return res.status(200).json({
                    general: `Removed ${userData.userEmail} from queue ${userData.currentQueue} successfully`,
                });
            })
            .catch((err) => {
                console.error(err);
                return res
                    .status(500)
                    .json({general: "Something went wrong, please try again"});
            });
        return res.status(200); // every code path must return a value
    } else {
        return res.status(500).json({general: "Please login in as a customer"});
    }
};

/**
 * Adjusts the timing of the queued users by inserting a VIP to the list
 */
export const VIPEnterQueue = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        queueName: req.body.queueName,
    };
    if (requestData.userType !== 'employee') {
        return res.status(401).json({general: 'unauthorized!'});
    }
    return await db
        .collection("queues")
        .where("queueName", "==", requestData.queueName)
        .get()
        .then((data) => {
            const usableData = data.docs[0].data();
            const vipSlot = createVIPSlotCredentials();
            usableData.queueSlots.unshift(vipSlot);
            db.collection("queues").doc(requestData.queueName).update(usableData);
            return res.status(201).json({
                general: `${vipSlot.customer} has been successfully added into the queue`,
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(404).json({error: "Queue does not exist"});
        });
};

/**
 * Removes the currentQueue of the customer.
 */
const removeCustomerCurrentQueue = async (customerEmail: string) => {
    await db
        .collection('users')
        .doc(customerEmail)
        .update({currentQueue: null})
        .catch();
};

/**
 * Activates or deactivates,
 * for activation, it checks whether the queue is within the start and end time
 */
export const changeQueueStatus = async (req: Request, res: Response) => {
    const requestData = {
        businessName: req.body.businessName,
        userType: req.body.userType,
    };
    if (requestData.userType !== 'manager') {
        return res.status(401).json({general: 'unauthorized!'});
    }
    const isQueueActive: boolean =
        await db
            .collection('queues')
            .where('queueName', '==', requestData.businessName)
            .get()
            .then(data => data.docs[0].data().isActive)
            .catch(err => {
                console.error(err);
                return false;
            });

    if (isQueueActive) {
        return await db
            .collection('queues')
            .where('queueName', '==', requestData.businessName)
            .get()
            .then(data => {
                data.docs[0]
                    .data().queueSlots
                    .map((queueSlot: any) => queueSlot.customer)
                    .forEach((customer: string) => removeCustomerCurrentQueue(customer));
                db
                    .collection('queues')
                    .doc(requestData.businessName)
                    .update({queueSlots: new Array<string>()});
                return res.status(200).json({general: 'successfully deactivated the queue!'});
            })
            .catch((err) => {
                console.error(err);
                return res.status(404).json({error: "Queue does not exist"});
            });
    } else {
        const hours: any = await db
            .collection('businesses')
            .where('name','==',requestData.businessName)
            .get()
            .then(data => {
                const hours = data.docs[0].data().hours;
                return {
                    startTime: hours.startTime[getTheDayOfTheWeekForArray()],
                    endTime: hours.endTime[getTheDayOfTheWeekForArray()],
                }
            })
            .catch((err) => {
                console.error(err);
                return {};
            });
        if (!hours.endTime && !hours.startTime) {
            return res.status(404).json({
                general: 'could not obtain the hours of operation for this business',
            })
        }
        const now = new Date("2000-01-01 10:30 PM").getHours();
        if (now < hours.startTime || now > hours.endTime) {
            return res.status(400).json({general: 'The store is closed now!'});
        }
        return await db
            .collection('queues')
            .doc(requestData.businessName)
            .update({isActive: true})
            .then(() => res.status(200).json({general: 'successfully activated the queue!'}))
            .catch((err) => {
                console.error(err);
                return res.status(404).json({error: "Queue does not exist"});
            });
    }
};

/**
 * Gets the info for a single favourite queue.
 */
const getFavouriteQueueInfo = async (queueName: string) => {
    let result: any = {};
    await db
        .collection("queues")
        .where("queueName", "==", queueName)
        .get()
        .then((data) => {
            const usableData = data.docs[0].data();
            Object.assign(result, {
                queueName: usableData.queueName,
                isActive: usableData.isActive,
                currentWaitTime:
                    usableData.queueSlots.length * parseInt(usableData.averageWaitTime),
                queueLength: usableData.queueSlots.length,
            });
        })
        .catch();
    await db
        .collection("businesses")
        .where("name", "==", queueName)
        .get()
        .then((data) => {
            const usableData = data.docs[0].data();
            Object.assign(result, {
                address: usableData.address,
                startTime: usableData.hours.startTime[getTheDayOfTheWeekForArray()],
                endTime: usableData.hours.endTime[getTheDayOfTheWeekForArray()],
                phoneNumber: usableData.phoneNumber,
                website: usableData.website,
            });
        })
        .catch();
    return result;
};

/**
 * Gets the favourite queues info for the customer.
 */
export const getFavouriteQueuesForCustomer = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        userEmail: req.body.userEmail,
    };
    if (requestData.userType !== "customer") {
        return res.status(401).json({
            general: "unauthorized!",
        });
    }
    const favouriteBusinesses: Array<string> = await db
        .collection("users")
        .where("email", "==", requestData.userEmail)
        .get()
        .then((data) => data.docs[0].data().favouriteBusinesses)
        .catch(() => null);
    if (favouriteBusinesses === null) {
        return res
            .status(404)
            .json({general: "Did not find any favourite businesses!"});
    }
    if (favouriteBusinesses.length === 0) {
        return res.status(200).json({
            general: "successful",
            favouriteBusinesses: {},
        });
    }
    let resData: any = {};
    favouriteBusinesses.forEach((businessName) =>
        Object.assign(resData, getFavouriteQueueInfo(businessName))
    );
    return res.status(200).json({
        general: "successful",
        favouriteBusinesses: resData,
    });
};

