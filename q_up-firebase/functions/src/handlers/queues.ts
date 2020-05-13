import { db } from "../util/admin";
import { Request, Response } from "express";
import * as firebase from "firebase-admin";
import {
  createQueueSlotCredentials,
  createVIPSlotCredentials,
} from "../util/helpers";

interface queueSlot {
  customer: string;
  password: string;
  ticketNumber: number;
}

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
    userEmail: req.body.userEmail,
    queueName: req.body.currentQueue,
  };
  await db
    .collection("queues")
    .where("queueName", "==", requestData.queueName)
    .get()
    .then((data) => {
      const isActive = data.docs[0].data().isActive;
      if (!isActive) {
        db.collection("users")
          .doc(requestData.userEmail)
          .update({ currentQueue: null });
        return res.status(403).json({
          general:
            "Queue is no longer available, queue up for another business",
        });
      } else {
        const averageWaitTime = data.docs[0].data().averageWaitTime;
        const queueSlots = data.docs[0].data().queueSlots;
        const queueSlotIndex: number = queueSlots.findIndex((object: any) => {
          return object.customer === requestData.userEmail;
        });
        if (queueSlotIndex === -1) {
          return res.status(404).json({
            general: "could not find the customer position.",
          });
        }

        const currentWaitTime: number = queueSlotIndex * averageWaitTime;
        const queuePosition: number = queueSlotIndex + 1;
        const slotInfo = {
          ticketNumber: queueSlots[queueSlotIndex].ticketNumber,
          password: queueSlots[queueSlotIndex].password,
          currentWaitTime: currentWaitTime,
          queuePosition: queuePosition,
          general: "successful",
        };
        return res.status(200).json(slotInfo);
      }
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

  let customer = createQueueSlotCredentials(requestData.userEmail);

  db.collection("queues")
    .where("queueName", "==", requestData.queueName)
    .get()
    .then((data) => {
      let isActive = data.docs[0].data().isActive;
      if (isActive) {
        db.collection("queues")
          .doc(requestData.queueName)
          .update({
            queueSlots: firebase.firestore.FieldValue.arrayUnion(customer),
          });
        db.collection("users")
          .doc(requestData.userEmail)
          .update({ currentQueue: requestData.queueName });

        return res.status(201).json({
          general: `${requestData.userEmail} has been added into queue ${requestData.queueName} successfully`,
        });
      } else {
        return res
          .status(403)
          .json({ general: "Queue is currently not active" });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(404).json({ general: "Queue is not found" });
    });
};

/**
 * Remove the customer's current queue from the
 */
const abandonQueueSlot = async (req: Request, res: Response) => {
  const userData = {
    currentQueue: req.body.currentQueue,
    userEmail: req.body.userEmail,
    userType: req.body.userType,
  };

  if (userData.userType === "customer") {
    if (userData.currentQueue === null) {
      return res
        .status(404)
        .json({ general: "You are not currently in a queue" });
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
          .update({ queueSlots });
        // remove currentQueue from customer account
        db.collection("users")
          .doc(userData.userEmail)
          .update({ currentQueue: null });

        // return OK response to client
        return res.status(200).json({
          general: `Removed ${userData.userEmail} from queue ${userData.currentQueue} successfully`,
        });
      })
      .catch((err) => {
        console.error(err);
        return res
          .status(500)
          .json({ general: "Something went wrong, please try again" });
      });
    return res.status(200); // every code path must return a value
  } else {
    return res.status(500).json({ general: "Please login in as a customer" });
  }
};

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
  VIPEnterQueue,
  abandonQueueSlot,
  changeQueueStatus,
  // getFavouriteQueuesForCustomer,
};
