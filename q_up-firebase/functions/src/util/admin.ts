import * as firebaseAdmin from "firebase-admin";

const admin = firebaseAdmin.initializeApp();
const db = firebaseAdmin.firestore();

export { admin, db };
