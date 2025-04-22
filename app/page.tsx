'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRightIcon } from '@heroicons/react/24/solid'

export default function Home() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    mobile: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Store user data in localStorage
    localStorage.setItem('userData', JSON.stringify(formData))
    // Redirect to games page
    router.push('/games')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          NIC&apos;s ML Nova - Round 1
        </h1>
        
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6 text-center">Registration</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="usn" className="block text-sm font-medium text-gray-700 mb-1">
                USN (1MJ00AA000)
              </label>
              <input
                type="text"
                id="usn"
                required
                pattern="1MJ[0-9]{2}[A-Z]{2}[0-9]{3}"
                className="input-field"
                value={formData.usn}
                onChange={(e) => setFormData({ ...formData, usn: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                required
                pattern="[0-9]{10}"
                className="input-field"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              Start Games
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* <div className="mt-8 text-center">
          <Link href="/admin" className="text-secondary hover:underline">
            Admin Dashboard
          </Link>
        </div> */}
      </div>
    </main>
  )
} 