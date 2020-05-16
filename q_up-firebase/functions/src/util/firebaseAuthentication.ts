import {admin, db} from "./firebaseConfig";
import {Request, Response} from "express";

/**
 * Authenticates the users upon using this applications' api routes.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @param next:     a function to be invoked at the end of this function
 * @return          the response data with the status code:
 *
 *                  - 401 if unauthorized
 *                  - 500 if an error occurs in the midst of query
 *                  - the return response of the next function
 */
export const FirebaseAuthentication = async (req: Request, res: Response, next: Function) => {
    let idToken: string;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        idToken = req.headers.authorization.split("Bearer ")[1];
    } else {
        console.error("No token found");
        return res.status(401).json({error: "Unauthorized"});
    }
    return await admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
            Object.assign(req.body, {decodedToken});
            return db
                .collection("users")
                .where("userId", "==", req.body.decodedToken.uid)
                .get()
                .then((data) => {
                    console.log(data);
                    let userEmail = data.docs[0].data().email;
                    let userType = data.docs[0].data().userType;
                    if (userType === "customer") {
                        let currentQueue = data.docs[0].data().currentQueue;
                        Object.assign(req.body, {userEmail, userType, currentQueue});
                    } else {
                        let businessName = data.docs[0].data().businessName;
                        Object.assign(req.body, {userEmail, userType, businessName});
                    }
                    return next();
                });
        })
        .catch(async (err) => {
            console.error(err);
            return res.status(500).json({
                general: "Error while verifying token",
                error: await err,
            });
        });
};
