import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyA1SkvXu4uaO56R16NVVO2vcJ_wdieGTP8",
  authDomain: "junaiddevts.firebaseapp.com",
  projectId: "junaiddevts",
  storageBucket: "junaiddevts.firebasestorage.app",
  messagingSenderId: "654466176984",
  appId: "1:654466176984:web:a15af268b6f9417e9d84ad",
  measurementId: "G-9EP2BDGX9J"
};


  // Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);