import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBeO4Kjndglvu2IxJkVq_mDjS2-HVZGKSk",
  authDomain: "thehieu-1402.firebaseapp.com",
  projectId: "thehieu-1402",
  storageBucket: "thehieu-1402.appspot.com",
  messagingSenderId: "524355810202",
  appId: "1:524355810202:web:592b5faf903d423345c023",
  measurementId: "G-ZVH2WVMX72",
  databaseURL: "https://thehieu-1402-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Realtime Database
const db = getDatabase(app);

export { app, db };