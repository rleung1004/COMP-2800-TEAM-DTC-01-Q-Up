import { db } from "../util/admin";
import { Request, Response } from "express";
import {signup} from "./users";
import {createBoothQueueSlot} from "../util/helpers";

/**
 * Creates a new account for the booth.
 */
const createNewBooth = async (req: Request, res: Response) => {
     const requestData = {
         businessName: req.body.business,
         userType: req.body.userType,
         email: req.body.email,
         password: req.body.password
     };
     if (requestData.userType !== 'manager') {
         return res.status(401).json({
             general: 'unauthorized!',
         })
     }
     Object.assign(req.body.userType, 'booth');
     Object.assign(req.body.confirmPassword, requestData.password);
     return await signup(req, res);
};

/**
 * Adds a booth customer to a queue
 */
const boothEnterQueue = async (req: Request, res: Response) => {
    const requestData = {
        userName: req.body.userName,
        userType: req.body.userType,
        queueName: req.body.queueName,
    };
    if (requestData.userType !== 'booth') {
        return res.status(401).json({
            general: 'unauthorized!',
        })
    }
    let newSlot: any;
    await db
        .collection('queues')
        .where('queueName', '==', requestData.queueName)
        .get()
        .then(data => {
            const usableData = data.docs[0].data();
            const queueSlots: Array<any> = usableData.queueSlots;
            Object.assign(newSlot, createBoothQueueSlot(requestData.userName, queueSlots[queueSlots.length - 1].ticketNumber));
            queueSlots.push(newSlot);
            db.collection("queues").doc(usableData.queueName).update(usableData);
            return res.status(201).json({
                general: `${newSlot} has been added to ${usableData.queueName} successfully`,
            });
        })
        .catch((err)=> {
            console.log(err);
            return res.status(404).json({
                general:' could not create the new slot for the booth customer!',
                error: err,
            })
        });
};


