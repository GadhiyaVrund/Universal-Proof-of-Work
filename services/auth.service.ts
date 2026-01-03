import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import type { User } from "@/types"

export async function signUp(email: string, password: string, name: string) {
  try {
    if (!auth || !db) throw new Error("Firebase not initialized")

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user

    // Create user document in Firestore
    const user: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await setDoc(doc(db, "users", firebaseUser.uid), {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    })

    return { user, error: null }
  } catch (error: unknown) {
    const err = error as { message: string }
    return { user: null, error: err.message }
  }
}

export async function signIn(email: string, password: string) {
  try {
    if (!auth) throw new Error("Firebase not initialized")

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error: unknown) {
    const err = error as { message: string }
    return { user: null, error: err.message }
  }
}

export async function signOut() {
  try {
    if (!auth) throw new Error("Firebase not initialized")

    await firebaseSignOut(auth)
    return { error: null }
  } catch (error: unknown) {
    const err = error as { message: string }
    return { error: err.message }
  }
}

export async function getUserProfile(uid: string): Promise<User | null> {
  try {
    if (!db) return null

    const docRef = doc(db, "users", uid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        email: data.email,
        name: data.name,
        role: data.role,
        bio: data.bio,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      } as User
    }

    return null
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}
