'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FaceSmileIcon,
  DocumentTextIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline'
import { db } from '../lib/firebase/config'
import { collection, getDocs, query, where } from 'firebase/firestore'

export default function Games() {
  const router = useRouter()
  const [currentGame, setCurrentGame] = useState<string>('emoji-nlp')
  const [loading, setLoading] = useState(true)
  const [showStartButton, setShowStartButton] = useState(false)

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

        // Get user's scores
        const participantsRef = collection(db, 'participants')
        const q = query(participantsRef, where('usn', '==', usn))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          // New user, start with emoji-nlp
          setCurrentGame('emoji-nlp')
        } else {
          const userData = querySnapshot.docs[0].data()
          const scores = userData.scores || {}

          // Determine next game based on scores
          if (!scores.emojiNlp) {
            setCurrentGame('emoji-nlp')
          } else if (!scores.categorize) {
            setCurrentGame('categorize')
          } else if (!scores.wordMorph) {
            setCurrentGame('word-morph')
          } else {
            // All games completed
            setCurrentGame('completed')
          }
        }
      } catch (error) {
        console.error('Error checking progress:', error)
      } finally {
        setLoading(false)
        setShowStartButton(true)
      }
    }

    checkUserAndProgress()
  }, [router])

  const handleStartGame = () => {
    if (currentGame !== 'completed') {
      router.push(`/games/${currentGame}`)
    }
  }

  const games = [
    {
      title: 'Emoji NLP',
      description: 'Guess NLP/ML terms from emoji combinations',
      icon: <FaceSmileIcon className="w-12 h-12" />,
      color: 'bg-pink-100 text-pink-600',
      status: currentGame === 'emoji-nlp' ? 'current' : 
              currentGame === 'categorize' || currentGame === 'word-morph' || currentGame === 'completed' ? 'completed' : 'upcoming'
    },
    {
      title: 'Categorize That!',
      description: 'Classify short text into their correct categories',
      icon: <DocumentTextIcon className="w-12 h-12" />,
      color: 'bg-purple-100 text-purple-600',
      status: currentGame === 'categorize' ? 'current' : 
              currentGame === 'word-morph' || currentGame === 'completed' ? 'completed' : 'upcoming'
    },
    {
      title: 'Word Morph',
      description: 'Transform words one letter at a time',
      icon: <ArrowsRightLeftIcon className="w-12 h-12" />,
      color: 'bg-blue-100 text-blue-600',
      status: currentGame === 'word-morph' ? 'current' : 
              currentGame === 'completed' ? 'completed' : 'upcoming'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (currentGame === 'completed') {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-primary">
          Congratulations!
        </h1>
        <p className="text-center text-xl mb-8">
          You have completed all the games. Thank you for participating!
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-primary">
        Round 1: ML Nova
      </h1>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {games.map((game, index) => (
          <div 
            key={index} 
            className={`card h-full ${
              game.status === 'current' ? 'ring-2 ring-primary' : 
              game.status === 'completed' ? 'opacity-75' : 'opacity-50'
            }`}
          >
            <div className={`rounded-full p-4 w-fit mb-4 ${game.color}`}>
              {game.icon}
            </div>
            <h2 className="text-xl font-semibold mb-2">{game.title}</h2>
            <p className="text-gray-600">{game.description}</p>
            <div className="mt-4">
              {game.status === 'current' && (
                <span className="text-primary font-semibold">Current Game</span>
              )}
              {game.status === 'completed' && (
                <span className="text-green-600 font-semibold">Completed</span>
              )}
              {game.status === 'upcoming' && (
                <span className="text-gray-500 font-semibold">Upcoming</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {showStartButton && currentGame !== 'completed' && (
        <div className="text-center">
          <button
            onClick={handleStartGame}
            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-lg font-semibold"
          >
            Start {games.find(g => g.status === 'current')?.title}
          </button>
        </div>
      )}
    </main>
  )
} 