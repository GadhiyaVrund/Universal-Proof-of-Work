"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/context/auth-context"
import { getWorkEntryById, updateWorkEntry } from "@/services/work.service"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function EditWorkEntryPage() {
    const { user, userProfile, loading: authLoading } = useAuth()
    const router = useRouter()
    const params = useParams()
    const entryId = params.id as string

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "project" as "project" | "task" | "contribution",
        date: "",
        repoLink: "",
        demoLink: "",
        docLink: "",
        imageLink: "",
    })
    const [loadingInitial, setLoadingInitial] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    // Load entry data
    useEffect(() => {
        async function loadEntry() {
            if (!user) return

            try {
                const { entry, error: fetchError } = await getWorkEntryById(entryId)

                if (fetchError) {
                    setError(`Error fetching entry: ${fetchError}`)
                    setLoadingInitial(false)
                    return
                }

                if (!entry) {
                    setError("Entry not found")
                    setLoadingInitial(false)
                    return
                }

                // Ownership check
                if (entry.userId !== user.uid) {
                    setError("You do not have permission to edit this entry")
                    setLoadingInitial(false)
                    return
                }

                setFormData({
                    title: entry.title,
                    description: entry.description,
                    category: entry.category,
                    date: entry.date instanceof Date ? entry.date.toISOString().split("T")[0] : new Date(entry.date).toISOString().split("T")[0],
                    repoLink: entry.proofLinks?.repo || "",
                    demoLink: entry.proofLinks?.demo || "",
                    docLink: entry.proofLinks?.doc || "",
                    imageLink: entry.proofLinks?.image || "",
                })
            } catch (err) {
                console.error(err)
                setError("Failed to load entry")
            } finally {
                setLoadingInitial(false)
            }
        }

        if (!authLoading && user) {
            loadEntry()
        } else if (!authLoading && !user) {
            router.push("/login")
        }
    }, [user, authLoading, entryId, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setError("")
        setSubmitting(true)

        try {
            const proofLinks: Record<string, string> = {}
            if (formData.repoLink) proofLinks.repo = formData.repoLink
            if (formData.demoLink) proofLinks.demo = formData.demoLink
            if (formData.docLink) proofLinks.doc = formData.docLink
            if (formData.imageLink) proofLinks.image = formData.imageLink

            const result = await updateWorkEntry(entryId, {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                date: new Date(formData.date),
                proofLinks,
            })

            if (result.error) {
                setError(result.error)
            } else {
                router.push("/dashboard")
            }
        } catch (err) {
            setError("Failed to update work entry. Please try again.")
            console.error(err)
        } finally {
            setSubmitting(false)
        }
    }

    if (authLoading || loadingInitial) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!user || !userProfile) {
        return null
    }

    if (error && !formData.title) {
        return (
            <div className="min-h-screen bg-background">
                <DashboardHeader user={userProfile} />
                <main className="container mx-auto px-4 py-8 max-w-3xl">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-destructive text-center">{error}</div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader user={userProfile} />
            <main className="container mx-auto px-4 py-8 max-w-3xl">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Work Entry</CardTitle>
                        <CardDescription>Update your proof of work entry</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Built user authentication system"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe what you built, the technologies used, and the impact it had..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={5}
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value: "project" | "task" | "contribution") =>
                                            setFormData({ ...formData, category: value })
                                        }
                                    >
                                        <SelectTrigger id="category">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="project">Project</SelectItem>
                                            <SelectItem value="task">Task</SelectItem>
                                            <SelectItem value="contribution">Contribution</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-medium">Proof Links (Optional)</h3>
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="repoLink">Repository URL</Label>
                                        <Input
                                            id="repoLink"
                                            type="url"
                                            placeholder="https://github.com/username/repo"
                                            value={formData.repoLink}
                                            onChange={(e) => setFormData({ ...formData, repoLink: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="demoLink">Demo URL</Label>
                                        <Input
                                            id="demoLink"
                                            type="url"
                                            placeholder="https://demo.example.com"
                                            value={formData.demoLink}
                                            onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="docLink">Document URL</Label>
                                        <Input
                                            id="docLink"
                                            type="url"
                                            placeholder="https://docs.google.com/..."
                                            value={formData.docLink}
                                            onChange={(e) => setFormData({ ...formData, docLink: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="imageLink">Image URL</Label>
                                        <Input
                                            id="imageLink"
                                            type="url"
                                            placeholder="https://example.com/image.png"
                                            value={formData.imageLink}
                                            onChange={(e) => setFormData({ ...formData, imageLink: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="submit" disabled={submitting} className="flex-1">
                                    {submitting ? "Saving..." : "Save Changes"}
                                </Button>
                                <Link href="/dashboard" className="flex-1">
                                    <Button type="button" variant="outline" className="w-full bg-transparent">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
