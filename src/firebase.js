import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZrs_yRthRzu3A1F7iqDGriQbmtyBERxQ",
  authDomain: "portfolio-3f443.firebaseapp.com",
  projectId: "portfolio-3f443",
  storageBucket: "portfolio-3f443.firebasestorage.app",
  messagingSenderId: "742685700105",
  appId: "1:742685700105:web:a6914c49578810436d08d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, addDoc, getDocs };