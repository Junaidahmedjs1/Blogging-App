import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyA4sylx7AfUNL-aaci15Ek0XRzGo28Vn3I",
    authDomain: "blogging-app-f9b3e.firebaseapp.com",
    projectId: "blogging-app-f9b3e",
    storageBucket: "blogging-app-f9b3e.firebasestorage.app",
    messagingSenderId: "836871127195",
    appId: "1:836871127195:web:9ea67f59cc32ebf2b4863e"
  };

  // Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);