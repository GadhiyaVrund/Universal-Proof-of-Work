"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { WorkEntryList } from "@/components/dashboard/work-entry-list"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
        <p className="text-muted-foreground mb-4">
          Your account exists but we couldn't find your profile data.
          <br />
          This might happen if your account creation was interrupted.
        </p>
        <Button
          onClick={async () => {
            const { signOut } = await import("@/services/auth.service")
            await signOut()
            window.location.reload()
          }}
        >
          Sign Out & Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={userProfile} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Work Entries</h1>
            <p className="text-muted-foreground mt-1">Manage and showcase your professional contributions</p>
          </div>
          <Link href="/dashboard/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Work Entry
            </Button>
          </Link>
        </div>
        <WorkEntryList userId={user.uid} />
      </main>
    </div>
  )
}
