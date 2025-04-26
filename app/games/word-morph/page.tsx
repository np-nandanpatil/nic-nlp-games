'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateScore } from '../../lib/firebase/services'

const wordPairs = [
  { start: 'cat', end: 'dog' },
  { start: 'lead', end: 'gold' },
  { start: 'cold', end: 'warm' },
  { start: 'love', end: 'hate' },
  { start: 'head', end: 'tail' }
]

// Dictionary of valid words for each puzzle
const validWords: { [key: string]: string[] } = {
  'cat-dog': ['cat', 'cot', 'dot', 'dog'],
  'lead-gold': ['lead', 'load', 'goad', 'gold'],
  'cold-warm': ['cold', 'cord', 'card', 'ward', 'warm'],
  'love-hate': ['love', 'lave', 'late', 'hate'],
  'head-tail': ['head', 'heal', 'hell', 'hall', 'tall', 'tail']
}

// Dictionary of word meanings
const wordMeanings: { [key: string]: string } = {
  'cat': 'A small domesticated carnivorous mammal',
  'cot': 'A small bed, especially one for a baby',
  'dot': 'A small round mark or spot',
  'dog': 'A domesticated carnivorous mammal',
  'lead': 'To guide or direct',
  'load': 'A heavy or bulky thing being carried',
  'goad': 'To urge or encourage someone to do something',
  'gold': 'A yellow precious metal',
  'cold': 'Of or at a low temperature',
  'cord': 'A thin string or rope',
  'card': 'A piece of thick paper or thin cardboard',
  'ward': 'A division in a hospital',
  'warm': 'Of or at a moderately high temperature',
  'love': 'An intense feeling of deep affection',
  'lave': 'To wash or bathe',
  'late': 'After the expected or usual time',
  'hate': 'Feel intense or passionate dislike for',
  'head': 'The upper part of the body',
  'heal': 'To make or become healthy again',
  'hell': 'A place of suffering and evil',
  'hall': 'A large room for meetings or events',
  'tall': 'Of great or more than average height',
  'tail': 'The rear end of an animal'
}

export default function WordMorph() {
  const router = useRouter()
  const [currentPair, setCurrentPair] = useState(0)
  const [currentWord, setCurrentWord] = useState('')
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [lastWordMeaning, setLastWordMeaning] = useState<string | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (!userData) {
      router.push('/')
    }
    setCurrentWord(wordPairs[currentPair].start)
  }, [currentPair, router])

  const isValidWord = (word: string): boolean => {
    const currentPuzzle = `${wordPairs[currentPair].start}-${wordPairs[currentPair].end}`
    return validWords[currentPuzzle].includes(word.toLowerCase())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newWord = inputValue.toLowerCase().trim()
    
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

    // Increment attempts if the word satisfies the one-letter change rule
    setAttempts(attempts + 1)

    if (!isValidWord(newWord)) {
      alert('Not a valid word in this puzzle!')
      return
    }

    setCurrentWord(newWord)
    setInputValue('')
    setLastWordMeaning(wordMeanings[newWord] || null)

    if (newWord === wordPairs[currentPair].end) {
      setIsCorrect(true)
      setShowFeedback(true)
      
      // Award 10 points for each puzzle completion
      const points = 10
      const newScore = score + points
      setScore(newScore)
      
      // Update score immediately after puzzle completion
      setLoading(true)
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        await updateScore(userData.usn, 'wordMorph', newScore)
        console.log('Score updated successfully:', newScore)
      } catch (err) {
        console.error('Error updating score:', err)
        setError('Failed to save your score. Please try again.')
      } finally {
        setLoading(false)
      }
      
      setTimeout(() => {
        setShowFeedback(false)
        setAttempts(0)
        setLastWordMeaning(null)
        if (currentPair < wordPairs.length - 1) {
          setCurrentPair(currentPair + 1)
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

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

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
            {lastWordMeaning && (
              <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md">
                <strong>Meaning:</strong> {lastWordMeaning}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="input-field"
                placeholder="Enter next word..."
                required
                disabled={loading}
              />
            </div>

            {showFeedback && (
              <div className="text-center p-2 rounded bg-green-100 text-green-700">
                Correct! +10 points
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Saving Score...
                </div>
              ) : (
                'Submit Word'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
} 