'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FaceSmileIcon,
  DocumentTextIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline'
import { db } from '../lib/firebase/config'
import { collection, getDocs, query, where } from 'firebase/firestore'

export default function Games() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [completedGames, setCompletedGames] = useState<string[]>([])
  const [scores, setScores] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    const checkUserAndProgress = async () => {
      try {
        // Check if user is registered
        const userData = localStorage.getItem('userData')
        if (!userData) {
          router.push('/')
          return
        }

        const { usn } = JSON.parse(userData)
        if (!db) throw new Error('Firebase not initialized')

        // Get user's progress from Firebase
        const participantsRef = collection(db, 'participants')
        const q = query(participantsRef, where('usn', '==', usn))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data()
          const userProgress = userData.currentProgress || {}
          const userScores = userData.scores || {}

          // Check which games are completed based on progress
          const completed = []
          if (userProgress.emojiNlp >= 10) completed.push('emojiNlp')
          if (userProgress.categorize >= 10) completed.push('categorize')
          if (userProgress.wordMorph >= 5) completed.push('wordMorph')

          setCompletedGames(completed)
          setScores(userScores)
        }

        // Also check localStorage for completed games
        const localCompleted = JSON.parse(localStorage.getItem('completedGames') || '[]')
        setCompletedGames(prev => Array.from(new Set([...prev, ...localCompleted])))
      } catch (error) {
        console.error('Error checking progress:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUserAndProgress()
  }, [router])

  const handleGameClick = (gameId: string) => {
    if (completedGames.includes(gameId)) {
      alert('You have already completed this game!')
      return
    }
    router.push(`/games/${gameId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          Choose a Game
        </h1>

        <div className="space-y-4">
          <button
            onClick={() => handleGameClick('word-morph')}
            className={`btn-primary w-full ${completedGames.includes('wordMorph') ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={completedGames.includes('wordMorph')}
          >
            Word Morph {completedGames.includes('wordMorph') && `(Completed - ${scores.wordMorph || 0} points)`}
          </button>

          <button
            onClick={() => handleGameClick('categorize')}
            className={`btn-primary w-full ${completedGames.includes('categorize') ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={completedGames.includes('categorize')}
          >
            Categorize {completedGames.includes('categorize') && `(Completed - ${scores.categorize || 0} points)`}
          </button>

          <button
            onClick={() => handleGameClick('emoji-nlp')}
            className={`btn-primary w-full ${completedGames.includes('emojiNlp') ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={completedGames.includes('emojiNlp')}
          >
            Emoji NLP {completedGames.includes('emojiNlp') && `(Completed - ${scores.emojiNlp || 0} points)`}
          </button>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="btn-secondary">
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  )
} 