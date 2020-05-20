import * as functions from "firebase-functions";
import {
    getQueue, getQueueSlotInfo, customerEnterQueue, vipEnterQueue, abandonQueue, changeQueueStatus,
    getFavouriteQueuesForCustomer, changeStatusOfFavouriteBusiness, checkInQueue, boothEnterQueue
} from './controllers/queues';
import * as express from "express";
import * as cors from "cors";
import {signUp, login, changePassword, logout, oAuthSignUp} from "./controllers/users";
import {updateCustomerInfo, deleteCustomer, getCustomer, registerCustomer} from "./controllers/customers";
import {
    updateBusiness,
    uploadBusinessImage,
    getBusiness,
    registerBusiness,
    deleteBusiness,
} from "./controllers/businesses";
import {firebaseAuthentication} from "./util/firebaseAuthentication";
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
import {getDisplayInfo} from "./controllers/boothsAndDisplays";
import {getDataEnum} from "./controllers/dataEnumerations";

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
app.post('/oAuthSignup', oAuthSignUp);
app.post("/login", login);
app.get('/logout', firebaseAuthentication, logout);
app.put("/changePassword", firebaseAuthentication, changePassword);


// ========================
// Business Routes
// ========================
app.post('/registerBusiness', firebaseAuthentication, registerBusiness);
app.post("/uploadBusinessImage", firebaseAuthentication, uploadBusinessImage);
app.get("/getBusiness", firebaseAuthentication, getBusiness);
app.put("/updateBusiness", firebaseAuthentication, updateBusiness);
app.delete('/deleteBusiness', firebaseAuthentication, deleteBusiness);
app.get("/getDisplay", firebaseAuthentication, getDisplayInfo);

// ========================
// Customer Routes
// ========================
app.get("/getCustomer", firebaseAuthentication, getCustomer);
app.post('/registerCustomer', firebaseAuthentication, registerCustomer);
app.put("/updateCustomer", firebaseAuthentication, updateCustomerInfo);
app.delete("/deleteCustomer", firebaseAuthentication, deleteCustomer);


// ========================
// Employee Routes
// ========================
app.post('/registerEmployee', firebaseAuthentication, registerEmployee);
app.put('/updateEmployee', firebaseAuthentication, updateEmployee);
app.put('/deleteEmployee', firebaseAuthentication, deleteEmployee);
app.get('/getEmployees', firebaseAuthentication, getEmployees);
app.get('/getOnlineEmployees', firebaseAuthentication, getOnlineEmployees);


// ========================
// Queue Routes
// ========================
app.get("/getQueue", firebaseAuthentication, getQueue);
app.get("/getCustomerQueueInfo", firebaseAuthentication, getQueueSlotInfo);
app.post("/customerEnterQueue", firebaseAuthentication, customerEnterQueue);
app.put("/boothEnterQueue", firebaseAuthentication, boothEnterQueue);
app.put("/VIPEnterQueue", firebaseAuthentication, vipEnterQueue);
app.put("/abandonQueue", firebaseAuthentication, abandonQueue);
app.put("/changeQueueStatus", firebaseAuthentication, changeQueueStatus);
app.put('/checkInQueue', firebaseAuthentication, checkInQueue);
app.get("/getFavouriteQueues", firebaseAuthentication, getFavouriteQueuesForCustomer);
app.put('/changeFavoriteQueueStatus', firebaseAuthentication, changeStatusOfFavouriteBusiness);


// ========================
// Util Routes
// ========================
app.get("/getBusinessEnums", firebaseAuthentication, getDataEnum);

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
