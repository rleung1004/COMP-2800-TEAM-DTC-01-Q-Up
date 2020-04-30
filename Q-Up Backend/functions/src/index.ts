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

// Signup route
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };

  // TODO: validate data
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
});

exports.api = functions.https.onRequest(app);
