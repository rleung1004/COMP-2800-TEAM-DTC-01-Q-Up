import { db, admin } from "../util/admin";
import * as firebase from "firebase";
import { firebaseConfig } from "../util/config";
import { Request, Response } from "express";
import {
  validateSignUpData,
  validateLoginData,
  validateCustomerData,
} from "../util/validators";

firebase.initializeApp(firebaseConfig);

const signup = async (req: Request, res: Response) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userType: req.body.userType,
    business: req.body.business,
  };

  const { valid, errors } = validateSignUpData(newUser);

  if (!valid) {
    return res.status(400).json(errors);
  } else {
    let token: string;
    let userId: any;

    await firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then((data) => {
        userId = data.user?.uid;
        return data.user?.getIdToken().then((generatedToken) => {
          token = generatedToken;
          if (newUser.userType === "customer") {
            const userCredentials = {
              email: newUser.email,
              currentQueue: null,
              favoriteBusinesses: [],
              userId,
              userType: newUser.userType,
            };
            return db
              .doc(`/users/${newUser.email}`)
              .set(userCredentials)
              .then(() => {
                return res.status(201).json({ token });
              });
          } else if (newUser.userType === "manager") {
            const userCredentials = {
              email: newUser.email,
              businessList: [],
              userId,
              userType: newUser.userType,
            };
            return db
              .doc(`/users/${newUser.email}`)
              .set(userCredentials)
              .then(() => {
                return res.status(201).json({ token });
              });
          } else {
            const userCredentials = {
              email: newUser.email,
              business: newUser.business,
              userId,
              userType: newUser.userType,
            };
            return db
              .doc(`/users/${newUser.email}`)
              .set(userCredentials)
              .then(() => {
                return res.status(201).json({ token });
              });
          }
        });
      })
      .catch((err) => {
        console.error(err);
        if (err.code === "auth/email-already-in-use") {
          return res.status(400).json({ email: "Email is already in use" });
        } else {
          return res
            .status(500)
            .json({ general: "Something went wrong, please try again" });
        }
      });
    return res.status(201);
  }
};

const login = async (req: Request, res: Response) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  const { valid, errors } = validateLoginData(user);

  let resData = {};

  if (!valid) {
    return res.status(400).json(errors);
  } else {
    await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then((data) => {
        return data.user?.getIdToken().then((generatedToken) => {
          Object.assign(resData, { generatedToken });
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
                  let userId = data.docs[0].data().userId;
                  let userEmail = data.docs[0].data().email;
                  let userType = data.docs[0].data().userType;
                  Object.assign(resData, { userId, userType, userEmail });
                  return res.status(201).json(resData);
                });
            });
        });
      })
      .catch(() => {
        return res
          .status(403)
          .json({ general: "Wrong credentials, please try again" });
      });
    return res.status(200);
  }
};
const updateCustomerInfo = (req: Request, res: Response) => {
  const userType = req.body.userType;
  const userEmail = req.body.userEmail;
  const userRef = db.collection("users").doc(userEmail);
  const userInfo = {
    phoneNumber: req.body.phoneNumber,
    postalCode: req.body.postalCode,
  };

  const { errors, valid } = validateCustomerData(userInfo);

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
            userRef.set(userInfo, { merge: true });
          }
        })
        .catch(() => {
          return res
            .status(500)
            .json({ general: "Something went wrong. Please try again" });
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

export { signup, login, updateCustomerInfo };
