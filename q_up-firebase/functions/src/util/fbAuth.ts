import { admin, db } from "../util/admin";
import { Request, Response } from "express";

/**
 * Authenticates the users upon using this applications api routes.
 */
export const FBAuth = async (req: Request, res: Response, next: Function) => {
  let idToken: string;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found");
    return res.status(403).json({ error: "Unauthorized" });
  }

  await admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      Object.assign(req.body, { decodedToken });
      return db
        .collection("users")
        .where("userId", "==", req.body.decodedToken.uid)
        .limit(1)
        .get()
        .then((data) => {
          let userEmail = data.docs[0].data().email;
          let userType = data.docs[0].data().userType;
          if (userType === "manager") {
            let businessName = data.docs[0].data().businessName;
            Object.assign(req.body, {userEmail, userType, businessName });
          } else if (userType === "customer") {
            let currentQueue = data.docs[0].data().currentQueue;
            Object.assign(req.body, { userEmail, userType, currentQueue });
          } else {
            let queueName = data.docs[0].data().queueName;
            Object.assign(req.body, { userEmail, userType, queueName });
          }
          return next();
        });
    })
    .catch((err) => {
      console.error("Error while verifying token", err);
      return res.status(403).json(err);
    });
  return undefined;
};
