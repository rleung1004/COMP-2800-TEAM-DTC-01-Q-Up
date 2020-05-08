import {db} from '../util/admin';
import {Request, Response} from 'express';
import {createQueueSlot, createQueueSlotCredentials} from "../util/helpers";
import {validateQueue} from "../util/validators";


/**
 * get the queue isActive, listOfQueueSlots (with their ticket, pass)
 */
const getQueueList = async (req: Request, res: Response) => {
    const requestData = {
        queueName: req.body.businessName,
    };
    return db
        .collection('queues')
        .doc(requestData.queueName)
        .get()
        .then((docSnapshot) => {
            const doc: any = docSnapshot.data();
            const { valid, errors } = validateQueue(doc);

            if (!valid) {
                return res.status(400).json(errors);
            }

            // creates queueSlots for response
            const queueSlots: Array<string> = doc.queueSlots
                .map((queueSlot: any) => createQueueSlot(queueSlot));
            return res
                .status(200)
                .json({
                    queueSlots: queueSlots,
                    general: 'successful',
                });
        })
        .catch(() => {
            return res
                .status(500)
                .json({
                    general: "Something went wrong. Please try again"
                });
        });
};

/**
 * shows the queue information, isAcitve, currentWaitTImeForWholeQueue and NumberOfQueueSlots
 */

const getQueueInfoForBusiness = async (req: Request, res: Response) => {
    const requestData = {
        // queue names are essentially the same as the business names, therefore
        //customers can pass their queueName
        //businesses can pass their businessName (managers and employees)
        queueName: req.body.queueName,
    };
    return db
        .collection('queues')
        .doc(requestData.queueName)
        .get()
        .then( (docSnapshot) => {
            const doc: any = docSnapshot.data();
            const { valid, errors } = validateQueue(doc);
            if (!valid) {
                return res.status(400).json(errors);
            }
            const currentWaitTime = doc.queueSlots.length * doc.averageWaitTime;
            const queueLength = doc.queueSlots.length;
            return res
                .status(200)
                .json({
                    currentWaitTime: currentWaitTime,
                    queueLength: queueLength,
                    general: 'successful',
                });
        })
        .catch(() => {
            return res
                .status(500)
                .json({
                    general: "Something went wrong. Please try again"
                });
        });
};

/**
 shows the queue position, current time wait, pass and ticketNumber
 */
const getQueueSlotInfo = async (req: Request, res: Response) => {
    const requestData = {
        customerIdentifier: req.body.customerIdentifier,
        queueName: req.body.currentQueue,
    };
    return db
        .collection('queues')
        .doc(requestData.queueName)
        .get()
        .then( (docSnapshot) => {
            const doc: any = docSnapshot.data();
            const queueSlotIndex: number = doc.queueSlots.findIndex(requestData.customerIdentifier);
            if (queueSlotIndex === -1) {
                return res
                    .status(404)
                    .json({
                        general: 'could not find the customer position.',
                    })
            }
            const queueSlot: any = db
                .collection('queueSlots')
                .doc(requestData.customerIdentifier)
                .get()
                .then((docSnapshot) => docSnapshot.data())
                .catch(()=> false);

            if (!queueSlot) {
                return res
                    .status(400)
                    .json({
                        general:'could not find the customer queue slot',
                    })
            }

            const currentWaitTime: number = queueSlotIndex * doc.averageWaitTime;
            const queuePosition: number = queueSlotIndex + 1;
            return res
                .status(200)
                .json({
                    ticketNumber: queueSlot.ticketNumber,
                    password: queueSlot.password,
                    queue: queueSlot.queue,
                    currentWaitTime: currentWaitTime,
                    queuePosition: queuePosition,
                    general: 'successful',
                });
        })
        .catch(() => {
            return res
                .status(500)
                .json({
                    general: "Something went wrong. Please try again"
                });
        });

};

/**
 * Adds a queueSlot to the QueueSlot Collections
 */
const addQueueSlot =  (customerIdentifier: string, queueName: string, res: Response) => {
    const newSlot = createQueueSlotCredentials({
        customer: customerIdentifier,
        queue: queueName,
    });
    db
        .doc(`queueSlots/${newSlot.customer}`)
        .set(newSlot)
        .then(()=> res.status(200).json({
            general:'Customer added to the queue',
        }))
        .catch(() => {
            return res
                .status(500)
                .json({
                    general: "Something went wrong. Please try again"
                });
        });
    return newSlot;
};

/**
 * Adds the queue name to the customer document
 */
