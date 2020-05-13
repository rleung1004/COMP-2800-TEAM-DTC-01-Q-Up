import * as functions from "firebase-functions";
import {
  getTellerQueueList,
  getQueueInfoForBusiness,
  getQueueSlotInfo,
  customerEnterQueue,
  VIPEnterQueue,
  abandonQueueSlot,
  changeQueueStatus,
  getFavouriteQueuesForCustomer,
} from "./handlers/queues";
import { boothEnterQueue, createNewBooth } from "./handlers/booths";
import * as express from "express";
import * as cors from "cors";
import {signup, login, changePassword, logout} from "./handlers/users";
import {
  updateCustomerInfo,
  deleteCustomer,
  getCustomerInfo,
} from "./handlers/customers";
import {
  updateBusiness,
  uploadBusinessImage,
  getBusiness,
} from "./handlers/businesses";
import { FBAuth } from "./util/fbAuth";
import algoliasearch from "algoliasearch";
import {
  checkInQueue,
  createNewEmployee,
  deleteEmployee,
  getListOfAllEmployees, getOnlineEmployees,
  updateEmployee
} from "./handlers/employees";

const app = express();
app.use(cors());

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex("businesses");

// all routes start with https://us-central1-q-up-c2b70.cloudfunctions.net/api

// Signup /login routes
app.post("/signup", signup);
app.post("/login", login);
app.get('/logout', FBAuth, logout);

// change password route
app.post("/changePassword", FBAuth, changePassword);

// business routes
app.post("/uploadBusinessImage", FBAuth, uploadBusinessImage);
app.get("/getBusiness", FBAuth, getBusiness);
app.post("/updateBusiness", FBAuth, updateBusiness);

// Queue routes
app.post("/tellerQueueList", FBAuth, getTellerQueueList);
app.post("/businessQueueInfo", FBAuth, getQueueInfoForBusiness);
app.get("/getCustomerQueueInfo", FBAuth, getQueueSlotInfo);
app.post("/customerEnterQueue", FBAuth, customerEnterQueue);
app.post("/VIPEnterQueue", FBAuth, VIPEnterQueue);
app.post("/abandonQueueSlot", FBAuth, abandonQueueSlot);
app.post("/changeQueueStatus", FBAuth, changeQueueStatus);
app.get("/getFavouriteQueues", FBAuth, getFavouriteQueuesForCustomer);

// customer routes
app.get("/getCustomerInfo", FBAuth, getCustomerInfo);
app.delete("/deleteCustomer", FBAuth, deleteCustomer);
app.post("/updateCustomer", FBAuth, updateCustomerInfo);

// booth routes
app.post("/boothEnterQueue", FBAuth, boothEnterQueue);
app.post("/createNewBooth", FBAuth, createNewBooth);

// employee routes
app.post('/createEmployee', FBAuth, createNewEmployee);
app.post('/updateEmployee', FBAuth, updateEmployee);
app.post('/deleteEmployee', FBAuth, deleteEmployee);
app.post('/checkInQueue', FBAuth, checkInQueue);
app.post('/getListOfAllEmployees', FBAuth, getListOfAllEmployees);
app.post('/getOnlineEmployees', FBAuth, getOnlineEmployees);



exports.addToIndex = functions.firestore
  .document("businesses/{businessId}")
  .onCreate((snapshot) => {
    const data = snapshot.data();
    const objectID = snapshot.id;

    return index.saveObject({ ...data, objectID });
  });

exports.updateIndex = functions.firestore
  .document("businesses/{businessId}")
  .onUpdate((change) => {
    const newData = change.after.data();
    const objectID = change.after.id;

    return index.saveObject({ ...newData, objectID });
  });

exports.deleteFromIndex = functions.firestore
  .document("businesses/{businessId}")
  .onDelete((snapshot) => {
    index.deleteObject(snapshot.id);
  });

exports.api = functions.https.onRequest(app);
