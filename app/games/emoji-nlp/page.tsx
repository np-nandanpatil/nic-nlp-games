'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateScore, updateProgress } from '../../lib/firebase/services'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (!userData) {
      router.push('/')
      return
    }

    // Get saved progress and set current question
    const { currentProgress, scores } = JSON.parse(userData)
    if (currentProgress?.emojiNlp !== undefined) {
      setCurrentQuestion(currentProgress.emojiNlp)
      setScore(scores?.emojiNlp || 0)
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const isAnswerCorrect = answer.toLowerCase().trim() === emojiQuestions[currentQuestion].answer
    setIsCorrect(isAnswerCorrect)
    
    if (isAnswerCorrect) {
      const newScore = score + 10
      setScore(newScore)
      setLoading(true)
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        await updateScore(userData.usn, 'emojiNlp', newScore)
        
        // Update progress in Firebase and localStorage
        const nextQuestion = currentQuestion + 1
        await updateProgress(userData.usn, 'emojiNlp', nextQuestion)
        
        // Update localStorage with new progress and score
        localStorage.setItem('userData', JSON.stringify({
          ...userData,
          currentProgress: {
            ...userData.currentProgress,
            emojiNlp: nextQuestion
          },
          scores: {
            ...userData.scores,
            emojiNlp: newScore
          }
        }))
        console.log('Score and progress updated successfully')
      } catch (err) {
        console.error('Error updating score:', err)
        setError('Failed to save your score. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      setAnswer('')
      if (currentQuestion < emojiQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        // Only redirect if all questions are completed
        router.push('/games')
      }
    }, 2000)
  }

  // Add a useEffect to check if we should redirect to next game
  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      const { currentProgress } = JSON.parse(userData)
      // If we've loaded the game but all questions are done, redirect to games page
      if (currentProgress?.emojiNlp >= emojiQuestions.length) {
        router.push('/games')
      }
    }
  }, [router])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          Emoji NLP
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

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
                disabled={showFeedback || loading}
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
              disabled={showFeedback || loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Saving Score...
                </div>
              ) : (
                'Submit Answer'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
} 