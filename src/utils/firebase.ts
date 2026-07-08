import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyDmoY0KZbNf8kN8HmVpUNDqis5cTEqcViU",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0036445018.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0036445018",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0036445018.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "441735947007",
  appId: env.VITE_FIREBASE_APP_ID || "1:441735947007:web:406bc280026a122efde2ca"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with the specific database ID
const databaseId = env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || "ai-studio-professionalcook-b3d74d44-6ee1-4eda-acd8-42a9ef2fa8dd";
export const db = getFirestore(app, databaseId);
export const auth = getAuth(app);
export default app;

