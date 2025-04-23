'use client'

import { useEffect, useState } from 'react'
import { getParticipants, Participant } from '../lib/firebase/services'

export default function Admin() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const data = await getParticipants()
        setParticipants(data)
      } catch (err) {
        setError('Failed to fetch participants')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchParticipants()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen p-8">
        <div className="text-center text-red-500">
          <h1 className="text-2xl font-bold">{error}</h1>
          <p>Please try again later</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-primary">
        Admin Dashboard
      </h1>

      <div className="max-w-6xl mx-auto">
        <div className="card overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Rank</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">USN</th>
                <th className="text-center p-4">Emoji NLP</th>
                <th className="text-center p-4">Categorize</th>
                <th className="text-center p-4">Word Morph</th>
                <th className="text-center p-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant, index) => (
                <tr key={participant.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{participant.name}</td>
                  <td className="p-4">{participant.usn}</td>
                  <td className="p-4 text-center">{participant.scores.emojiNlp}</td>
                  <td className="p-4 text-center">{participant.scores.categorize}</td>
                  <td className="p-4 text-center">{participant.scores.wordMorph}</td>
                  <td className="p-4 text-center font-semibold">{participant.scores.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
} 


// https://copilot.microsoft.com/chats/1veXShCPohs3YijKpVvRF