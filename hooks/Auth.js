import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { uploadBytes, getDownloadURL, getMetadata } from "firebase/storage";
import { ref, get } from "firebase/database";
import { database } from "@/firebaseConfig";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const[ logged, setlogged] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setlogged(auth.currentUser !== null);
  }, [user])

  const login = async (email, password) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const register = async (email, password, username, deviceID, phoneNumber, uri, address) => {
    const refe = ref(database, `/${deviceID}`);
    const snapshot = await get(refe);
    if(snapshot.exists()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User registered:", userCredential.user);
        return "success";
      } catch (error) {
        console.error("Registration error:", error.message);
        return error.message;
      }
    } else 
      return "Device ID not found";
  };
  
  const googleRegister = async() => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("google sing un : ", result.user);
    }catch (error) {
        console.log("google error: ", error.message);
    }
  };



  const uploadImage = async (uri, deviceID) => {
    try {
      // Convert image URI to Blob
      const response = await fetch(uri);
      const blob = await response.blob();
  
      // Create a unique filename
      const filename = `images/${new Date().getTime()}.jpg`;
      const storageRef = ref(storage, filename);
  
      // Upload image to Firebase Storage
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
  
      console.log("Image uploaded successfully:", downloadURL);
      return downloadURL; // Return the URL for further use
    } catch (error) {
      console.error("Upload Failed:", error.message);
      throw error;
    }
  };

  const logout = async (navigation) => {
    try {
      await signOut(auth);
      navigation.navigate('login')
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const updateUser = async (name, photo, phoneNumber) => {
    if(user) {
      updateProfile(user, {
        displayName: name,
        photoURL: photo,
        phoneNumber: phoneNumber
      }).then(() => {
        console.log("User updated successfully");
      }).catch((error) => {
        console.error("Error updating user:", error);
      });
    }
  };  

  return { user, loading, error, login, logout, logged , register, googleRegister, updateUser, uploadImage };
};

export default useAuth;