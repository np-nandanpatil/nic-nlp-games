'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  FaceSmileIcon,
  DocumentTextIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline'

export default function Games() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is registered
    const userData = localStorage.getItem('userData')
    if (!userData) {
      router.push('/')
    }
  }, [router])

  const games = [
    {
      title: 'Emoji NLP',
      description: 'Guess NLP/ML terms from emoji combinations',
      icon: <FaceSmileIcon className="w-12 h-12" />,
      href: '/games/emoji-nlp',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      title: 'Categorize That!',
      description: 'Classify short text into their correct categories',
      icon: <DocumentTextIcon className="w-12 h-12" />,
      href: '/games/categorize',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Word Morph',
      description: 'Transform words one letter at a time',
      icon: <ArrowsRightLeftIcon className="w-12 h-12" />,
      href: '/games/word-morph',
      color: 'bg-blue-100 text-blue-600'
    }
  ]

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-primary">
        Choose Your Challenge
      </h1>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <Link key={index} href={game.href}>
            <div className="card hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className={`rounded-full p-4 w-fit mb-4 ${game.color}`}>
                {game.icon}
              </div>
              <h2 className="text-xl font-semibold mb-2">{game.title}</h2>
              <p className="text-gray-600">{game.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
} 