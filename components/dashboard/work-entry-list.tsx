"use client"

import { useEffect, useState } from "react"
import { getWorkEntriesByUser } from "@/services/work.service"
import { WorkEntryCard } from "./work-entry-card"
import type { WorkEntry } from "@/types"

interface WorkEntryListProps {
  userId: string
}

export function WorkEntryList({ userId }: WorkEntryListProps) {
  const [entries, setEntries] = useState<WorkEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEntries() {
      const data = await getWorkEntriesByUser(userId)
      setEntries(data)
      setLoading(false)
    }

    fetchEntries()
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading your work entries...</p>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-foreground mb-2">No work entries yet</p>
        <p className="text-muted-foreground">Start building your proof of work by adding your first entry</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <WorkEntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  )
}
