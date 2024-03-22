 import { db } from "./firebase";
import { query, getDocs, collection, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore"
import { checkTitleRedundancy } from "./Tools"

/**
 * Save a new cover letter in the database for the giver user.
 * 
 * @param {string} userId 
 * @param {string} letterTitle 
 * @param {string} letterContent 
 * @returns cover id
 */
export const saveNewCover = async (userId, letterTitle, letterContent) => {
  const myTitle = await checkTitleRedundancy(letterTitle, userId);

  const myTimestamp = new Date().getTime();
  const collectionRef = collection(db, `users/${userId}/covers`);
  const newDocRef = await addDoc(collectionRef, {
    title: myTitle,
    last_update: myTimestamp,
    content: letterContent
  });

  // add the content as a new document in collection versions
  const contentRef = collection(db, `users/${userId}/covers/${newDocRef.id}/versions`)
  await addDoc(contentRef, {
    content: letterContent,
    timestamp: myTimestamp
  });

  console.log("New cover letter stored with ID: ", newDocRef.id);
  return newDocRef.id;
}

/**
 * Save a new version of a specific cover letter in the database for the given user.
 * The content of the cover letter is updated
 * 
 * @param {string} userId 
 * @param {string} coverId 
 * @param {string} content 
 */
export const saveNewCoverVersion = async (userId, coverId, content) => {
  // save data in temp variables to avoid bugs
  const myTimestamp = new Date().getTime();

  // add a new version doc in the cover document
  const newVersionsRef = collection(db, `users/${userId}/covers/${coverId}/versions`);
  await addDoc(newVersionsRef, {
    content: content,
    timestamp: myTimestamp
  })

  // update cover document data
  const coverRef = doc(db, `users/${userId}/covers/${coverId}`);
  await updateDoc(coverRef, {
    content: content,
    last_update: myTimestamp
  })

  console.log("SAVE");
}

/**
 * Get all the cover letters title of the given user. 
 * 
 * @param {string} userId 
 * @returns list of titles
 */
export const getAllTitles = async (userId) => {
  const allTitles = [];
  
  const coversRef = collection(db, `users/${userId}/covers`);
  const q = query(coversRef);
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
      allTitles.push(doc.data().title);
  })

  return allTitles;
}

/**
 * Delete a specific cover letter of the given user and the "versions" sub-collection.
 * 
 * @param {string} userId 
 * @param {string} coverId 
 */
export const deleteCoverLetter = async (userId, coverId) => {
  // delete first all cover letter versions
  const versionsRef = collection(db, `users/${userId}/covers/${coverId}/versions`);
  const q = query(versionsRef);
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    deleteDoc(doc.ref);
  })

  // delete the cover letter document
  const coversRef = doc(db, `users/${userId}/covers/${coverId}`);
  deleteDoc(coversRef);
}