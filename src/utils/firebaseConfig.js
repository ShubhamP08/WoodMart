// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDryb-kPiNWYXsY1nbDD5Uv-v70T-bMpH0",
  authDomain: "e-commerce-f83cb.firebaseapp.com",
  projectId: "e-commerce-f83cb",
  storageBucket: "e-commerce-f83cb.appspot.com",
  messagingSenderId: "293065623401",
  appId: "1:293065623401:web:8ce156e04372912aa91ff8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
