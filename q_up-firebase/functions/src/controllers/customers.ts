import {db, admin} from "../util/firebaseConfig";
import {Request, Response} from "express";
import {validateCustomerData} from "../util/helpers";

/**
 * Registers the customer.
 * first, checks if the user is a customer, then checks if the provided info is valid, then it updates the customer
 * information by adding their phone number of postal code.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         the response data with the status code:
 *
 *                  - 401 if the user is not of type customer
 *                  - 403 if the customer info is invalid
 *                  - 500 if an error occurs in the midst of the query
 *                  - 200 if successful
 */
export const registerCustomer = async (req: Request, res: Response) => {
    const requestData = {
        userEmail: req.body.userEmail,
        userType: req.body.userType,
        phoneNumber: req.body.phoneNumber,
        postalCode: req.body.postalCode,
    };
    const userInfo = {
        phoneNumber: requestData.phoneNumber,
        postalCode: requestData.postalCode,
    };
    if (requestData.userType !== 'customer') {
        res.status(401).json({general: "unauthorized. Login as a customer"});
    }
    const {errors, valid} = validateCustomerData(userInfo);
    if (!valid) {
        return res.status(403).json(errors);
    }
    return await db
        .collection('users')
        .doc(requestData.userEmail)
        .update(userInfo)
        .then(() => res.status(200).json({general: "registered the customer successfully!"}))
        .catch(async (err) => {
            console.error(err);
            return res.status(500).json({
                general: "Internal Error. Something went wrong!",
                error: await err.toString(),
            });
        });
};

/**
 * Updates the customer info.
 * first, checks if the user is a customer, then checks if the provided info is valid, then it updates the customer
 * information in the authentication, and creates a new customer to replace the old one in the database.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         the response data with the status code:
 *
 *                  - 401 if the user is not of type customer
 *                  - 403 if the customer information is invalid
 *                  - 404 if the customer information is not found
 *                  - 500 if an error occurs in the midst of the query
 *                  - 202 if successful
 */
export const updateCustomerInfo = async (req: Request, res: Response) => {
    const requestData = {
        userEmail: req.body.userEmail,
        userType: req.body.userType,
        email: req.body?.email,
        phoneNumber: req.body.phoneNumber,
        postalCode: req.body.postalCode,
    };
    const userInfo = {
        phoneNumber: requestData.phoneNumber,
        postalCode: requestData.postalCode,
    };
    if (requestData.userType !== 'customer') {
        return res.status(401).json({general: "unauthorized. Login as a customer"});
    }
    const {errors, valid} = validateCustomerData(userInfo);
    if (!valid) {
        return res.status(403).json(errors);
    }

    const oldCustomerInfo = await db
        .collection('users')
        .where('email', '==', requestData.userEmail)
        .get()
        .then(data => {
            return {
                favoriteBusinesses: data.docs[0].data().favoriteBusinesses,
                currentQueue: data.docs[0].data().currentQueue,
                userId: data.docs[0].data().userId,
            }
        })
        .catch(err => {
            console.error(err);
            return null;
        });
    if (oldCustomerInfo === null) {
        return res.status(404).json({general: "did not find the customer in the database!"});
    }
    if (oldCustomerInfo.currentQueue !== null) {
        await db
            .collection('businesses')
            .where('name', '==', oldCustomerInfo.currentQueue)
            .get()
            .then(data => {
                const queue: any = data.docs[0].data().queue;
                const queueSlots: Array<any> = queue.queueSlots;
                queueSlots.forEach(queueSlot => {
                    if (queueSlot.customer === requestData.userEmail) {
                        queueSlot["customer"] = requestData.email;
                        return;
                    }
                });
                queue['queueSlots'] = queueSlots;
                db.collection('businesses').doc(oldCustomerInfo.currentQueue).update({queue: queue});
            })
            .catch(err => console.error(err));
    }
    if (requestData.email) {
        return await db
            .collection('users')
            .doc(requestData.userEmail)
            .delete()
            .then(async () => {
                await admin
                    .auth()
                    .updateUser(oldCustomerInfo.userId, {
                        email: requestData.email,
                    })
                    .then(async () => {
                        await db
                            .collection('users')
                            .doc(requestData.email)
                            .set({
                                currentQueue: oldCustomerInfo.currentQueue,
                                email: requestData.email,
                                favoriteBusinesses: oldCustomerInfo.favoriteBusinesses,
                                userId: oldCustomerInfo.userId,
                                userType: requestData.userType,
                                phoneNumber: req.body.phoneNumber,
                                postalCode: req.body.postalCode,
                            })
                            .then(() => res.status(202).json({
                                general: "user information have been updated successfully!"
                            }))
                    })
            })
            .catch(async (err) => {
                console.error(err);
                return res.status(500).json({
                    general: "Internal Error. Something went wrong!",
                    error: await err.toString(),
                });
            });
    } else {
        return await db
            .collection("users")
            .doc(requestData.userEmail)
            .update(userInfo)
            .then(()=> res.status(200).json({general:"success"}))
            .catch(err => {
                console.error(err);
                return res.status(200).json({general:"bad bad bad abd fuck fuck fuck fuck fuck ..."});
            })
    }
};

/**
 * Gets the customer info.
 * first, checks if the user is a customer, then gets the customer information.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         the response data with the status code:
 *
 *                  - 401 if the user is not of type customer
 *                  - 500 if an error occurs in the midst of the query
 *                  - 200 if successful
 */
export const getCustomer = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        userEmail: req.body.userEmail,
    };
    if (requestData.userType !== "customer") {
        return res.status(401).json({general: "unauthorized. Login as a customer"});
    }
    return await db
        .collection("users")
        .where("email", "==", requestData.userEmail)
        .get()
        .then((data) => {
            const customerData = {
                email: data.docs[0].data().email,
                phoneNumber: data.docs[0].data().phoneNumber,
                postalCode: data.docs[0].data().postalCode,
            };
            return res.status(200).json({
                general: "successful",
                customerData: customerData,
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

/**
 * Deletes the customer.
 * first, checks if the user is a customer, then deletes the customer from the database and authentication. Ensures
 * that the customer's queueSlot is also deleted if they were in a queue.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         the response data with the status code:
 *
 *                  - 401 if the user is not of type customer
 *                  - 500 if an error occurs in the midst of the query
 *                  - 202 if successful
 */
export const deleteCustomer = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        userEmail: req.body.userEmail,
    };
    if (requestData.userType !== "customer") {
        return res.status(401).json({general: "unauthorized. Login as a customer"});
    }
    return await db
        .collection("users")
        .where("email", "==", requestData.userEmail)
        .get()
        .then(async (data) => {
            const userUID = data.docs[0].data().userId;
            const currentQueue = data.docs[0].data().currentQueue;
            if (currentQueue !== null) {
                await db
                    .collection('businesses')
                    .where('name', '==', currentQueue)
                    .get()
                    .then(data => {
                        const queue: any = data.docs[0].data().queue;
                        let queueSlots: Array<any> = queue.queueSlots;
                        queueSlots = queueSlots.filter(queueSlot => queueSlot.customer !== requestData.userEmail);
                        queue.queueSlots = queueSlots;
                        db.collection('businesses').doc(currentQueue).update({queue: queue});
                    })
            }
            await admin.auth().deleteUser(userUID);
            await db.collection("users").doc(requestData.userEmail).delete();
            return res.status(202).json({general: "customer account deleted successfully"});
        })
        .catch(async (err) => {
            console.error(err);
            return res.status(500).json({
                general: "Internal Error. Something went wrong!",
                error: await err.toString(),
            });
        });
};

