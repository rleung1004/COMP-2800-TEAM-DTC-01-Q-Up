import * as firebaseAdmin from "firebase-admin";
import * as functions from "firebase-functions";

/**
 * References the firebase Configuration for this web-app.
 */
export const firebaseConfig = {
    apiKey: "AIzaSyCd2O4kN23xnVMtzVKm_fzt4iBQ7VH7T_8",
    authDomain: "q-up-c2b70.firebaseapp.com",
    databaseURL: "https://q-up-c2b70.firebaseio.com",
    projectId: "q-up-c2b70",
    storageBucket: "q-up-c2b70.appspot.com",
    messagingSenderId: "840558505517",
    appId: "1:840558505517:web:37045d8504c3c1f257d2a4",
    measurementId: "G-016HG4TWHN",
};

/**
 * References the admin of this web-app's firebase.
 */
export const admin = firebaseAdmin.initializeApp();

/**
 * References the firestore database of this web-app.
 */
export const db = firebaseAdmin.firestore();

/**
 * References a firestore cloud function trigger in this web-app.
 */
export const dbTrigger = functions.firestore;
