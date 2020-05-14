import {db, admin} from "../util/admin";
import {Request, Response} from "express";
import {validateCustomerData} from "../util/validators";

/**
 * Updates the customer info.
 */
export const updateCustomerInfo = (req: Request, res: Response) => {
    const userType = req.body.userType;
    const userEmail = req.body.userEmail;
    const userRef = db.collection("users").doc(userEmail);
    const userInfo = {
        phoneNumber: req.body.phoneNumber,
        postalCode: req.body.postalCode,
    };

    const {errors, valid} = validateCustomerData(userInfo);

    if (!valid) {
        return res.status(400).json(errors);
    } else {
        if (userType === "customer") {
            userRef
                .get()
                .then((docSnapshot) => {
                    if (docSnapshot.exists) {
                        userRef.update(userInfo);
                    } else {
                        res.status(403).json({
                            general:
                                "Access forbidden. Please login as a customer to gain access.",
                        });
                    }
                })
                .catch(() => {
                    return res
                        .status(500)
                        .json({general: "Something went wrong. Please try again"});
                });
            return res.status(201).json({
                general: `${userEmail} phone number and postal code have been updated`,
            });
        } else {
            return res.status(403).json({
                general: "Access forbidden. Please login as a customer to gain access.",
            });
        }
    }
};

/**
 * Gets the customer info.
 */
export const getCustomerInfo = async (req: Request, res: Response) => {
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

                return res.status(200).json({general: "SUCCESS", customerData});
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
 * Deletes the customer info.
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
            });
    }
    return res.status(200);
};

