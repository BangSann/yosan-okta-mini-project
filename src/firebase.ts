// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAznP62aAKsDMYYhbdf2hq02LDnzA-JgMM",
  authDomain: "simpcook-58905.firebaseapp.com",
  projectId: "simpcook-58905",
  storageBucket: "simpcook-58905.appspot.com",
  messagingSenderId: "240792161762",
  appId: "1:240792161762:web:bd5a78c4426aea821b7dbb",
  measurementId: "G-G3RVMX2W3J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
// const analytics = getAnalytics(app);