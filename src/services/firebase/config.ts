// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALtmPe6MSopVHibUBzpJdgeh15bsfobl0",
  authDomain: "hemoglovida-ae282.firebaseapp.com",
  projectId: "hemoglovida-ae282",
  storageBucket: "hemoglovida-ae282.firebasestorage.app",
  messagingSenderId: "397475084823",
  appId: "1:397475084823:web:5b39a4a07c69e08a4d3a52",
  measurementId: "G-MFRT3DQB46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };