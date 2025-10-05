// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB25CQ2bk3yOi7hc9WtbcEfqJEwhc61qdE",
  authDomain: "our-space-cfc6c.firebaseapp.com",
  projectId: "our-space-cfc6c",
  storageBucket: "our-space-cfc6c.firebasestorage.app",
  messagingSenderId: "669827896457",
  appId: "1:669827896457:web:ce0a9621a8ec67ad526258"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database
export const db = getFirestore(app);

