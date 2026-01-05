import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Firebase config (CLIENT SAFE)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}



// 🔥 FAIL FAST if env is broken
if (Object.values(firebaseConfig).some((v) => !v)) {
  throw new Error("❌ Firebase env variables are missing or invalid")
}

// ✅ SAFE SINGLETON INITIALIZATION
const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp()

// ✅ SERVICES (NON-NULL, GUARANTEED)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { app, auth, db, storage }
