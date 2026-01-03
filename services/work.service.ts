// FIREBASE DISABLED FOR FRONTEND PREVIEW
// Uncomment the code below and configure Firebase to enable Firestore operations

/*
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
*/
import type { WorkEntry } from "@/types"

export async function createWorkEntry(
  userId: string,
  data: Omit<WorkEntry, "id" | "userId" | "status" | "createdAt" | "updatedAt">,
) {
  // Firebase disabled - return error
  console.log("Firebase is disabled. Configure Firebase to enable work entries.")
  return { id: null, error: "Firebase is disabled. Configure Firebase to enable this feature." }

  /* Original Firebase code:
  try {
    const workEntry = {
      userId,
      ...data,
      status: "pending",
      date: Timestamp.fromDate(data.date),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    const docRef = await addDoc(collection(db, "workEntries"), workEntry)
    return { id: docRef.id, error: null }
  } catch (error: unknown) {
    const err = error as { message: string }
    return { id: null, error: err.message }
  }
  */
}

export async function updateWorkEntry(entryId: string, data: Partial<Omit<WorkEntry, "id" | "userId" | "createdAt">>) {
  // Firebase disabled - return error
  return { error: "Firebase is disabled. Configure Firebase to enable this feature." }

  /* Original Firebase code:
  try {
    const docRef = doc(db, "workEntries", entryId)
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: Timestamp.now(),
    }

    if (data.date) {
      updateData.date = Timestamp.fromDate(data.date)
    }

    await updateDoc(docRef, updateData)
    return { error: null }
  } catch (error: unknown) {
    const err = error as { message: string }
    return { error: err.message }
  }
  */
}

export async function deleteWorkEntry(entryId: string) {
  // Firebase disabled - return error
  return { error: "Firebase is disabled. Configure Firebase to enable this feature." }

  /* Original Firebase code:
  try {
    await deleteDoc(doc(db, "workEntries", entryId))
    return { error: null }
  } catch (error: unknown) {
    const err = error as { message: string }
    return { error: err.message }
  }
  */
}

export async function getWorkEntriesByUser(userId: string): Promise<WorkEntry[]> {
  // Firebase disabled - return empty array
  console.log("Firebase is disabled. Configure Firebase to enable work entries.")
  return []

  /* Original Firebase code:
  try {
    const q = query(collection(db, "workEntries"), where("userId", "==", userId), orderBy("date", "desc"))

    const querySnapshot = await getDocs(q)
    const entries: WorkEntry[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      entries.push({
        id: doc.id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        category: data.category,
        proofLinks: data.proofLinks,
        date: data.date.toDate(),
        status: data.status,
        validatorId: data.validatorId,
        validatorName: data.validatorName,
        validatedAt: data.validatedAt ? data.validatedAt.toDate() : undefined,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      })
    })

    return entries
  } catch (error) {
    console.error("Error fetching work entries:", error)
    return []
  }
  */
}

export async function getWorkEntryById(entryId: string): Promise<WorkEntry | null> {
  // Firebase disabled - return null
  console.log("Firebase is disabled. Configure Firebase to enable work entries.")
  return null

  /* Original Firebase code:
  try {
    const docRef = doc(db, "workEntries", entryId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        category: data.category,
        proofLinks: data.proofLinks,
        date: data.date.toDate(),
        status: data.status,
        validatorId: data.validatorId,
        validatorName: data.validatorName,
        validatedAt: data.validatedAt ? data.validatedAt.toDate() : undefined,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      }
    }

    return null
  } catch (error) {
    console.error("Error fetching work entry:", error)
    return null
  }
  */
}

export async function validateWorkEntry(entryId: string, validatorId: string, validatorName: string) {
  // Firebase disabled - return error
  return { error: "Firebase is disabled. Configure Firebase to enable this feature." }

  /* Original Firebase code:
  try {
    const docRef = doc(db, "workEntries", entryId)
    await updateDoc(docRef, {
      status: "validated",
      validatorId,
      validatorName,
      validatedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return { error: null }
  } catch (error: unknown) {
    const err = error as { message: string }
    return { error: err.message }
  }
  */
}