const addQueueNameToCustomer = (customerIdentifier: string, queueName: string, res: Response) => {
   return db
        .collection('users')
        .doc(customerIdentifier)
        .get()
        .then((docSnapshot) => {
            if (!docSnapshot.exists) {
                return res.status(404).json({
                    general:'the user does not exist!',
                })
            }
            const user: any = docSnapshot.data();
            if (user.currentQueue) {
                return res.status(400).json({
                    general: 'customer is already in a different Queue',
                })
            }
            db
                .collection('users')
                .doc(customerIdentifier)
                .update({currentQueue: queueName});
            return res.status(200);
        })
       .catch(() => {
           return res
               .status(500)
               .json({
                   general: "Something went wrong. Please try again"
               });
       });
};

/**
 * Add the queueSlot to the queue Collection
 */
const addQueueSlotToQueue = (req: Request, res: Response)=> {
    const queueSlot = addQueueSlot(req.body.customerIdentifier, req.body.queueName, res);
    const queue: any =  db
        .collection('queues')
        .doc(req.body.queueName)
        .get()
        .then((docSnapshot)=> docSnapshot.data())
        .catch();
    queue.queueSlots.push(queueSlot);
    return db
        .collection('queues')
        .doc(req.body.queueName)
        .update(queue)
        .then(()=> {
            return res.status(200).json({
                general:'added a customer to a queue',
            })
        })
        .catch(() => {
            return res
                .status(500)
                .json({
                    general: "Something went wrong. Please try again"
                });
        });
};

/**
 * Adds a booth customer to a queue
 */
const boothEnterQueue = (req: Request, res: Response) => {
    return addQueueSlotToQueue(req, res);
};

/**
 * Adds a logged in customer to a queue
 */
const customerEnterQueue = async(req: Request, res: Response) => {
    const returnObject = await addQueueNameToCustomer(req.body.customerIdentifier, req.body.queueName, res);
    if (returnObject.statusCode !== 200) {
        return returnObject
    }
    return await addQueueSlotToQueue(req, res);
};

/**
 * Remove the customer's current queue from the

 */
const removeCurrentQueueFromCustomer = (customerIdentifier: string, res: Response) => {
    return db
        .collection('users')
        .doc(customerIdentifier)
        .get()
        .then((docSnapshot)=> {
            if (!docSnapshot.exists) {
                return res.status(404).json({
                    general:'did not find the user!',
                });
            }
            return db
                .collection('users')
                .doc(customerIdentifier)
                .update({currentQueue: null})
                .then(()=> {
                    return res.status(200).json({
                        general:'added a customer to a queue',
                    })
                })
        })
        .catch(() => {
            return res
                .status(500)
                .json({
                    general: "Something went wrong. Please try again"
                });
        });
};

/**
 * Removes the queue slot from the queueSlots collection
 */
const removeQueueSlot = async (customerIdentifier: string, res: Response) => {
    const queueSlot = await db
        .collection('queueSlots')
        .doc(customerIdentifier)
        .get()
        .then((docSnapshot)=> docSnapshot.data())
        .catch(()=> null);
    if (!queueSlot) {
        return res.status(404).json({
            general:'could not find the queueSlot',
        })
    }
    return db
        .collection('queueSlots')
        .doc(customerIdentifier)
        .delete()
        .then(()=> res.status(200).json({
            general:'Customer deleted to the queue',
        }))
        .catch(() => {
            return res.status(500).json({
                    general: "Something went wrong. Please try again"
                });
        });
};
/**
 * Remoces the QueueSlot from the Queue
 */
const removeQueueSlotFromQueue = async (req: Request, res: Response) => {
    const removedSlotRes = await removeQueueSlot(req.body.customerIdentifier, res);
    if (removedSlotRes.statusCode !== 200) {
        return res.status(500).json({
            general: "Something went wrong. Please try again"
        });
    }
    return db
        .collection('queues')
        .doc(req.body.customerIndentifier)
        .get()
        .then((docSnapshot) => {
            const queue: any = docSnapshot.data();
            queue.queueSlots = queue.queueSlots.filter((value: string, _: number, __: Array<string>) => {
                return removedSlotRes.get('deletedQueue') !== value;
            });
            return db
                .collection('queues')
                .doc(req.body.customerIndentifier)
                .update(queue)
                .then(()=> res.status(200).json({
                    general:'successfully removed the customer from the queue'
                }))
        })
        .catch(() => {
            return res.status(500).json({
                general: "Something went wrong. Please try again"
            });
        });
};

/**
 * Removes a customer from a queue by deleting their queue slot
 */
