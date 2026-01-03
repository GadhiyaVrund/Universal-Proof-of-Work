# Universal Proof of Work (UPoW)

A modern platform where professionals create verifiable proof of real work instead of traditional resumes. Built with Next.js 16, React, TypeScript, and Firebase.

## Features

- **Email/Password Authentication** - Secure user registration and login
- **Work Entry Management** - Create, edit, and delete work entries with proof links
- **Peer Validation System** - Allow other users to validate your work entries
- **Public Shareable Profiles** - Showcase your validated work with a clean profile page
- **Dashboard with Stats** - Track your work entries and validation count
- **Proof Links** - Link to repositories, demos, documents, and images as evidence

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Firebase (Authentication, Firestore, Storage)
- shadcn/ui Components

## Project Structure

```
/app                    # Next.js pages and routes
  /dashboard            # Protected dashboard pages
  /login               # Login page
  /signup              # Signup page
  /profile/[id]        # Public profile pages
  /(authenticated)     # Route group for authenticated pages
    /validate          # Work entry validation page
/components            # Reusable UI components
  /dashboard          # Dashboard-specific components
  /ui                 # shadcn/ui components
/context              # React context providers
/hooks                # Custom React hooks
/lib                  # Core utilities and Firebase config
/services             # Service layer for Firebase operations
/types                # TypeScript type definitions
```

## Firebase Setup

### 1. Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project" and follow the setup wizard
3. Once created, click "Continue"

### 2. Enable Authentication

1. In your Firebase project, go to **Build** > **Authentication**
2. Click "Get started"
3. Under "Sign-in method" tab, click "Email/Password"
4. Enable the first toggle (Email/Password)
5. Click "Save"

### 3. Create Firestore Database

1. Go to **Build** > **Firestore Database**
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location close to your users
5. Click "Enable"

### 4. Enable Firebase Storage

1. Go to **Build** > **Storage**
2. Click "Get started"
3. Use the default security rules for now
4. Click "Done"

### 5. Get Your Firebase Config

1. Go to **Project settings** (gear icon in sidebar)
2. Scroll down to "Your apps" section
3. Click the web icon `</>` to create a web app
4. Register your app with a nickname (e.g., "UPoW Web")
5. Copy the config values (apiKey, authDomain, etc.)

### 6. Add Environment Variables

**In v0:**
1. Click the sidebar menu in your chat
2. Go to **Vars** section
3. Add each variable with its value:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
```

**When Deployed to Vercel:**
1. Go to your project settings in Vercel
2. Navigate to **Environment Variables**
3. Add the same variables as above

### 7. Configure Firestore Security Rules

In Firebase Console > Firestore Database > Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data and all public profiles
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Work entries - anyone can read, only owner can write
    match /workEntries/{entryId} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && (
        // Owner can update their own entries
        resource.data.userId == request.auth.uid ||
        // Others can only add validation (not edit other fields)
        (request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'validatorId', 'validatorName', 'validatedAt', 'updatedAt']) &&
         request.resource.data.validatorId == request.auth.uid &&
         resource.data.userId != request.auth.uid)
      );
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## Getting Started

### Development in v0

1. Set up your Firebase project following the steps above
2. Add Firebase environment variables in the Vars section
3. The app will automatically reload with your Firebase config
4. You should see the landing page without errors
5. Click "Get Started" to create an account

### Deployment to Vercel

1. Click "Publish" in the top right of v0
2. Connect your Vercel account if not already connected
3. Choose a project name
4. Add all environment variables in Vercel project settings
5. Click "Deploy"
6. Your app will be live at your-app.vercel.app

## Troubleshooting

### Firebase Error: "auth/invalid-api-key"

This means your Firebase environment variables are not set correctly. Make sure:
- All 6 environment variables are added in the Vars section
- Variable names exactly match (including `NEXT_PUBLIC_` prefix)
- No extra spaces in the values
- Values are copied directly from Firebase Console

### Can't Create Account

1. Check that Email/Password authentication is enabled in Firebase
2. Verify Firestore security rules are updated
3. Check browser console for specific error messages

### Work Entry Not Saving

1. Verify Firestore Database is created
2. Check that security rules are properly configured
3. Ensure user is authenticated

## How to Use

### For Users

1. **Sign Up** - Create an account with email and password
2. **Complete Your Profile** - Go to Settings and add your name, role, and bio
3. **Add Work Entries** - Click "New Entry" to document your projects
4. **Add Proof Links** - Include GitHub repos, live demos, or documentation
5. **Share for Validation** - Copy the work entry ID and share with colleagues
6. **Build Your Profile** - Validated work builds a credible professional identity
7. **Share Your Profile** - Share your public profile URL to showcase all work

### For Validators

1. **Navigate to Validate** - Click "Validate Work" in the dashboard header
2. **Enter Work Entry ID** - Paste the ID shared by the creator
3. **Review Carefully** - Check the title, description, and all proof links
4. **Validate** - Click "Validate This Work" if legitimate
5. **See Results** - The entry will show as validated with your name

## Key Pages

- `/` - Landing page with features and how-it-works
- `/login` - User login
- `/signup` - User registration
- `/dashboard` - User dashboard with work entries
- `/dashboard/new` - Create new work entry
- `/dashboard/entry/[id]` - View/edit work entry details
- `/dashboard/settings` - Edit profile settings
- `/validate` - Validate other users' work entries
- `/profile/[id]` - Public user profile with all work entries

## Firestore Schema

### users collection
```typescript
{
  id: string              // document ID = Firebase Auth UID
  email: string
  name: string
  role?: string           // e.g., "Full Stack Developer"
  bio?: string            // User bio/description
  avatarUrl?: string      // Profile picture URL
  createdAt: string       // ISO timestamp
  updatedAt: string       // ISO timestamp
}
```

### workEntries collection
```typescript
{
  id: string              // auto-generated document ID
  userId: string          // reference to users collection
  title: string           // work entry title
  description: string     // detailed description
  category: 'project' | 'task' | 'contribution'
  proofLinks: {
    repo?: string         // GitHub repository URL
    demo?: string         // live demo URL
    doc?: string          // documentation URL
    image?: string        // screenshot/image URL
  }
  date: timestamp         // date of work completion
  status: 'pending' | 'validated'
  validatorId?: string    // user ID who validated
  validatorName?: string  // name of validator
  validatedAt?: timestamp // validation date
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Security

- Firebase Authentication for secure user management
- Firestore security rules should be configured to:
  - Allow users to read/write their own data
  - Allow read access to public profiles
  - Prevent users from validating their own work
  - Ensure only authenticated users can create/validate work

## Future Enhancements

- OAuth authentication (Google, GitHub)
- File upload for proof images
- Search and discover profiles
- Skill tags and filtering
- Validation reputation system
- Activity feed
- Export profile as PDF
- Email notifications
- Comment system on work entries
- Rich text editor for descriptions

## Support

For issues or questions about v0, visit https://vercel.com/help

## License

MIT
