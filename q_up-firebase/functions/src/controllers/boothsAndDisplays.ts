import {Request, Response} from "express";
import {internalSingUp} from "./users";
import {db} from "../util/firebaseConfig";

/**
 * Creates a new account for the booth.
 * first Checks if the accessing user has the authority, then signs up a booth
 *
 * @param req:      express Request Object
 * @returns         Boolean true if registered successfully, otherwise false
 */
export const registerNewBooth = async (req: Request) => {
    const requestData = {
        businessName: req.body.businessName,
        userType: req.body.userType,
        password: req.body.gadgetPassword,
    };
    if (requestData.userType !== "manager") {
        return false;
    }
    Object.assign(req.body, {
        userType: "booth",
        password: requestData.password,
        confirmPassword: requestData.password,
        email: `defaultBooth@${requestData.businessName}.qup`,
    });
    return await internalSingUp(req);
};

/**
 * Creates a new account for the display.
 * first Checks if the accessing user has the authority, then signs up a booth
 *
 * @param req:          express Request Object
 * @returns Boolean     true if registered successfully, otherwise false
 */
export const registerNewDisplay = async (req: Request) => {
    const requestData = {
        businessName: req.body.businessName,
        userType: req.body.userType,
        password: req.body.gadgetPassword,
    };
    if (requestData.userType !== "manager") {
        return false;
    }
    Object.assign(req.body, {
        userType: "display",
        password: requestData.password,
        confirmPassword: requestData.password,
        email: `defaultDisplay@${requestData.businessName}.qup`,
    });
    return await internalSingUp(req);
};

/**
 * Gets the display info for a business.
 * first, checks if the user is of type display, then it will get the information of the queue for the display.
 *
 * @param req:          express Request Object
 * @param res:          express Response Object
 * @returns Response    the response data with the status code:
 *
 *                      - 401 if the user is not of type display
 *                      - 500 if an error occurs in the midst of the query
 *                      - 200 if successful
 */
export const getDisplayInfo = async (req: Request, res: Response) => {
    const requestData = {
        businessName: req.body.businessName,
        userType: req.body.userType,
    };
    if (requestData.userType !== "display") {
        return res.status(401).json({general: "unauthorized. Login as a display of the business!"});
    }
    return await db
        .collection('businesses')
        .where("name", '==', requestData.businessName)
        .get()
        .then(data =>{
            const queueSlots = data.docs[0].data().queue.queueSlots;
            let ticketNumbers: Array<number> = [];
            queueSlots.forEach((queueSlot: any) => {
                ticketNumbers.push(queueSlot.ticketNumber);
            });
            let displayInfo: Array<number>;
            if (ticketNumbers.length > 10) {
                displayInfo = ticketNumbers.splice(0, 10);
            } else {
                displayInfo = ticketNumbers;
            }
            return res.status(200).json({
                general:"obtained the display information successfully",
                displayInfo: displayInfo,
                estimatedWaitTime: data.docs[0].data().queue.currentWaitTime,
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
