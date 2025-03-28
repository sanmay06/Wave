// Import Firebase SDK
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Firebase configuration (Replace with your Firebase project config)
const firebaseConfig = {
    apiKey: "AIzaSyBaIKmtwpFXdRTx1vXDogeAbdduGTO8x7A",
    authDomain: "automattrix-c913b.firebaseapp.com",
    databaseURL: "https://automattrix-c913b-default-rtdb.firebaseio.com",
    projectId: "automattrix-c913b",
    storageBucket: "automattrix-c913b.firebasestorage.app",
    messagingSenderId: "134442866765",
    appId: "1:134442866765:web:fa8975b855bbc0b23be404",
    measurementId: "G-84YZQTX1M3"
  };
// Initialize Firebase only if it's not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Export Firebase Authentication
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);