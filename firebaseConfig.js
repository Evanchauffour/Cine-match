
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCffOgoPHmfkDc0Ru_dcxFsQFGOcc5lsng",
  authDomain: "cine-match-1899f.firebaseapp.com",
  projectId: "cine-match-1899f",
  storageBucket: "cine-match-1899f.appspot.com",
  messagingSenderId: "773952552222",
  appId: "1:773952552222:web:5c6b71c170c529274bdd0f",
  measurementId: "G-RHXZPNQ6WG"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
