import { admin, db } from "../util/admin";
import { Request, Response } from "express";

export const FBAuth = (req: Request, res: Response, next: Function) => {
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

  admin
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
          let accountType = data.docs[0].data().accountType;
          Object.assign(req.body, { userEmail, accountType });
          return next();
        });
    })
    .catch((err) => {
      console.error("Error while verifying token", err);
      return res.status(403).json(err);
    });
  return undefined;
};
