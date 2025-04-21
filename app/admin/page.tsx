'use client'

import { useEffect, useState } from 'react'

interface Participant {
  name: string
  usn: string
  mobile: string
  scores: {
    emojiNlp: number
    categorize: number
    wordMorph: number
    total: number
  }
}

export default function Admin() {
  const [participants, setParticipants] = useState<Participant[]>([])

  useEffect(() => {
    // In a real app, this would be an API call
    // For demo, we'll get from localStorage
    const getParticipants = () => {
      const allData = { ...localStorage }
      const participantsList: Participant[] = []

      Object.keys(allData).forEach(key => {
        if (key === 'userData') {
          const userData = JSON.parse(allData[key])
          participantsList.push({
            ...userData,
            scores: {
              emojiNlp: Math.floor(Math.random() * 100),
              categorize: Math.floor(Math.random() * 100),
              wordMorph: Math.floor(Math.random() * 100),
              total: 0
            }
          })
        }
      })

      // Calculate total scores and sort
      participantsList.forEach(p => {
        p.scores.total = p.scores.emojiNlp + p.scores.categorize + p.scores.wordMorph
      })
      participantsList.sort((a, b) => b.scores.total - a.scores.total)

      setParticipants(participantsList)
    }

    getParticipants()
  }, [])

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
                <tr key={participant.usn} className="border-b hover:bg-gray-50">
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