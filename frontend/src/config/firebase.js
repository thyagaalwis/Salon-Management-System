// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNtFonk67bGZkapNoppkuKqS4j3LKrUWE",
  authDomain: "salon-management-fe9df.firebaseapp.com",
  projectId: "salon-management-fe9df",
  storageBucket: "salon-management-fe9df.appspot.com",
  messagingSenderId: "723767022201",
  appId: "1:723767022201:web:9b9395d009f98bff14faa8",
  measurementId: "G-H582MNTH9T"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);