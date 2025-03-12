// Import Firebase SDK
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

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

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBaIKmtwpFXdRTx1vXDogeAbdduGTO8x7A",
//   authDomain: "automattrix-c913b.firebaseapp.com",
//   databaseURL: "https://automattrix-c913b-default-rtdb.firebaseio.com",
//   projectId: "automattrix-c913b",
//   storageBucket: "automattrix-c913b.firebasestorage.app",
//   messagingSenderId: "134442866765",
//   appId: "1:134442866765:web:fa8975b855bbc0b23be404",
//   measurementId: "G-84YZQTX1M3"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);