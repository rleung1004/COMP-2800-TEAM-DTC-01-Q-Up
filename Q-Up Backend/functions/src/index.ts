import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";

admin.initializeApp();
const app = express();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
app.get("/getQueue", (req, res) => {
  admin
    .firestore()
    .collection("queues")
    .get()
    .then((data) => {
      let queue: Array<object> = [];
      data.forEach((doc) => {
        queue.push(doc.data());
      });
      return res.json(queue);
    })
    .catch((err) => console.error(err));
});

app.post("/enterQueue", (req, res) => {
  const newUser = {
    position: req.body.position,
    userName: req.body.userName,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  };

  admin
    .firestore()
    .collection("queues")
    .add(newUser)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
});

exports.api = functions.https.onRequest(app);
