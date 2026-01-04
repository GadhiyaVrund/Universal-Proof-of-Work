"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { getWorkEntryById, deleteWorkEntry } from "@/services/work.service"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ArrowLeft, CheckCircle2, ExternalLink, Github, FileText, ImageIcon, Trash2, Edit } from "lucide-react"
import Link from "next/link"
import type { WorkEntry } from "@/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function WorkEntryDetailPage() {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [entry, setEntry] = useState<WorkEntry | null>(null)
  const [loadingEntry, setLoadingEntry] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    async function fetchEntry() {
      if (params.id) {
        const { entry: data } = await getWorkEntryById(params.id as string)
        setEntry(data)
        setLoadingEntry(false)
      }
    }

    fetchEntry()
  }, [params.id])

  const handleDelete = async () => {
    if (!entry) return
    setDeleting(true)
    const result = await deleteWorkEntry(entry.id)
    if (!result.error) {
      router.push("/dashboard")
    } else {
      setDeleting(false)
    }
  }

  if (loading || loadingEntry || !user || !userProfile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader user={userProfile} />
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Work entry not found</p>
        </div>
      </div>
    )
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

  const isOwner = user.uid === entry.userId

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={userProfile} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <Card>
          <CardHeader>
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
              {isOwner && (
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/edit/${entry.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive bg-transparent"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete work entry?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your work entry.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                          {deleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
            <CardTitle className="text-2xl">{entry.title}</CardTitle>
            <CardDescription>{formatDate(entry.date)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Description</h3>
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

            {entry.validatorName && entry.validatedAt && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-foreground">Validated by {entry.validatorName}</span>
                </div>
                <p className="text-xs text-muted-foreground ml-6">{formatDate(entry.validatedAt)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
