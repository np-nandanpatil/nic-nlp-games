'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const wordPairs = [
  { start: 'cat', end: 'dog' },
  { start: 'lead', end: 'gold' },
  { start: 'cold', end: 'warm' },
  { start: 'love', end: 'hate' },
  { start: 'left', end: 'right' }
]

export default function WordMorph() {
  const router = useRouter()
  const [currentPair, setCurrentPair] = useState(0)
  const [currentWord, setCurrentWord] = useState('')
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (!userData) {
      router.push('/')
    }
    setCurrentWord(wordPairs[currentPair].start)
  }, [currentPair, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newWord = (e.target as HTMLFormElement).word.value.toLowerCase().trim()
    
    if (newWord.length !== currentWord.length) {
      alert('Word must be the same length!')
      return
    }

    let diffCount = 0
    for (let i = 0; i < newWord.length; i++) {
      if (newWord[i] !== currentWord[i]) {
        diffCount++
      }
    }

    if (diffCount !== 1) {
      alert('You can only change one letter at a time!')
      return
    }

    setAttempts(attempts + 1)
    setCurrentWord(newWord)

    if (newWord === wordPairs[currentPair].end) {
      setIsCorrect(true)
      setShowFeedback(true)
      const points = Math.max(10 - attempts, 1)
      setScore(score + points)
      
      setTimeout(() => {
        setShowFeedback(false)
        setAttempts(0)
        if (currentPair < wordPairs.length - 1) {
          setCurrentPair(currentPair + 1)
        } else {
          // Game completed
          const userData = JSON.parse(localStorage.getItem('userData') || '{}')
          localStorage.setItem(`${userData.usn}_wordMorph`, score.toString())
          router.push('/games')
        }
      }, 2000)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          Word Morph
        </h1>

        <div className="card">
          <div className="text-center mb-8">
            <div className="text-gray-600 mb-2">
              Puzzle {currentPair + 1} of {wordPairs.length}
            </div>
            <div className="text-xl font-semibold mb-4">
              Score: {score}
            </div>
            <div className="text-2xl font-bold mb-4">
              {wordPairs[currentPair].start} → {wordPairs[currentPair].end}
            </div>
            <div className="text-xl font-semibold mb-4">
              Current: {currentWord}
            </div>
            <div className="text-sm text-gray-500">
              Attempts: {attempts}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="word"
                className="input-field"
                placeholder="Enter next word..."
                required
              />
            </div>

            {showFeedback && (
              <div className="text-center p-2 rounded bg-green-100 text-green-700">
                Correct! +{Math.max(10 - attempts, 1)} points
              </div>
            )}

            <button type="submit" className="btn-primary w-full">
              Submit Word
            </button>
          </form>
        </div>
      </div>
    </main>
  )
} 