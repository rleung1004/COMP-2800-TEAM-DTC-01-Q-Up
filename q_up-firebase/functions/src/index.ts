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
  //   getFavouriteQueuesForCustomer,
} from "./handlers/queues";
import * as express from "express";
import * as cors from "cors";
import { signup, login, updateCustomerInfo } from "./handlers/users";
import {
  updateBusiness,
  uploadBusinessImage,
  getBusiness,
} from "./handlers/businesses";
import { FBAuth } from "./util/fbAuth";
// TODO: bring in express-rate-limit (https://www.npmjs.com/package/express-rate-limit)

const app = express();
app.use(cors());

// all routes start with https://us-central1-q-up-c2b70.cloudfunctions.net/api

// Get route
app.get("/getBusiness", FBAuth, getBusiness);

// Signup route
app.post("/signup", signup);

// login route
app.post("/login", login);

// add or update customer and business information
app.post("/updateCustomer", FBAuth, updateCustomerInfo);
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
// app.get("/getFavouriteQueues", FBAuth, getFavouriteQueuesForCustomer);

exports.api = functions.https.onRequest(app);
