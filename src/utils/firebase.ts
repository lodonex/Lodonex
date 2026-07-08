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

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default app;

