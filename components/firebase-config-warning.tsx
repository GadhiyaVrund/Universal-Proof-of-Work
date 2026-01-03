"use client"

// FIREBASE DISABLED FOR FRONTEND PREVIEW
// Warning component disabled to avoid clutter during frontend development

/* Original Firebase warning code:
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { isConfigured } from "@/lib/firebase"
*/

export function FirebaseConfigWarning() {
  // Return null - no warning needed during frontend preview
  return null

  /* Original Firebase warning UI:
  if (isConfigured) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Firebase Not Configured</AlertTitle>
        <AlertDescription className="mt-2 space-y-2">
          <p>Please add your Firebase configuration to the environment variables:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>NEXT_PUBLIC_FIREBASE_API_KEY</li>
            <li>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
            <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
            <li>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</li>
            <li>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</li>
            <li>NEXT_PUBLIC_FIREBASE_APP_ID</li>
          </ul>
          <p className="text-sm mt-2">Get these values from your Firebase Console: console.firebase.google.com</p>
        </AlertDescription>
      </Alert>
    </div>
  )
  */
}
