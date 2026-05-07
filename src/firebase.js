import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSVwq66Rm1ayhJjDjD_yWIdErxDUJUpGc",
  authDomain: "aurvion-store.firebaseapp.com",
  projectId: "aurvion-store",
  storageBucket:"aurvion-store.firebasestorage.app",
  messagingSenderId: "212908146342",
  appId: "1:212908146342:web:174128e3f4289bc366fe67",};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
