// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwCnTHPXoQe3c3NX-OQElcf2JVYoiTrSY",
  authDomain: "simpcook-58905.firebaseapp.com",
  projectId: "simpcook-58905",
  storageBucket: "simpcook-58905.appspot.com",
  messagingSenderId: "240792161762",
  appId: "1:240792161762:web:d069983e9cb07b481b7dbb",
  measurementId: "G-KXRZJE3VEJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
// const analytics = getAnalytics(app);