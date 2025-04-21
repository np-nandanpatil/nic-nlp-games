'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const emojiQuestions = [
  { emojis: '🤖💭', answer: 'machine learning' },
  { emojis: '🗣️💻', answer: 'natural language processing' },
  { emojis: '🧠⚡', answer: 'neural network' },
  { emojis: '📊📈', answer: 'data analysis' },
  { emojis: '🔍📝', answer: 'text mining' },
  { emojis: '🎯💯', answer: 'accuracy' },
  { emojis: '🔄🎯', answer: 'iteration' },
  { emojis: '📚🤖', answer: 'training data' },
  { emojis: '🧪💡', answer: 'hypothesis' },
  { emojis: '🎲📊', answer: 'probability' }
]

export default function EmojiNlp() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (!userData) {
      router.push('/')
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const isAnswerCorrect = answer.toLowerCase().trim() === emojiQuestions[currentQuestion].answer
    setIsCorrect(isAnswerCorrect)
    if (isAnswerCorrect) {
      setScore(score + 10)
    }
    
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      setAnswer('')
      if (currentQuestion < emojiQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        // Game completed
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        localStorage.setItem(`${userData.usn}_emojiNlp`, score.toString())
        router.push('/games')
      }
    }, 2000)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          Emoji NLP
        </h1>

        <div className="card">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{emojiQuestions[currentQuestion].emojis}</div>
            <div className="text-gray-600">
              Question {currentQuestion + 1} of {emojiQuestions.length}
            </div>
            <div className="text-xl font-semibold mt-2">
              Score: {score}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                className="input-field"
                placeholder="Enter your answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={showFeedback}
                required
              />
            </div>

            {showFeedback && (
              <div className={`text-center p-2 rounded ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isCorrect ? 'Correct! +10 points' : `Wrong! The answer was: ${emojiQuestions[currentQuestion].answer}`}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={showFeedback}
            >
              Submit Answer
            </button>
          </form>
        </div>
      </div>
    </main>
  )
} 