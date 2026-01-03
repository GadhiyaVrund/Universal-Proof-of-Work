"use client"

import { useState, useEffect } from "react"
import { getWorkEntriesByUser } from "@/services/work.service"
import type { WorkEntry } from "@/types"

export function useWorkEntries(userId: string | undefined) {
  const [entries, setEntries] = useState<WorkEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEntries() {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        const data = await getWorkEntriesByUser(userId)
        setEntries(data)
      } catch (error) {
        console.error("Error loading work entries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEntries()
  }, [userId])

  const refresh = async () => {
    if (!userId) return
    const data = await getWorkEntriesByUser(userId)
    setEntries(data)
  }

  return { entries, loading, refresh }
}
