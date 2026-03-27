import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// In a real app, this would be imported from firebase-applet-config.json
// For now, we'll use environment variables or placeholders
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "placeholder-key",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "placeholder-auth-domain",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "placeholder-project-id",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "placeholder-storage-bucket",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "placeholder-messaging-sender-id",
  appId: process.env.VITE_FIREBASE_APP_ID || "placeholder-app-id",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "placeholder-measurement-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

export default app;
