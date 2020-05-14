import {db} from "../util/admin";
import {Request, Response} from "express";
import {signUp} from "./users";
import {createBoothQueueSlot} from "../util/helpers";

/**
 * Creates a new account for the booth.
 */
export const createNewBooth = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        password: req.body.password,
    };
    if (requestData.userType !== "manager") {
        return res.status(401).json({
            general: "unauthorized!",
        });
    }
    Object.assign(req.body, {userType: "booth"});
    Object.assign(req.body, {confirmPassword: requestData.password});
    return await signUp(req, res);
};

/**
 * Adds a booth customer to a queue.
 */
export const boothEnterQueue = async (req: Request, res: Response) => {
    const requestData = {
        userName: req.body.userName,
        userType: req.body.userType,
        queueName: req.body.queueName,
    };
    if (requestData.userType !== "booth") {
        res.status(401).json({general: "unauthorized!"});
    } else {
        await db
            .collection("queues")
            .where("queueName", "==", requestData.queueName)
            .get()
            .then((data) => {
                const usableData = data.docs[0].data();
                const queueSlots: Array<any> = usableData.queueSlots;
                const isActive: boolean = usableData.isActive;
                if (isActive) {
                    let newSlot = createBoothQueueSlot(requestData.userName, 0);
                    if (queueSlots.length !== 0) {
                        newSlot.ticketNumber =
                            queueSlots[queueSlots.length - 1].ticketNumber + 1;
                    }

                    queueSlots.push(newSlot);
                    db.collection("queues").doc(usableData.queueName).update(usableData);
                    return res.status(201).json({
                        general: `${newSlot.customer} has been added to ${usableData.queueName} successfully`,
                    });
                } else {
                    return res
                        .status(403)
                        .json({general: "Queue is currently not active"});
                }

            })
            .catch((err) => {
                console.log(err);
                return res.status(404).json({
                    general: " could not create the new slot for the booth customer!",
                    error: err,
                });
            });
    }
};

