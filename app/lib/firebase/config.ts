import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getAuth, Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Initialize Firebase only on the client side
let app: FirebaseApp | undefined
let db: Firestore | undefined
let auth: Auth | undefined

if (typeof window !== 'undefined') {
  try {
    if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
      throw new Error('Firebase configuration is missing required values')
    }
    
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    db = getFirestore(app)
    auth = getAuth(app)
    console.log('Firebase initialized successfully')
  } catch (error) {
    console.error('Error initializing Firebase:', error)
  }
}

export { app, db, auth } 