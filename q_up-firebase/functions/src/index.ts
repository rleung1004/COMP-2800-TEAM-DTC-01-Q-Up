import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as firebase from "firebase";

const app = express();

admin.initializeApp();

const db = admin.firestore();

const firebaseConfig = {
  apiKey: "AIzaSyCd2O4kN23xnVMtzVKm_fzt4iBQ7VH7T_8",
  authDomain: "q-up-c2b70.firebaseapp.com",
  databaseURL: "https://q-up-c2b70.firebaseio.com",
  projectId: "q-up-c2b70",
  storageBucket: "q-up-c2b70.appspot.com",
  messagingSenderId: "840558505517",
  appId: "1:840558505517:web:37045d8504c3c1f257d2a4",
  measurementId: "G-016HG4TWHN",
};

firebase.initializeApp(firebaseConfig);
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

app.get("/getQueue", (_, res) => {
  db.collection("queue")
    .get()
    .then((data) => {
      let queue: Array<object> = [];
      data.forEach((doc) => {
        queue.push({
          queueId: doc.id,
          userName: doc.data().userName,
          position: doc.data().password,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(queue);
    })
    .catch((err) => console.error(err));
});

app.post("/enterQueue", (req, res) => {
  const newUser = {
    position: req.body.position,
    userName: req.body.userName,
    createdAt: new Date().toISOString(),
  };

  db.collection("queue")
    .add(newUser)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
});

const isEmpty = (string: string) => {
  if (string.trim() === "") return true;
  else return false;
};

const isEmail = (email: string) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

// Signup route
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };

  let errors = {};

  if (isEmpty(newUser.email)) {
    Object.assign(errors, { email: "Must not be empty" });
  }
  if (!isEmail(newUser.email)) {
    Object.assign(errors, { email: "Must be a valid email address" });
  }

  if (isEmpty(newUser.password)) {
    Object.assign(errors, { password: "Must not be empty" });
  }

  if (newUser.password !== newUser.confirmPassword) {
    Object.assign(errors, { confirmPassword: "Passwords must match" });
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  } else {
    let token: string;
    let userId: any;
    db.doc(`/users/${newUser.email}`)
      .get()
      .then(() => {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password)
          .then((data) => {
            userId = data.user?.uid;
            return data.user?.getIdToken().then((generatedToken) => {
              token = generatedToken;
              const userCredentials = {
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId,
              };
              return db
                .doc(`/users/${newUser.email}`)
                .set(userCredentials)
                .then(() => {
                  return res.status(201).json({ token });
                });
            });
          });
      })
      .catch((err) => {
        console.error(err);
        if (err.code === "auth/email-already-in-use") {
          return res.status(400).json({ email: "Email is already in use" });
        } else {
          return res.status(500).json({ error: err.code });
        }
      });
    return res.status(201);
  }
});

// login route

app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  let errors = {};

  if (isEmpty(user.email)) {
    Object.assign(errors, { email: "Must not be empty" });
  }

  if (isEmpty(user.password)) {
    Object.assign(errors, { password: "Must not be empty" });
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  } else {
    firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then((data) => {
        return data.user?.getIdToken().then((generatedToken) => {
          return res.status(200).json({ generatedToken });
        });
      })
      .catch((err) => {
        if (err.code === "auth/wrong-password") {
          return res
            .status(403)
            .json({ general: "Wrong credentials, please try again" });
        } else {
          return res.status(500).json({ error: err.code });
        }
      });
    return res.status(200);
  }
});

exports.api = functions.https.onRequest(app);
