import * as functions from "firebase-functions";
import { getQueues, enterQueue } from "./handlers/queues";
import * as express from "express";
import { customerSignup, login, businessSignup } from "./handlers/users";
import { FBAuth } from "./util/fbAuth";

const app = express();

// all routes start with https://us-central1-q-up-c2b70.cloudfunctions.net/api

// queue routes
app.get("/getQueue", getQueues);
app.post("/enterQueue", FBAuth, enterQueue);

// customer signup route
app.post("/customer/signup", customerSignup);
// Business sign up
app.post("/business/signup", businessSignup);
// login route
app.post("/login", login);

exports.api = functions.https.onRequest(app);
