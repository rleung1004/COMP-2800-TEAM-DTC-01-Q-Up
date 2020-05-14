import * as firebaseAdmin from "firebase-admin";

/**
 * Reference to the admin of our application API.
 */
export const admin = firebaseAdmin.initializeApp();

/**
 * Reference to the database of our application.
 */
export const db = firebaseAdmin.firestore();
