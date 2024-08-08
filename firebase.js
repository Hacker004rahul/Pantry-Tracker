import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // Correct import

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4wuee6Ek_hNMFQ3jULIWr0zxGM-0jxKg",
  authDomain: "inventory-management-ea4de.firebaseapp.com",
  projectId: "inventory-management-ea4de",
  storageBucket: "inventory-management-ea4de.appspot.com",
  messagingSenderId: "534851621367",
  appId: "1:534851621367:web:a88fc1d8cdd53d43ed5ef2",
  measurementId: "G-VSYTBWGZ7S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)

export {firestore}