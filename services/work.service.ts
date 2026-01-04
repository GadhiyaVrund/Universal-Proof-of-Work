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
import type { WorkEntry } from "@/types"

export async function createWorkEntry(
  userId: string,
  data: Omit<WorkEntry, "id" | "userId" | "status" | "createdAt" | "updatedAt">,
) {
  try {
    if (!db) throw new Error("Firebase not initialized")

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
}

export async function updateWorkEntry(entryId: string, data: Partial<Omit<WorkEntry, "id" | "userId" | "createdAt">>) {
  try {
    if (!db) throw new Error("Firebase not initialized")

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
}

export async function deleteWorkEntry(entryId: string) {
  try {
    if (!db) throw new Error("Firebase not initialized")

    await deleteDoc(doc(db, "workEntries", entryId))
    return { error: null }
  } catch (error: unknown) {
    const err = error as { message: string }
    return { error: err.message }
  }
}

export async function getWorkEntriesByUser(userId: string): Promise<WorkEntry[]> {
  try {
    if (!db) throw new Error("Firebase not initialized")

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
}

export async function getWorkEntryById(entryId: string): Promise<{ entry: WorkEntry | null; error: string | null }> {
  try {
    if (!db) throw new Error("Firebase not initialized")

    const docRef = doc(db, "workEntries", entryId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        entry: {
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
        },
        error: null,
      }
    }

    return { entry: null, error: null }
  } catch (error: unknown) {
    const err = error as { message: string }
    console.error("Error fetching work entry:", err)
    return { entry: null, error: err.message }
  }
}

export async function validateWorkEntry(entryId: string, validatorId: string, validatorName: string) {
  try {
    if (!db) throw new Error("Firebase not initialized")

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
}
