// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAf4vUbPwW3eS9ynBGSXxlKo1aBfHxMEsY",
  authDomain: "lesson-68fbf.firebaseapp.com",
  projectId: "lesson-68fbf",
  storageBucket: "lesson-68fbf.firebasestorage.app",
  messagingSenderId: "89471434034",
  appId: "1:89471434034:web:2b9653c1cdf8c8992deb2b",
  measurementId: "G-FQV0QXKWS5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;