const removeFromQueue = (req: Request, res: Response) => {
    const requestData = {
        queueName: req.body.queueName,
        customerIdentifier: req.body.customerIdentifier,
    };

    db
        .collection('users')
        .doc(requestData.customerIdentifier)
        .get()
        .then((docSnapshot) => {
            if (docSnapshot.exists) {
               return removeCurrentQueueFromCustomer(requestData.customerIdentifier, res);
            }
            return;
        })
        .then(()=> removeQueueSlotFromQueue(req, res))
        .catch(() => {
            return res.status(500).json({
                general: "Something went wrong. Please try again"
            });
        });
};

/**
 * Adjusts the timing of the queued users by inserting a HW to the list
 */
const insertInQueue = async (req: Request, res: Response) => {
    const requestData = {
        queueName: req.body.queueName,
    };
    const queueLookUp = await db
        .collection('queues')
        .doc(requestData.queueName)
        .get()
        .then((data)=> data.data())
        .catch(()=> null);
    if(!queueLookUp) {
        return res.status(404).json({
            general:'The Queue does not exist!',
        })
    }
    const newQueueSlot = addQueueSlot(
        'healthWorker' + '0' + (Math.random()*10000).toString(),requestData.queueName, res);
    let newQueue: Array<string> = queueLookUp.queueSlots;
    newQueue.unshift(newQueueSlot.queue);
    return db
        .collection('queues')
        .doc(requestData.queueName)
        .update(newQueue)
        .then(()=> {
            return res.status(200).json({
                general:'Adjusted the queue successfully',
            })
        })
        .catch(() => {
            return res
                .status(500).json({
                    general: "Something went wrong. Please try again"
                });
        });
};

/**
 * Activates or deactivates,
 * for activation, it checks whether the queue is within the start and end time
 */
const changeQueueStatus = (req: Request, res: Response)=> {
    const requestData = {
        queueName: req.body.queueName,
    };
    return db
        .collection('queues')
        .doc(requestData.queueName)
        .get()
        .then((docSnapshot) => {
            const queue: any = docSnapshot.data();
            return queue.isActive;
        })
        .then((isActive) => {
            if (isActive) {
                return db
                    .collection('queues')
                    .doc(requestData.queueName)
                    .update({isActive: !isActive, queueSlots: new Array<string>()})
                    .then(()=> {
                        return res.status(200).json({
                            general:'Adjusted the queue successfully',
                        })
                    })
            }
            return db
                .collection('queues')
                .doc(requestData.queueName)
                .update({isActive: !isActive})
                .then(()=> {
                return res.status(200).json({
                    general:'Adjusted the queue successfully',
                })
            })
        })
        .catch(() => {
            return res
                .status(500)
                .json({
                    general: "Something went wrong. Please try again"
                });
        });
};

/**
 * Gets the Queue info.
 */
const getQueueInfo = (queueName: string) => {
    return db
        .collection('queues')
        .doc(queueName)
        .get()
        .then((docSnapshot) => {
            if (!docSnapshot.exists) {
                return null;
            }
            const queueObject: any = docSnapshot.data();
            return {
                queueName: queueName,
                isActive: queueObject.isActive,
                queueLength: queueObject.queueSlots.length,
                currentWaitTime : queueObject.queueSlots.length * queueObject.averageWaitTime,
            }
        })
        .catch(()=> null);
};

/**
 * Gets the favourite queue information for a user.
 */
const getFavouriteQueuesForCustomer = (req: Request, res: Response)=>{
    const requestData = {
        customerIdentifier: req.body.customerIdentifier,
    };
    let queueInfoList: Array<any> = [];
    return db
        .collection('users')
        .doc(requestData.customerIdentifier)
        .get()
        .then((docSnapshot) => {
            const user: any = docSnapshot.data();
            return user.favouriteBusinesses;
        })
        .then((favouriteList) => {
            const favs: Array<string> = favouriteList.data();
            favs.forEach( queueName => {
                const queueInfo = getQueueInfo(queueName);
                if (queueInfo) {
                    queueInfoList.push(queueInfo);
                }
            });
            return res.status(200).json({
                general: 'successfully obtained the favourite list of all queues',
                favouriteQueues: queueInfoList,
            })
        })
        .catch(() => {
            return res
                .status(500).json({
                    general: "Something went wrong. Please try again"
                });
        });
};

export {
    getQueueList,
    getQueueInfoForBusiness,
    getQueueSlotInfo,
    customerEnterQueue,
    boothEnterQueue,
    insertInQueue,
    removeFromQueue,
    changeQueueStatus,
    getFavouriteQueuesForCustomer,
};
