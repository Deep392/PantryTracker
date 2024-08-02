// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJEzFigo9wzAe6fjqNaUpFfJAV1GB6quE",
  authDomain: "pantrytracker-d51da.firebaseapp.com",
  projectId: "pantrytracker-d51da",
  storageBucket: "pantrytracker-d51da.appspot.com",
  messagingSenderId: "725669780680",
  appId: "1:725669780680:web:b79b468e948f84df1ad9fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);