import { db } from "../util/admin";
import { Request, Response } from "express";
import {
  createQueueSlotCredentials,
  createVIPSlotCredentials,
} from "../util/helpers";

/**
 * * get the queue isActive, listOfQueueSlots (with their ticket, pass) for the teller
 */
const getTellerQueueList = async (req: Request, res: Response) => {
  const requestData = {
    queueName: req.body.queueName,
  };

  await db
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
 * shows the queue information, is Active, currentWaitTImeForWholeQueue and NumberOfQueueSlots
 */

const getQueueInfoForBusiness = async (req: Request, res: Response) => {
  const requestData = {
    queueName: req.body.queueName,
  };
  await db
    .collection("queues")
    .where("queueName", "==", requestData.queueName)
    .get()
    .then((data) => {
      const usableData = data.docs[0].data();
      const currentWaitTime =
        usableData.queueSlots.length * usableData.averageWaitTime.toString();
      const queueLength = usableData.queueSlots.length;
      return res.status(200).json({
        currentWaitTime: currentWaitTime,
        queueLength: queueLength,
        isActive: usableData.isActive,
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
const getQueueSlotInfo = async (req: Request, res: Response) => {
  const requestData = {
    customerIdentifier: req.body.customerIdentifier,
    queueName: req.body.currentQueue,
  };
  await db
    .collection("queues")
    .where("queueName", "==", requestData.queueName)
    .get()
    .then((data) => {
      const usableData: any = data.docs[0].data();
      const queueSlotIndex: number = usableData.queueSlots.findIndex(
        (object: any) => {
          return object.customer === requestData.customerIdentifier;
        }
      );
      if (queueSlotIndex === -1) {
        return res.status(404).json({
          general: "could not find the customer position.",
        });
      }

      const currentWaitTime: number =
        queueSlotIndex * usableData.averageWaitTime;
      const queuePosition: number = queueSlotIndex + 1;
      return res.status(200).json({
        ticketNumber: usableData.queueSlots[queueSlotIndex].ticketNumber,
        password: usableData.queueSlots[queueSlotIndex].password,
        currentWaitTime: currentWaitTime,
        queuePosition: queuePosition,
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
 * Adds a booth customer to a queue
 */
const boothEnterQueue = async (req: Request, res: Response) => {
  const requestData = {
    userEmail: req.body.userEmail,
    queueName: req.body.queueName,
  };
  let newSlot = createQueueSlotCredentials(requestData);

  await db
    .collection("queues")
    .where("queueName", "==", requestData.queueName)
    .get()
    .then((data) => {
      const usableData = data.docs[0].data();
      usableData.queueSlots.push(newSlot);
      db.collection("queues").doc(usableData.queueName).update(usableData);
      return res.status(201).json({
        general: `${newSlot} has been added to ${usableData.queueName} successfully`,
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
 * Adds a logged in customer to a queue
 */
const customerEnterQueue = async (req: Request, res: Response) => {
  const requestData = {
    userEmail: req.body.userEmail,
    queueName: req.body.queueName,
  };
  await db
    .collection("users")
    .doc(requestData.userEmail)
    .update({ currentQueue: requestData.queueName })
    .then(() =>
      res.status(200).json({
        general: `${requestData.userEmail} is now in ${requestData.queueName}`,
      })
    )
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        general: "Something went wrong. Please try again",
        error: err,
      });
    });
  Object.assign(req.body, { customerId: requestData.userEmail });
  return boothEnterQueue(req, res);
};

/**
 * Remove the customer's current queue from the
 */
// const removeBoothOrCustomer = async (req: Request, res: Response) => {
//   await db
//     .collection("queues")
//     .where("queueName", "==", req.body.queueName)
//     .get()
//     .then((data) => {
//       const usableData = data.docs[0].data();
//       const removableIndex = usableData.queueSlots.findIndex((object: any) => {
//         return object.email === req.body.customerIdentifier;
//       });
//       usableData.queueSlots.splice(removableIndex, 1);
//       db.collection("queues").doc(req.body.queueName).update(usableData);
//       return res.status(200).json({
//         general: "removed successfully",
//       });
//     })
//     .catch((err) => {
//       console.error(err);
//       return res.status(500).json({
//         general: "Something went wrong. Please try again",
//         error: err,
//       });
//     });
// };

// const removeQueueSlot = async (req: Request, res: Response) => {
//   const requestData = {
//     customerIdentifier: req.body.customerIdentifier,
//     queueName: req.body.currentQueue,
//   };
//   await db
//     .collection("users")
//     .where("email", "==", requestData.customerIdentifier)
//     .get()
//     .then((customerData) => {
//       const usableData = customerData.docs[0].data();
//       if (usableData.userType === "customer") {
//         usableData.currentQueue = null;
//         db.collection("users").doc(usableData.email).update(usableData);
//       }
//       return removeBoothOrCustomer(req, res);
//     })
//     .catch((err) => {
//       console.error(err);
//       return res.status(500).json({
//         general: "Something went wrong. Please try again",
//         error: err,
//       });
//     });
// };

/**
 * Adjusts the timing of the queued users by inserting a VIP to the list
 */
const VIPEnterQueue = async (req: Request, res: Response) => {
  const requestData = {
    queueName: req.body.queueName,
  };

  await db
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
      return res.status(404).json({ error: "Queue does not exist" });
    });
};

/**
 * Activates or deactivates,
 * for activation, it checks whether the queue is within the start and end time
 */
const changeQueueStatus = async (req: Request, res: Response) => {
  const requestData = {
    queueName: req.body.queueName,
  };
  await db
    .collection("queues")
    .doc(requestData.queueName)
    .get()
    .then((docSnapshot) => {
      const queue: any = docSnapshot.data();
      return queue.isActive;
    })
    .then((isActive) => {
      if (isActive) {
        return db
          .collection("queues")
          .doc(requestData.queueName)
          .update({ isActive: !isActive, queueSlots: new Array<string>() })
          .then(() => {
            return res.status(200).json({
              general: "Queue deactivated successfully",
            });
          });
      } else {
        return db
          .collection("queues")
          .doc(requestData.queueName)
          .update({ isActive: !isActive })
          .then(() => {
            return res.status(200).json({
              general: "Queue activated successfully",
            });
          });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(404).json({
        general: "Queue does not exist",
        error: err,
      });
    });
};

// const getFavouriteQueuesForCustomer = async (req: Request, res: Response) => {
//   if (req.body.userType === "customer") {
//     await db
//       .collection("users")
//       .where("email", "==", req.body.userEmail)
//       .get()
//       .then((data) => {
//         let resData: any = {};
//         const businessList = data.docs[0].data().favoriteBusinesses;

//         businessList.forEach((businessName: string) => {
//           db.collection("queues")
//             .doc(businessName)
//             .get()
//             .then((docSnapshot) => {
//               if (docSnapshot.exists) {
//                 const queueData: any = docSnapshot.data();
//                 let totalWaitTime =
//                   queueData.averageWaitTime * queueData.queueSlots.length;
//                 resData[businessName] = {
//                   isActive: queueData.isActive,
//                   totalWaitTime,
//                   queueLength: queueData.queueSlots.length,
//                 };
//                 return resData;
//               }
//             });
//         });

//         return res.status(200).json(resData);
//       })
//       .catch((err) => {
//         console.error(err);
//         return res.status(404).json({ general: "User does not exist" });
//       });

//     return res.status(200);
//   } else {
//     return res.status(403).json({ general: "Please login as a customer" });
//   }
// };

export {
  getTellerQueueList,
  getQueueInfoForBusiness,
  getQueueSlotInfo,
  customerEnterQueue,
  boothEnterQueue,
  VIPEnterQueue,
  //   removeQueueSlot,
  changeQueueStatus,
  // getFavouriteQueuesForCustomer,
};
