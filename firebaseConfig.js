// Import Firebase SDK
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Firebase configuration (Replace with your Firebase project config)
const firebaseConfig = {
    apiKey: "AIzaSyDlLW27MJKryEE4juaVGcmjIotj5ueFebo",
    authDomain: "rasptemp-d5695.firebaseapp.com",
    databaseURL: "https://rasptemp-d5695-default-rtdb.firebaseio.com",
    projectId: "rasptemp-d5695",
    storageBucket: "rasptemp-d5695.firebasestorage.app",
    messagingSenderId: "936439079920",
    appId: "1:936439079920:web:7a956f5f65ed3f3b497335"
};

// Initialize Firebase only if it's not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Export Firebase Authentication
export const auth = getAuth(app);
export const database = getDatabase(app);
