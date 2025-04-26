import { db } from './config'
import { collection, addDoc, getDocs, query, orderBy, doc, getDoc, updateDoc, where } from 'firebase/firestore'

export interface Participant {
  id?: string  // Make id optional since it's added by Firebase
  name: string
  usn: string
  mobile: string
  currentProgress: {
    emojiNlp: number
    categorize: number
    wordMorph: number
  }
  scores: {
    emojiNlp: number
    categorize: number
    wordMorph: number
    total: number
  }
  createdAt: Date
  lastAnswerTime?: Date
}

export interface NewParticipant {
  name: string
  usn: string
  mobile: string
  currentProgress: {
    emojiNlp: number
    categorize: number
    wordMorph: number
  }
}

export const addParticipant = async (participant: NewParticipant) => {
  try {
    if (!db) throw new Error('Firebase not initialized')
    
    console.log('Adding participant:', participant)
    const docRef = await addDoc(collection(db, 'participants'), {
      ...participant,
      scores: {
        emojiNlp: 0,
        categorize: 0,
        wordMorph: 0,
        total: 0
      },
      createdAt: new Date()
    })
    console.log('Participant added with ID:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('Error adding participant:', error)
    throw error
  }
}

export const getParticipants = async (): Promise<Participant[]> => {
  try {
    if (!db) throw new Error('Firebase not initialized')
    
    console.log('Fetching participants...')
    const q = query(collection(db, 'participants'), orderBy('scores.total', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const participants = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Participant[]
    
    console.log('Fetched participants:', participants)
    return participants
  } catch (error) {
    console.error('Error getting participants:', error)
    throw error
  }
}

export const updateScore = async (usn: string, game: 'emojiNlp' | 'categorize' | 'wordMorph', score: number) => {
  try {
    if (!db) throw new Error('Firebase not initialized')
    
    console.log('Updating score for participant:', usn, 'game:', game, 'score:', score)
    
    // First, find the document with matching USN
    const participantsRef = collection(db, 'participants')
    const q = query(participantsRef, where('usn', '==', usn))
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      console.error('Participant not found:', usn)
      return
    }
    
    // Get the first matching document (there should only be one)
    const participantDoc = querySnapshot.docs[0]
    const participantRef = doc(db, 'participants', participantDoc.id)
    const currentData = participantDoc.data()
    
    const newScores = {
      ...currentData.scores,
      [game]: score,
      total: currentData.scores.total - currentData.scores[game] + score
    }
    
    await updateDoc(participantRef, {
      scores: newScores,
      lastAnswerTime: new Date()
    })
    console.log('Score updated successfully')
  } catch (error) {
    console.error('Error updating score:', error)
    throw error
  }
}

export const updateProgress = async (usn: string, game: 'emojiNlp' | 'categorize' | 'wordMorph', questionNumber: number) => {
  try {
    if (!db) throw new Error('Firebase not initialized')
    
    // Find the document with matching USN
    const participantsRef = collection(db, 'participants')
    const q = query(participantsRef, where('usn', '==', usn))
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      console.error('Participant not found:', usn)
      return
    }
    
    // Get the first matching document
    const participantDoc = querySnapshot.docs[0]
    const participantRef = doc(db, 'participants', participantDoc.id)
    const currentData = participantDoc.data()
    
    await updateDoc(participantRef, {
      currentProgress: {
        ...currentData.currentProgress,
        [game]: questionNumber
      }
    })
    console.log('Progress updated successfully')
  } catch (error) {
    console.error('Error updating progress:', error)
    throw error
  }
} 