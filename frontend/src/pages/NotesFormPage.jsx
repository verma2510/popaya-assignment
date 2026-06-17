import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NoteForm from '../components/NoteForm'

export const NoteFormPage = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data) => {
    console.log('Form data:', data)
    // API call
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h2 className="text-base font-semibold text-gray-900">New Note</h2>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <NoteForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/')}
            isSubmitting={isSubmitting}
            submitLabel="Create Note"
          />
        </div>
      </main>
    </div>
  )
}