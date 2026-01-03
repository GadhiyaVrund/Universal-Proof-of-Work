import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCTFCMhMpgECfBTPA7FogNWshYZ7bf77IU",
  authDomain: "universal-proof-of-work.firebaseapp.com",
  projectId: "universal-proof-of-work",
  storageBucket: "universal-proof-of-work.firebasestorage.app",
  messagingSenderId: "77301217670",
  appId: "1:77301217670:web:69964175be1d502ce21407",
}

// Check if Firebase is properly configured
const isConfigured = Object.values(firebaseConfig).every((value) => value !== "")

if (!isConfigured) {
  console.log("Firebase Configuration Debug:")
  Object.entries(firebaseConfig).forEach(([key, value]) => {
    console.log(`${key}: ${value ? "Set" : "Missing"}`)
  })
}

let app: ReturnType<typeof initializeApp> | null = null
let auth: ReturnType<typeof getAuth> | null = null
let db: ReturnType<typeof getFirestore> | null = null
let storage: ReturnType<typeof getStorage> | null = null

// Only initialize if properly configured
if (isConfigured) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
}

export { app, auth, db, storage, isConfigured }
