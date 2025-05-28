import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { uploadBytes, getDownloadURL, getMetadata } from "firebase/storage";
import { ref, get, set, push, update } from "firebase/database";
import { database } from "@/firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from "@/firebaseConfig";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await AsyncStorage.setItem('deviceId', auth.currentUser.photoURL);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('password', password);
      console.log("Logged in successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const register = async (email, password, username, deviceID, phoneNumber, uri, address) => {
    const refe = ref(database, `/${deviceID}`);
    const snapshot = await get(refe);
    if(snapshot.exists() && snapshot.val().profile.email === "") {
      try {
        // console.log("User registered:", userCredential.user);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;
        setUser(user);
        await update(ref(database, `/${deviceID}/profile`), {
          email: email,
          uname: username,
          phone_number: phoneNumber,
          address: address,
          device_id: deviceID,
        });
        updateUser(username, deviceID, user)
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
      await AsyncStorage.removeItem('deviceId');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('password');
      navigation.navigate('login')
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const logged = async () => {
    if(user) {
      const deviceID =  await user.photoURL;
      // navigation.navigate("home", { deviceID: deviceID });
      // console.log("Logged in with device ID:", deviceID);
      return { check: true, deviceID: deviceID };
    }
    try {
      const email = await AsyncStorage.getItem('email');
      const password = await AsyncStorage.getItem('password');
      if(email && password) {
        await signInWithEmailAndPassword(auth, email, password);
        const deviceID = auth.currentUser?.photoURL;

      if (deviceID) {
        await AsyncStorage.setItem('deviceId', deviceID);
      }

      // console.log("Logged in successfully");
      // console.log("Logged in with device ID:", deviceID);
      // navigation.navigate("home", { deviceID: deviceID });
      return { check: true, deviceID: deviceID };
      }
    }
    catch (err) {
      console.error("Login error:", err);
      return { check: false };
    }
    return { check:false };
  }

  const updateUser = async (name, device_id, user) => {
    console.log(user);
    if(user) {
      updateProfile(user, {
        displayName: name,
        photoURL: device_id,
      }).then(() => {
        console.log("User updated successfully");
      }).catch((error) => {
        console.error("Error updating user:", error);
      });
    }else console.log("no User")
  };  

  const deviceID = user ? user.photoURL : null;

  return { user, loading, error, login, logout, logged , register, googleRegister, updateUser, deviceID };
};

export default useAuth;