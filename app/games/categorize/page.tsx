'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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

  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (!userData) {
      router.push('/')
    }
  }, [router])

  const handleAnswer = (category: string) => {
    const isCorrect = category === questions[currentQuestion].category
    setSelectedAnswer(category)
    setShowFeedback(true)
    
    if (isCorrect) {
      setScore(score + 10)
    }

    setTimeout(() => {
      setShowFeedback(false)
      setSelectedAnswer('')
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        // Game completed
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        localStorage.setItem(`${userData.usn}_categorize`, score.toString())
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
                disabled={showFeedback}
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
        </div>
      </div>
    </main>
  )
} 