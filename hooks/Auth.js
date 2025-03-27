import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { uploadBytes, getDownloadURL, getMetadata } from "firebase/storage";
import { ref, get, set, push, update } from "firebase/database";
import { database } from "@/firebaseConfig";
import { storage } from "@/firebaseConfig";

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
    if(snapshot.exists() && snapshot.val().profile.email === "") {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User registered:", userCredential.user);

        await update(ref(database, `/${deviceID}/profile`), {
          email: email,
          uname: username,
          phone_Number: phoneNumber,
          address: address,
          device_id: deviceID,
        });

        updateUser(username, phoneNumber, deviceID);
        // uploadImage(uri, deviceID);

        return "success";

      } catch (error) {
        console.error("Registration error:", error.message);
        return error.message;
      }
    } else 
      return "Device ID not found or already registered";
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

  const logout = async (navigation) => {
    try {
      await signOut(auth);
      navigation.navigate('login')
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const updateUser = async (name, device_id) => {
    if(user) {
      updateProfile(user, {
        displayName: name,
        photoURL: device_id,
      }).then(() => {
        console.log("User updated successfully");
      }).catch((error) => {
        console.error("Error updating user:", error);
      });
    }
  };  

  return { user, loading, error, login, logout, logged , register, googleRegister, updateUser };
};

export default useAuth;