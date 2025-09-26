import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

  const firebaseConfig = {
    apiKey: "AIzaSyCiJzLn82gWz87gc3ykcJhQxUQab30IDL8",
    authDomain: "foodweekplanner-fe3b9.firebaseapp.com",
    projectId: "foodweekplanner-fe3b9",
    storageBucket: "foodweekplanner-fe3b9.firebasestorage.app",
    messagingSenderId: "601304311377",
    appId: "1:601304311377:web:345a890a7bb961630cba70",
    measurementId: "G-KK48JLPBQM"
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;