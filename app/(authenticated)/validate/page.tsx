"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { getWorkEntryById, validateWorkEntry } from "@/services/work.service"
import { getUserProfile } from "@/services/auth.service"
import { Search, CheckCircle2, ExternalLink, Github, FileText, ImageIcon } from "lucide-react"
import type { WorkEntry, User } from "@/types"

export default function ValidatePage() {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()
  const [entryId, setEntryId] = useState("")
  const [entry, setEntry] = useState<WorkEntry | null>(null)
  const [entryOwner, setEntryOwner] = useState<User | null>(null)
  const [searching, setSearching] = useState(false)
  const [validating, setValidating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleSearch = async () => {
    if (!entryId.trim()) return

    setSearching(true)
    setError("")
    setEntry(null)
    setEntryOwner(null)
    setSuccess(false)

    try {
      const workEntry = await getWorkEntryById(entryId.trim())

      if (!workEntry) {
        setError("Work entry not found. Please check the ID and try again.")
      } else if (workEntry.userId === user?.uid) {
        setError("You cannot validate your own work entries.")
      } else if (workEntry.status === "validated") {
        setError("This work entry has already been validated.")
      } else {
        setEntry(workEntry)
        const owner = await getUserProfile(workEntry.userId)
        setEntryOwner(owner)
      }
    } catch (err) {
      setError("Failed to fetch work entry. Please try again.")
      console.error(err)
    } finally {
      setSearching(false)
    }
  }

  const handleValidate = async () => {
    if (!entry || !user || !userProfile) return

    setValidating(true)
    setError("")

    try {
      const result = await validateWorkEntry(entry.id, user.uid, userProfile.name)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setEntry({ ...entry, status: "validated", validatorId: user.uid, validatorName: userProfile.name })
      }
    } catch (err) {
      setError("Failed to validate work entry. Please try again.")
      console.error(err)
    } finally {
      setValidating(false)
    }
  }

  if (loading || !user || !userProfile) {
    return null
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "project":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "task":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "contribution":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={userProfile} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Validate Work Entry</h1>
          <p className="text-muted-foreground">
            Review and validate work entries from other users to build trust in the community
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Input
                placeholder="Enter work entry ID..."
                value={entryId}
                onChange={(e) => setEntryId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={searching || !entryId.trim()}>
                <Search className="w-4 h-4 mr-2" />
                {searching ? "Searching..." : "Search"}
              </Button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-destructive-foreground bg-destructive/10 p-3 rounded-md border border-destructive/20">
                {error}
              </p>
            )}
          </CardContent>
        </Card>

        {entry && entryOwner && (
          <Card>
            <CardContent className="p-6">
              {success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-md">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Successfully validated this work entry!</span>
                  </div>
                </div>
              )}

              <div className="mb-6 pb-6 border-b border-border">
                <p className="text-sm text-muted-foreground mb-2">Created by</p>
                <p className="text-lg font-medium text-foreground">{entryOwner.name}</p>
                {entryOwner.role && <p className="text-sm text-muted-foreground">{entryOwner.role}</p>}
              </div>

              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <Badge variant="outline" className={getCategoryColor(entry.category)}>
                    {entry.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{formatDate(entry.date)}</span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">{entry.title}</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{entry.description}</p>
                </div>

                {Object.keys(entry.proofLinks).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Proof Links</h3>
                    <div className="space-y-2">
                      {entry.proofLinks.repo && (
                        <a
                          href={entry.proofLinks.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded-md hover:bg-muted transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          <span>Repository</span>
                          <ExternalLink className="w-3 h-3 ml-auto" />
                        </a>
                      )}
                      {entry.proofLinks.demo && (
                        <a
                          href={entry.proofLinks.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded-md hover:bg-muted transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Live Demo</span>
                          <ExternalLink className="w-3 h-3 ml-auto" />
                        </a>
                      )}
                      {entry.proofLinks.doc && (
                        <a
                          href={entry.proofLinks.doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded-md hover:bg-muted transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Documentation</span>
                          <ExternalLink className="w-3 h-3 ml-auto" />
                        </a>
                      )}
                      {entry.proofLinks.image && (
                        <a
                          href={entry.proofLinks.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded-md hover:bg-muted transition-colors"
                        >
                          <ImageIcon className="w-4 h-4" />
                          <span>Image</span>
                          <ExternalLink className="w-3 h-3 ml-auto" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {!success && (
                  <div className="pt-6 border-t border-border">
                    <Button onClick={handleValidate} disabled={validating} className="w-full">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {validating ? "Validating..." : "Validate This Work Entry"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
