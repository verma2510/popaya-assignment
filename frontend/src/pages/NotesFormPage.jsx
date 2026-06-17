import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NoteForm from '../components/NoteForm'
import { notesApi } from '../api/notesApi'

export const NoteFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [initialData, setInitialData] = useState(undefined)
  const [isLoadingNote, setIsLoadingNote] = useState(isEditing)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEditing) return
    const load = async () => {
      try {
        const res = await notesApi.getById(id)
        const { title, content, tags, isPinned } = res.data.data
        setInitialData({ title, content, tags, isPinned })
      } catch (err) {
        setError(err.message || 'Failed to load note')
      } finally {
        setIsLoadingNote(false)
      }
    }
    load()
  }, [id, isEditing])

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      setError(null)
      if (isEditing) {
        await notesApi.update(id, data)
        navigate(`/notes/${id}`)
      } else {
        const res = await notesApi.create(data)
        navigate(`/notes/${res.data.data._id}`)
      }
    } catch (err) {
      setError(err.message || 'Failed to create note')
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => navigate(isEditing ? `/notes/${id}` : '/')

  if (isLoadingNote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <button onClick={handleCancel} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h2 className="text-base font-semibold text-gray-900">{isEditing ? 'Edit Note' : 'New Note'}</h2>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <NoteForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            submitLabel={isEditing ? 'Update Note' : 'Create Note'}
          />
        </div>
      </main>
    </div>
  )
}