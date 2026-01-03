"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getUserProfile } from "@/services/auth.service"
import { getWorkEntriesByUser } from "@/services/work.service"
import { CheckCircle2, ExternalLink, Github, FileText, ImageIcon, Share2 } from "lucide-react"
import type { User, WorkEntry } from "@/types"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"

export default function ProfilePage() {
  const params = useParams()
  const { user: currentUser } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [entries, setEntries] = useState<WorkEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      if (params.id) {
        const profile = await getUserProfile(params.id as string)
        setUser(profile)

        if (profile) {
          const workEntries = await getWorkEntriesByUser(profile.id)
          setEntries(workEntries)
        }

        setLoading(false)
      }
    }

    fetchProfile()
  }, [params.id])

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Profile not found</h1>
          <p className="text-muted-foreground">This user does not exist or has been removed</p>
        </div>
      </div>
    )
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  const validatedCount = entries.filter((e) => e.status === "validated").length
  const isOwnProfile = currentUser?.uid === user.id

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-foreground">
            UPoW
          </Link>
          <div className="flex items-center gap-4">
            {currentUser ? (
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="bg-transparent">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
              {user.role && <p className="text-lg text-muted-foreground mb-4">{user.role}</p>}
              {user.bio && <p className="text-muted-foreground leading-relaxed max-w-2xl">{user.bio}</p>}
              <div className="flex flex-wrap items-center gap-4 mt-6">
                <div className="text-sm">
                  <span className="font-semibold text-foreground">{entries.length}</span>
                  <span className="text-muted-foreground ml-1">Work Entries</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-green-600 dark:text-green-400">{validatedCount}</span>
                  <span className="text-muted-foreground ml-1">Validated</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleShare} variant="outline" size="sm" className="bg-transparent">
                <Share2 className="w-4 h-4 mr-2" />
                {copied ? "Copied!" : "Share"}
              </Button>
              {isOwnProfile && (
                <Link href="/dashboard/settings">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Edit Profile
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No work entries yet</p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Work Entries</h2>
              <div className="space-y-6">
                {entries.map((entry) => (
                  <Card key={entry.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={getCategoryColor(entry.category)}>
                            {entry.category}
                          </Badge>
                          {entry.status === "validated" && (
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="text-xs font-medium">Validated</span>
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">{formatDate(entry.date)}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{entry.title}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">{entry.description}</p>

                      {Object.keys(entry.proofLinks).length > 0 && (
                        <div className="flex flex-wrap gap-4 mb-4">
                          {entry.proofLinks.repo && (
                            <a
                              href={entry.proofLinks.repo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                              <Github className="w-4 h-4" />
                              Repository
                            </a>
                          )}
                          {entry.proofLinks.demo && (
                            <a
                              href={entry.proofLinks.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Demo
                            </a>
                          )}
                          {entry.proofLinks.doc && (
                            <a
                              href={entry.proofLinks.doc}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                              <FileText className="w-4 h-4" />
                              Document
                            </a>
                          )}
                          {entry.proofLinks.image && (
                            <a
                              href={entry.proofLinks.image}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                              <ImageIcon className="w-4 h-4" />
                              Image
                            </a>
                          )}
                        </div>
                      )}

                      {entry.validatorName && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-3 border-t border-border">
                          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span>Validated by {entry.validatorName}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
