import {db} from "../util/firebaseConfig";
import {Request, Response} from "express";
import {signUp} from "./users";
import {createQueueSlot} from "../util/helpers";

/**
 * Creates a new account for the booth.
 * first Checks if the accessing user has the authority, then signs up a booth
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         Response the response data with the status code:
 *
 *                  - 401 if the user is not of type manager
 *                  - the return status of signUp function
 */
export const createNewBooth = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        password: req.body.password,
    };
    if (requestData.userType !== "manager") {
        res.status(401).json({general: "unauthorized. Login as a manager of the business!"});
    }
    Object.assign(req.body, {userType: "booth"});
    Object.assign(req.body, {confirmPassword: requestData.password});
    return await signUp(req, res);
};

/**
 * Adds a walk-in customer to a queue.
 * first Checks if the accessing user has the authority, then adds the customer to the queue of the business.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         Response the response data with the status code:
 *
 *                  - 401 if the user is not of type booth
 *                  - 403 if queue is not active
 *                  - 500 if an error occurs in the midst of the query
 *                  - 201 if successful
 */
export const boothEnterQueue = async (req: Request, res: Response) => {
    const requestData = {
        userName: req.body.userName,
        userType: req.body.userType,
        businessName: req.body.businessName,
    };
    if (requestData.userType !== "booth") {
        res.status(401).json({general: "unauthorized. Requires the booth of this business!"});
    }
    return await db
        .collection("businesses")
        .where("name", "==", requestData.businessName)
        .get()
        .then(data => {
            const queue: any = data.docs[0].data().queue;
            const queueSlots: Array<any> = queue.queueSlots;
            const isActive: boolean = queue.isActive;
            if (!isActive) {
                return res.status(403).json({general: "Queue is currently not active"});
            }
            const newSlot = createQueueSlot(requestData.userName, 0);
            if (queueSlots.length > 0) {
                newSlot.ticketNumber = queueSlots[queueSlots.length - 1].ticketNumber + 1;
            }
            queueSlots.push(newSlot);
            db.collection("queues").doc(queue.queueName).update(queue);
            return res.status(201).json({
                general: `${newSlot.customer} has been added to ${requestData.businessName}'s queue successfully`,
            });
        })
        .catch(async (err) => {
            console.error(err);
            return res.status(500).json({
                general: "Internal Error. Something went wrong!",
                error: await err.toString(),
            });
        });
};

