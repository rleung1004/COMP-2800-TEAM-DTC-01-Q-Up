import {index} from "../index";
import {trigger} from "../util/firebaseConfig";

/**
 * Adds the created document on algolia's live database.
 */
export const algoliaAddToIndex = trigger
    .document("businesses/{businessId}")
    .onCreate((snapshot) => {
        const data = snapshot.data();
        const objectID = snapshot.id;
        return index.saveObject({...data, objectID});
    });

/**
 * Updates the updated document on algolia's live database.
 */
export const algoliaUpdateIndex = trigger
    .document("businesses/{businessId}")
    .onUpdate((change) => {
        const newData = change.after.data();
        const objectID = change.after.id;
        return index.saveObject({...newData, objectID});
    });

/**
 * Deletes the deleted document on algolia's live database.
 */
export const algoliaDeleteFromIndex = trigger
    .document("businesses/{businessId}")
    .onDelete((snapshot) => {
        index.deleteObject(snapshot.id);
    });