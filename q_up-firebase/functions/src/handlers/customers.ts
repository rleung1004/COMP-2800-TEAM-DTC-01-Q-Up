import {db, admin} from "../util/admin";
import {Request, Response} from "express";
import {validateCustomerData} from "../util/validators";

/**
 * Registers the customer.
 * first, checks if the user is a customer, then checks if the provided info is valid, then it updates the customer
 * information by adding thei phone number of postal code.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         - 401 if the user is not of type customer
 *                  - 400 if the customer info is invalid
 *                  - 500 if an error occurs in the midst of the query
 *                  - 200 if successful
 */
export const registerCustomer = async (req: Request, res: Response) => {
    const requestData = {
        userEmail : req.body.userEmail,
        userType: req.body.userType,
        phoneNumber: req.body.phoneNumber,
        postalCode: req.body.postalCode,
    };
    const userInfo = {
        phoneNumber: requestData.phoneNumber,
        postalCode: requestData.postalCode,
    };
    if (requestData.userType !== 'customer') {
        return res.status(401).json({general: "unauthorized!"});
    }
    const {errors, valid} = validateCustomerData(userInfo);
    if (!valid) {
        return res.status(400).json(errors);
    }
    return await db
        .collection('users')
        .doc(requestData.userEmail)
        .update(userInfo)
        .then(()=> res.status(200).json({general: "registered the customer successfully!"}))
        .catch(err => {
            console.error(err);
            return res.status(500).json({
                general: "something went wrong during update!",
                error: err,
            })
        })
};

/**
 * Updates the customer info.
 * first, checks if the user is a customer, then checks if the provided info is valid, then it updates the customer
 * information.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         - 403 if the user is not of type customer
 *                  - 400 if the customer info is invalid
 *                  - 500 if an error occurs in the midst of the query
 *                  - 201 if successful
 */
export const updateCustomerInfo = async (req: Request, res: Response) => {
    const requestData = {
        userEmail : req.body.userEmail,
        userType: req.body.userType,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        postalCode: req.body.postalCode,
    };
    const userInfo = {
        phoneNumber: requestData.phoneNumber,
        postalCode: requestData.postalCode,
    };
    if (requestData.userType !== 'customer') {
        return res.status(401).json({general: "unauthorized!"});
    }
    const {errors, valid} = validateCustomerData(userInfo);
    if (!valid) {
        return res.status(400).json(errors);
    }
    const oldQueueInfo = await db
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
    if (oldQueueInfo === null) {
        return res.status(404).json({general: "did not find the customer in the database!"});
    }
    if (oldQueueInfo.currentQueue !== null) {
        await db
            .collection('queues')
            .where('queueName', '==', oldQueueInfo.currentQueue)
            .get()
            .then(data => {
                const queueSlots: Array<any> = data.docs[0].data().queueSlots;
                queueSlots.forEach(queueSlot => {
                    if (queueSlot.customer === requestData.userEmail) {
                        queueSlot["customer"] = requestData.email;
                        return;
                    }
                });
                db.collection('queues').doc(oldQueueInfo.currentQueue).update({queueSlots: queueSlots});
            })
            .catch(err => console.error(err));
    }
    return await db
        .collection('users')
        .doc(requestData.userEmail)
        .delete()
        .then(async() => {
            await admin
                .auth()
                .updateUser(oldQueueInfo.userId, {
                    email: requestData.email,
                })
                .then(async() => {
                    await db
                        .collection('users')
                        .doc(requestData.email)
                        .set({
                            currentQueue: oldQueueInfo.currentQueue,
                            email: requestData.email,
                            favoriteBusinesses: oldQueueInfo.favoriteBusinesses,
                            userId: oldQueueInfo.userId,
                            userType: requestData.userType,
                            phoneNumber: req.body.phoneNumber,
                            postalCode: req.body.postalCode,
                        })
                        .then(()=> res.status(201).json({
                            general: "user information have been updated successfully!"}))
                })
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({
                general: 'something went wrong!',
                error: err
            })
        })
};

/**
 * Gets the customer info.
 * first, checks if the user is a customer, then gets the customer information.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         - 401 if the user is not of type customer
 *                  - 500 if an error occurs in the midst of the query
 *                  - 200 if successful
 */
export const getCustomer = async (req: Request, res: Response) => {
    const userType = req.body.userType;
    const userEmail = req.body.userEmail;

    if (userType !== "customer") {
        return res
            .status(401)
            .json({general: "Access forbidden, login as a customer"});
    } else {
        await db
            .collection("users")
            .where("email", "==", userEmail)
            .limit(1)
            .get()
            .then((data) => {
                let customerData = {
                    email: data.docs[0].data().email,
                    phoneNumber: data.docs[0].data().phoneNumber,
                    postalCode: data.docs[0].data().postalCode,
                };

                return res.status(200).json({
                    general: "successful",
                    customerData: customerData,
                });
            })
            .catch((err) => {
                console.error(err);
                return res
                    .status(500)
                    .json({general: "Something went wrong, please try again"});
            });
    }
    return res.status(200);
};

/**
 * Deletes the customer.
 * first, checks if the user is a customer, then deletes the customer from the database.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         - 401 if the user is not of type customer
 *                  - 500 if an error occurs in the midst of the query
 *                  - 201 if successful
 */
export const deleteCustomer = async (req: Request, res: Response) => {
    const userEmail = req.body.userEmail;
    const userType = req.body.userType;

    if (userType !== "customer") {
        return res
            .status(401)
            .json({general: "Access forbidden, login as a customer"});
    } else {
        await db
            .collection("users")
            .where("email", "==", userEmail)
            .limit(1)
            .get()
            .then((data) => {
                let userUID = data.docs[0].data().userId;
                admin.auth().deleteUser(userUID);

                db.collection("users").doc(userEmail).delete();

                return res
                    .status(200)
                    .json({general: "account deleted successfully"});
            })
            .catch((err) => {
                console.error(err);
                return res
                    .status(500)
                    .json({general: "Something went wrong, please try again"});
            });
    }
    return res.status(200);
};

