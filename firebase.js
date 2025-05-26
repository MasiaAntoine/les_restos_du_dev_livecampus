// npm install firebase

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDK3TEZqNAAS_rK-j-ast8PzPivv25kiGk",
  authDomain: "les-restos-du-dev.firebaseapp.com",
  projectId: "les-restos-du-dev",
  storageBucket: "les-restos-du-dev.firebasestorage.app",
  messagingSenderId: "69394820110",
  appId: "1:69394820110:web:50eb00803027311581605f",
  measurementId: "G-RJBX9H3C8Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);