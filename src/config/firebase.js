import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// const firebaseConfig = {
//   apiKey: "AIzaSyAdY7h2CoCsPV-LUTFPW122-cQdqO7UG4M",
//   authDomain: "social-sounds-bad41.firebaseapp.com",
//   projectId: "social-sounds-bad41",
//   storageBucket: "social-sounds-bad41.firebasestorage.app",
//   messagingSenderId: "671380750595",
//   appId: "1:671380750595:web:ee4ffa042c1c02303a2936",
//   measurementId: "G-WYDK8EP2JS"
// };


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)

const analytics = getAnalytics(app);


