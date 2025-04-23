'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateScore } from '../../lib/firebase/services'

const categories = ['Sentiment', 'Topic', 'Intent']

const questions = [
  {
    text: "I absolutely love this product!",
    category: "Sentiment",
    options: ["Sentiment", "Topic", "Intent"]
  },
  {
    text: "How do I reset my password?",
    category: "Intent",
    options: ["Sentiment", "Topic", "Intent"]
  },
  {
    text: "The latest developments in quantum computing",
    category: "Topic",
    options: ["Sentiment", "Topic", "Intent"]
  },
  {
    text: "This service is terrible and frustrating",
    category: "Sentiment",
    options: ["Sentiment", "Topic", "Intent"]
  },
  {
    text: "Can you recommend a good restaurant?",
    category: "Intent",
    options: ["Sentiment", "Topic", "Intent"]
  },
  {
    text: "The impact of artificial intelligence on healthcare",
    category: "Topic",
    options: ["Sentiment", "Topic", "Intent"]
  },
  {
    text: "I'm not satisfied with the response time",
    category: "Sentiment",
    options: ["Sentiment", "Topic", "Intent"]
  },
  {
    text: "Where can I find the nearest ATM?",
    category: "Intent",
    options: ["Sentiment", "Topic", "Intent"]
  },
  {
    text: "Recent advances in renewable energy",
    category: "Topic",
    options: ["Sentiment", "Topic", "Intent"]
  },
  {
    text: "What are your business hours?",
    category: "Intent",
    options: ["Sentiment", "Topic", "Intent"]
  }
]

export default function Categorize() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (!userData) {
      router.push('/')
    }
  }, [router])

  const updateScoreInFirebase = async (newScore: number) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}')
      await updateScore(userData.usn, 'categorize', newScore)
    } catch (err) {
      console.error('Error updating score:', err)
      setError('Failed to save your score. Please try again.')
    }
  }

  const handleAnswer = async (category: string) => {
    const isCorrect = category === questions[currentQuestion].category
    setSelectedAnswer(category)
    setShowFeedback(true)
    
    if (isCorrect) {
      const newScore = score + 10
      setScore(newScore)
      setLoading(true)
      await updateScoreInFirebase(newScore)
      setLoading(false)
    }

    setTimeout(() => {
      setShowFeedback(false)
      setSelectedAnswer('')
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        // Game completed
        router.push('/games')
      }
    }, 2000)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          Categorize That!
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="card">
          <div className="text-center mb-8">
            <div className="text-gray-600 mb-2">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <div className="text-xl font-semibold mb-4">
              Score: {score}
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-lg">
              "{questions[currentQuestion].text}"
            </div>
          </div>

          <div className="space-y-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleAnswer(category)}
                disabled={showFeedback || loading}
                className={`w-full p-3 rounded-lg transition-colors ${
                  showFeedback
                    ? category === questions[currentQuestion].category
                      ? 'bg-green-100 text-green-700'
                      : category === selectedAnswer
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {showFeedback && (
            <div className="mt-4 text-center">
              {selectedAnswer === questions[currentQuestion].category ? (
                <div className="text-green-600">Correct! +10 points</div>
              ) : (
                <div className="text-red-600">
                  Wrong! The correct category was: {questions[currentQuestion].category}
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
              <span>Saving Score...</span>
            </div>
          )}
        </div>
      </div>
    </main>
  )
} 