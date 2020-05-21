import {index} from "../index";
import {dbTrigger} from "../util/firebaseConfig";

/**
 * Adds the created document on algolia's live database.
 */
export const algoliaAddToIndex = dbTrigger
    .document("businesses/{businessId}")
    .onCreate((snapshot) => {
        const data = snapshot.data();
        const objectID = snapshot.id;
        return index.saveObject({...data, objectID});
    });

/**
 * Updates the updated document on algolia's live database.
 */
export const algoliaUpdateIndex = dbTrigger
    .document("businesses/{businessId}")
    .onUpdate((change) => {
        const newData = change.after.data();
        const objectID = change.after.id;
        return index.saveObject({...newData, objectID});
    });

/**
 * Deletes the deleted document on algolia's live database.
 */
export const algoliaDeleteFromIndex = dbTrigger
    .document("businesses/{businessId}")
    .onDelete((snapshot) => {
        index.deleteObject(snapshot.id);
    });