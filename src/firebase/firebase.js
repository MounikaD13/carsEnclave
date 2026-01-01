// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHlP9cb2qbY9s8uOqRZ-oTCIGaoUqNcoc",
  authDomain: "cars-enclave.firebaseapp.com",
  projectId: "cars-enclave",
  storageBucket: "cars-enclave.firebasestorage.app",
  messagingSenderId: "1035951627038",
  appId: "1:1035951627038:web:3b1e78a26f8f0c38a2870f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export {app,auth,db,storage}