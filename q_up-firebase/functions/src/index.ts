import * as functions from "firebase-functions";
import {
  getTellerQueueList,
  getQueueInfoForBusiness,
  getQueueSlotInfo,
  customerEnterQueue,
  boothEnterQueue,
  VIPEnterQueue,
  // removeQueueSlot,
  changeQueueStatus,
  getFavouriteQueuesForCustomer,
} from "./handlers/queues";
import * as express from "express";
import { signup, login, updateCustomerInfo } from "./handlers/users";
import { updateBusiness, uploadBusinessImage } from "./handlers/businesses";
import { FBAuth } from "./util/fbAuth";
// TODO: bring in express-rate-limit (https://www.npmjs.com/package/express-rate-limit)

const app = express();

// all routes start with https://us-central1-q-up-c2b70.cloudfunctions.net/api

// Signup route
app.post("/signup", signup);

// login route
app.post("/login", login);

// add or update customer and business information
app.post("/updateCustomerInfo", FBAuth, updateCustomerInfo);
app.post("/updateBusiness", FBAuth, updateBusiness);
app.post("/uploadBusinessImage", FBAuth, uploadBusinessImage);

//Queue routes
app.post("/tellerQueueList", FBAuth, getTellerQueueList);
app.post("/businessQueueInfo", FBAuth, getQueueInfoForBusiness);
app.post("/customerQueueInfo", FBAuth, getQueueSlotInfo);
app.post("/customerEnterQueue", FBAuth, customerEnterQueue);
app.post("/boothEnterQueue", FBAuth, boothEnterQueue);
app.post("/VIPEnterQueue", FBAuth, VIPEnterQueue);
// app.post('/removeFromQueue', FBAuth, removeQueueSlot);
app.post("/changeQueueStatus", FBAuth, changeQueueStatus);
app.get("/getFavouriteQueues", FBAuth, getFavouriteQueuesForCustomer);

exports.api = functions.https.onRequest(app);
