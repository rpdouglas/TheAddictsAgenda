import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxUjh5aRee9GCsD7at3FqFhXqzZ8rxVdA",
  authDomain: "the-addicts-agenda.firebaseapp.com",
  projectId: "the-addicts-agenda",
  storageBucket: "the-addicts-agenda.firebasestorage.app",
  messagingSenderId: "45453006801",
  appId: "1:45453006801:web:c60004adef258ab33672f0",
  measurementId: "G-GGF2NR3JZS"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();