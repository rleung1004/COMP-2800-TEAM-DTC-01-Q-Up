import {db, admin, firebaseConfig} from "../util/firebaseConfig";
import * as firebase from "firebase";
import {Request, Response} from "express";
import {validateLoginData, validateSignUpData} from "../util/helpers";

firebase.initializeApp(firebaseConfig);

/**
 * Creates user accounts for this web-app.
 * first validates the provided information, then creates a new user with email and password, and depending on the type
 * of the requested user, it will create the appropriate user in the database.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         the response data with the status code:
 *
 *                  - 403 if the provided information is not valid
 *                  - 409 if Email is already in use
 *                  - 409 if This business already has an account
 *                  - 500 if an error occurs in the midst of query
 *                  - 201 if successful
 */
export const signUp = async (req: Request, res: Response) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        userType: req.body.userType,
        businessName: req.body.businessName,
    };
    const {valid, errors} = validateSignUpData(newUser);
    if (!valid) {
        return res.status(403).json(errors);
    }
    let token: string;
    let userId: any;

    return await firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then((data) => {
            userId = data.user?.uid;
            return data.user?.getIdToken()
                .then(async (generatedToken) => {
                    token = generatedToken;
                    if (newUser.userType === "customer") {
                        return await db
                            .collection('users')
                            .doc(newUser.email)
                            .set({
                                email: newUser.email,
                                currentQueue: null,
                                favoriteBusinesses: [],
                                userId,
                                userType: newUser.userType,
                            })
                            .then(() => res.status(201).json({token}));
                    } else if (newUser.userType === "manager") {
                        return await db
                            .collection("businesses")
                            .doc(newUser.businessName)
                            .get()
                            .then((docSnapshot) => {
                                if (docSnapshot.exists) {
                                    return res.status(409).json({
                                        businessName: "This business already has an account",
                                    });
                                }
                                return db
                                    .doc(`/users/${newUser.email}`)
                                    .set({
                                        email: newUser.email,
                                        businessName: newUser.businessName,
                                        userId,
                                        userType: newUser.userType,
                                    })
                                    .then(() => res.status(201).json({token}));
                            });
                    } else if (newUser.userType === "booth") {
                        return await db
                            .doc(`/users/${newUser.email}`)
                            .set({
                                email: newUser.email,
                                businessName: newUser.businessName,
                                userId,
                                userType: "booth",
                            })
                            .then(() => res.status(201).json({token}));
                    } else {
                        return await db
                            .doc(`/users/${newUser.email}`)
                            .set({
                                email: newUser.email,
                                isOnline: false,
                                businessName: newUser.businessName,
                                userId,
                                userType: "employee",
                            })
                            .then(() => res.status(201).json({token}));
                    }
                });
        })
        .catch(async (err) => {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
                return res.status(409).json({email: "Email is already in use"});
            }
            return res.status(500).json({
                general: "Internal Error. Something went wrong!",
                error: await err.toString(),
            });
        });
};

/**
 * Logs in the users of this web-app.
 * first validates the provided information, then signs in the user with email and password, and creates a new token for
 * the specific user.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         Response the response data with the status code:
 *
 *                  - 403 if the provided information is not valid
 *                  - 500 if the credentials provided are not correct
 *                  - 201 if successful
 */
export const login = async (req: Request, res: Response) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
    };
    const {valid, errors} = validateLoginData(user);
    let resData = {};
    if (!valid) {
        return res.status(403).json(errors);
    }
    return await firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            return data.user?.getIdToken()
                .then((generatedToken) => {
                    Object.assign(resData, {generatedToken});
                    admin
                        .auth()
                        .verifyIdToken(generatedToken)
                        .then((decodedToken) => {
                            return db
                                .collection("users")
                                .where("userId", "==", decodedToken.uid)
                                .limit(1)
                                .get()
                                .then((data) => {
                                    const usableData: any = data.docs[0].data();
                                    const userId = usableData.userId;
                                    const userEmail = usableData.email;
                                    const userType = usableData.userType;
                                    if (userType === "employee") {
                                        db.collection("users")
                                            .doc(userEmail)
                                            .update({isOnline: true});
                                    }
                                    Object.assign(resData, {userId, userType, userEmail});
                                    return res.status(201).json(resData);
                                });
                        })
                        .catch(async err => {
                            console.error(err);
                            return res.status(404).json({
                                general:"Account does not exist!",
                                error: await err.toString(),
                            });
                        })
                });
        })
        .catch(async (err) => {
            console.error(err);
            return res.status(500).json({
                general: "Wrong Credentials. Please try again!",
                error: await err.toString(),
            });
        });
};

/**
 * Logs out the users of our application.
 * signs out the users and then if the user type is employee, it will update their isOnline to be false. Finally, delete
 * their session token key so they wont be able to access the APIs until sing in again.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         Response the response data with the status code:
 *
 *                  - 500 if the log out was unsuccessful
 *                  - 404 if can not find the user userId
 *                  - 200 if successful
 */
export const logout = async (req: Request, res: Response) => {
    const requestData = {
        email: req.body.userEmail,
        userType: req.body.userType,
    };
    const userUserId = await db
        .collection("users")
        .where("email", '==', requestData.email)
        .get()
        .then(data => data.docs[0].data().userId)
        .catch(err => {
            console.error(err);
            return null;
        });
    console.log(userUserId);
    if (userUserId === null) {
        return res.status(404).json({general: 'can not find the user userId',});
    }
    return await firebase
        .auth()
        .signOut()
        .then(async () => {
            if (requestData.userType === "employee") {
                db
                    .collection("users")
                    .doc(requestData.email)
                    .update({isOnline: false})
            }
            return  res.status(200).json({general: "logged out successfully"});
        })
        .catch(async (err) => {
            console.error(err);
            return res.status(500).json({
                general: "unsuccessful. Please try again!",
                error: await err.toString(),
            });
        });
};

/**
 * Changes the password for the users of this web-app.
 * first checks if the passwords are matching, then updates the authentication user with the updated password.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         Response the response data with the status code:
 *
 *                  - 403 if the provided passwords is not matching
 *                  - 404 if does not find the userId
 *                  - 500 if an error occurs in the midst of the query
 *                  - 202 if successful
 */
export const changePassword = async (req: Request, res: Response) => {
    const requestData = {
        userEmail: req.body.userEmail,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    };
    if (requestData.confirmPassword !== requestData.password) {
        return res.status(403).json({confirmPassword: "Password must match"});
    }
    const userUID = await db
        .collection("users")
        .where("email", "==", requestData.userEmail)
        .get()
        .then(data => data.docs[0].data().userId)
        .catch(err => {
            console.error(err);
            return null;
        });
    if (!userUID) {
        return res.status(404).json({general: "did not find the userId"})
    }
    return await admin
        .auth()
        .updateUser(userUID, {password: requestData.password})
        .then(() => {
            return res.status(202).json({general: "Password updated successfully"});
        })
        .catch(async (err) => {
            console.error(err);
            return res.status(500).json({
                general: "unsuccessful. Please try again!",
                error: await err.toString(),
            });
        });
};

