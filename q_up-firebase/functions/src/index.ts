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
import {boothEnterQueue, createNewBooth} from "./handlers/booths";
import * as express from "express";
import * as cors from "cors";
import {signUp, login, changePassword, logout} from "./handlers/users";
import {
    updateCustomerInfo,
    deleteCustomer,
    getCustomerInfo,
} from "./handlers/customers";
import {
    updateBusiness,
    uploadBusinessImage,
    getBusiness, registerBusiness, deleteBusiness,
} from "./handlers/businesses";
import {FBAuth} from "./util/fbAuth";
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


// ========================
// Authentication Routes
// ========================
app.post("/signup", signUp);
app.post("/login", login);
app.get('/logout', FBAuth, logout);
app.put("/changePassword", FBAuth, changePassword);


// ========================
// Business Routes
// ========================
app.post("/uploadBusinessImage", FBAuth, uploadBusinessImage);
app.get("/getBusiness", FBAuth, getBusiness);
app.post("/updateBusiness", FBAuth, updateBusiness);
app.post('/registerBusiness', FBAuth, registerBusiness);
app.delete('/deleteBusiness', FBAuth, deleteBusiness);


// ========================
// Queue Routes
// ========================
app.post("/tellerQueueList", FBAuth, getTellerQueueList);
app.post("/businessQueueInfo", FBAuth, getQueueInfoForBusiness);
app.get("/getCustomerQueueInfo", FBAuth, getQueueSlotInfo);
app.post("/customerEnterQueue", FBAuth, customerEnterQueue);
app.post("/VIPEnterQueue", FBAuth, VIPEnterQueue);
app.post("/abandonQueueSlot", FBAuth, abandonQueueSlot);
app.post("/changeQueueStatus", FBAuth, changeQueueStatus);
app.get("/getFavouriteQueues", FBAuth, getFavouriteQueuesForCustomer);


// ========================
// Customer Routes
// ========================
app.get("/getCustomerInfo", FBAuth, getCustomerInfo);
app.delete("/deleteCustomer", FBAuth, deleteCustomer);
app.post("/updateCustomer", FBAuth, updateCustomerInfo);


// ========================
// Booth Routes
// ========================
app.post("/boothEnterQueue", FBAuth, boothEnterQueue);
app.post("/createNewBooth", FBAuth, createNewBooth);


// ========================
// Employee Routes
// ========================
app.post('/createEmployee', FBAuth, createNewEmployee);
app.post('/updateEmployee', FBAuth, updateEmployee);
app.post('/deleteEmployee', FBAuth, deleteEmployee);
app.post('/checkInQueue', FBAuth, checkInQueue);
app.post('/getListOfAllEmployees', FBAuth, getListOfAllEmployees);
app.post('/getOnlineEmployees', FBAuth, getOnlineEmployees);


// ========================
// algolia exports
// ========================
exports.addToIndex = functions.firestore
    .document("businesses/{businessId}")
    .onCreate((snapshot) => {
        const data = snapshot.data();
        const objectID = snapshot.id;

        return index.saveObject({...data, objectID});
    });
exports.updateIndex = functions.firestore
    .document("businesses/{businessId}")
    .onUpdate((change) => {
        const newData = change.after.data();
        const objectID = change.after.id;

        return index.saveObject({...newData, objectID});
    });
exports.deleteFromIndex = functions.firestore
    .document("businesses/{businessId}")
    .onDelete((snapshot) => {
        index.deleteObject(snapshot.id);
    });


exports.api = functions.https.onRequest(app);
