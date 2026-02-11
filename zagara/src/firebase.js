import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyARGPTMPkb3Ozyizrg37h7zXy5E4F8HYAQ",
    authDomain: "zagara-5c76c.firebaseapp.com",
    projectId: "zagara-5c76c",
    storageBucket: "zagara-5c76c.firebasestorage.app",
    messagingSenderId: "1082519863928",
    appId: "1:1082519863928:web:687c2b74206610bed8a38d",
    measurementId: "G-K2PJTSX1E0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
