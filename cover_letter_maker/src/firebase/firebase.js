import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCwaeDY0a5Ak4SPhKNTuv075LyHV-E0W2U",
  authDomain: "coverlettersoftware.firebaseapp.com",
  projectId: "coverlettersoftware",
  storageBucket: "coverlettersoftware.appspot.com",
  messagingSenderId: "722393210527",
  appId: "1:722393210527:web:36dc3c53410499c080ccaa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);