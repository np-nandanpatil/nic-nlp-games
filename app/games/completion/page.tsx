'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function Completion() {
     const router = useRouter()
     const searchParams = useSearchParams()
     const [score, setScore] = useState<number | null>(null)
     const [game, setGame] = useState<string | null>(null)

     useEffect(() => {
          const scoreParam = searchParams.get('score')
          const gameParam = searchParams.get('game')

          if (!scoreParam || !gameParam) {
               router.push('/games')
               return
          }

          // Check if game is already completed
          const completedGames = JSON.parse(localStorage.getItem('completedGames') || '[]')
          if (!completedGames.includes(gameParam)) {
               router.push('/games')
               return
          }

          setScore(parseInt(scoreParam))
          setGame(gameParam)
     }, [searchParams, router])

     if (!score || !game) {
          return null
     }

     return (
          <main className="min-h-screen flex flex-col items-center justify-center p-4">
               <div className="max-w-md w-full text-center">
                    <h1 className="text-4xl font-bold mb-8 text-primary">
                         Congratulations!
                    </h1>

                    <div className="card">
                         <div className="text-center mb-8">
                              <div className="text-2xl font-semibold mb-4">
                                   You've completed the {game === 'wordMorph' ? 'Word Morph' : game} game!
                              </div>
                              <div className="text-3xl font-bold mb-8">
                                   Final Score: {score}
                              </div>

                              <div className="space-y-4">
                                   <Link href="/" className="btn-primary block">
                                        Return to Home
                                   </Link>
                              </div>
                         </div>
                    </div>
               </div>
          </main>
     )
} 