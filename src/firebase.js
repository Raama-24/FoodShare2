// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
 apiKey: "AIzaSyD60x51QSySV6k6K-FTVg11UtMw5OyuETA",
  authDomain: "foodshare-ab2a4.firebaseapp.com",
  projectId: "foodshare-ab2a4",
  storageBucket: "foodshare-ab2a4.firebasestorage.app",
  messagingSenderId: "174190943132",
  appId: "1:174190943132:web:4455b86aa7262a635f4659"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);