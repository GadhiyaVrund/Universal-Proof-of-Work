"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ExternalLink, Github, FileText, ImageIcon, Copy } from "lucide-react"
import type { WorkEntry } from "@/types"
import { useState } from "react"
import { useAuth } from "@/context/auth-context"

interface WorkEntryCardProps {
  entry: WorkEntry
}

export function WorkEntryCard({ entry }: WorkEntryCardProps) {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const isOwner = user?.uid === entry.userId

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

  const handleCopyId = () => {
    navigator.clipboard.writeText(entry.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge variant="outline" className={getCategoryColor(entry.category)}>
            {entry.category}
          </Badge>
          {entry.status === "validated" ? (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-medium">Validated</span>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyId}
              className="h-auto py-1 px-2 text-xs bg-transparent"
            >
              <Copy className="w-3 h-3 mr-1" />
              {copied ? "Copied!" : "Copy ID"}
            </Button>
          )}
        </div>
        <CardTitle className="text-lg">{entry.title}</CardTitle>
        <CardDescription>{formatDate(entry.date)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{entry.description}</p>
        {Object.keys(entry.proofLinks).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {entry.proofLinks.repo && (
              <a
                href={entry.proofLinks.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Github className="w-3 h-3" />
                Repository
              </a>
            )}
            {entry.proofLinks.demo && (
              <a
                href={entry.proofLinks.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                Demo
              </a>
            )}
            {entry.proofLinks.doc && (
              <a
                href={entry.proofLinks.doc}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <FileText className="w-3 h-3" />
                Document
              </a>
            )}
            {entry.proofLinks.image && (
              <a
                href={entry.proofLinks.image}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ImageIcon className="w-3 h-3" />
                Image
              </a>
            )}
          </div>
        )}
        {entry.validatorName && (
          <p className="text-xs text-muted-foreground mb-4">Validated by {entry.validatorName}</p>
        )}
        <div className="flex gap-2">
          <Link href={`/dashboard/entry/${entry.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              View Details
            </Button>
          </Link>
          {isOwner && (
            <Link href={`/dashboard/edit/${entry.id}`} className="flex-1">
              <Button variant="default" size="sm" className="w-full">
                Edit
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
