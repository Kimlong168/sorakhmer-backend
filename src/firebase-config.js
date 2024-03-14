// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3U_snLTYnZeni0FV_3oiyF6GAEix5RUM",
  authDomain: "sorakhmer-project.firebaseapp.com",
  projectId: "sorakhmer-project",
  storageBucket: "sorakhmer-project.appspot.com",
  messagingSenderId: "501422803775",
  appId: "1:501422803775:web:278445eacc75221752e18a",
  measurementId: "G-C60DBF6L97",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);

