import * as functions from "firebase-functions";
import {
    getQueue, getQueueSlotInfo, customerEnterQueue, vipEnterQueue, abandonQueue, changeQueueStatus,
    getFavouriteQueuesForCustomer, changeStatusOfFavouriteBusiness, checkInQueue, boothEnterQueue
} from './controllers/queues';
import * as express from "express";
import * as cors from "cors";
import {signUp, login, changePassword, logout} from "./controllers/users";
import {updateCustomerInfo, deleteCustomer, getCustomer, registerCustomer} from "./controllers/customers";
import {
    updateBusiness,
    uploadBusinessImage,
    getBusiness,
    registerBusiness,
    deleteBusiness,
} from "./controllers/businesses";
import {FirebaseAuthentication} from "./util/firebaseAuthentication";
import algoliasearch from "algoliasearch";
import {
    registerEmployee,
    deleteEmployee,
    getEmployees,
    getOnlineEmployees,
    updateEmployee
} from "./controllers/employees";
import {algoliaAddToIndex, algoliaDeleteFromIndex, algoliaUpdateIndex} from "./controllers/algoliaTriggers";
import {onQueueUpdate} from "./controllers/appTriggers";

// ========================
// App Configuration
// ========================
const app = express();
app.use(cors());
const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;
const client = algoliasearch(APP_ID, ADMIN_KEY);
export const index = client.initIndex("businesses");

// ===========================================================================
// all routes start with https://us-central1-q-up-c2b70.cloudfunctions.net/api
// ===========================================================================


// ========================
// Authentication Routes
// ========================
app.post("/signup", signUp);
app.post("/login", login);
app.get('/logout', FirebaseAuthentication, logout);
app.put("/changePassword", FirebaseAuthentication, changePassword);


// ========================
// Business Routes
// ========================
app.post('/registerBusiness', FirebaseAuthentication, registerBusiness);
app.post("/uploadBusinessImage", FirebaseAuthentication, uploadBusinessImage);
app.get("/getBusiness", FirebaseAuthentication, getBusiness);
app.put("/updateBusiness", FirebaseAuthentication, updateBusiness);
app.delete('/deleteBusiness', FirebaseAuthentication, deleteBusiness);


// ========================
// Customer Routes
// ========================
app.get("/getCustomer", FirebaseAuthentication, getCustomer);
app.post('/registerCustomer', FirebaseAuthentication, registerCustomer);
app.put("/updateCustomer", FirebaseAuthentication, updateCustomerInfo);
app.delete("/deleteCustomer", FirebaseAuthentication, deleteCustomer);


// ========================
// Employee Routes
// ========================
app.post('/registerEmployee', FirebaseAuthentication, registerEmployee);
app.put('/updateEmployee', FirebaseAuthentication, updateEmployee);
app.put('/deleteEmployee', FirebaseAuthentication, deleteEmployee);
app.get('/getEmployees', FirebaseAuthentication, getEmployees);
app.get('/getOnlineEmployees', FirebaseAuthentication, getOnlineEmployees);


// ========================
// Queue Routes
// ========================
app.get("/getQueue", FirebaseAuthentication, getQueue);
app.get("/getCustomerQueueInfo", FirebaseAuthentication, getQueueSlotInfo);
app.post("/customerEnterQueue", FirebaseAuthentication, customerEnterQueue);
app.put("/boothEnterQueue", FirebaseAuthentication, boothEnterQueue);
app.put("/VIPEnterQueue", FirebaseAuthentication, vipEnterQueue);
app.put("/abandonQueue", FirebaseAuthentication, abandonQueue);
app.put("/changeQueueStatus", FirebaseAuthentication, changeQueueStatus);
app.put('/checkInQueue', FirebaseAuthentication, checkInQueue);
app.get("/getFavouriteQueues", FirebaseAuthentication, getFavouriteQueuesForCustomer);
app.put('/changeFavoriteQueueStatus', FirebaseAuthentication, changeStatusOfFavouriteBusiness);


// ========================
// Algolia Triggers
// ========================
exports.algoliaAddToIndex = algoliaAddToIndex;
exports.algoliaUpdateIndex = algoliaUpdateIndex;
exports.algoliaDeleteFromIndex = algoliaDeleteFromIndex;


// ========================
// API Triggers
// ========================
exports.onQueueUpdate = onQueueUpdate;
exports.api = functions.https.onRequest(app);
