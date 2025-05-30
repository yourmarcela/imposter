// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, addDoc, updateDoc, getDocs, serverTimestamp, orderBy, query } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Deine Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyCpo_msZ2laNDTeBf5MbBg9sE-DMnrPh0s",
  authDomain: "wortspiel-ed540.firebaseapp.com",
  projectId: "wortspiel-ed540",
  storageBucket: "wortspiel-ed540.appspot.com",
  messagingSenderId: "505474098115",
  appId: "1:505474098115:web:f83ddf7f6614d40a5ad376",
  measurementId: "G-Q75H2XKKW5"
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// (Hier den ganzen Code einfügen aus der vorherigen Antwort mit Rollen, Chat etc.)