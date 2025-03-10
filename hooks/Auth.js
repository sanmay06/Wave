import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebaseConfig";

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

  const register = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered:", userCredential.user);
    } catch (error) {
      console.error("Registration error:", error.message);
    }
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

  return { user, loading, error, login, logout, logged , register, googleRegister };
};

export default useAuth;