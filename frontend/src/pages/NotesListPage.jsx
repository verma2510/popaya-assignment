import React from 'react'
import { useNavigate } from 'react-router-dom'
import NoteCard from '../components/NoteCard'

const MOCK_NOTES = [
  {
    _id: '1',
    title: 'Meeting Notes — Q3 Review',
    content: 'Discussed roadmap priorities for the next quarter. Key points: shipping the redesign, fixing the onboarding flow, and reducing churn.',
    tags: ['work', 'meetings'],
    isPinned: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: '2',
    title: 'Book List 2025',
    content: 'Atomic Habits, Deep Work, The Pragmatic Programmer, Clean Code, Designing Data-Intensive Applications.',
    tags: ['personal', 'reading'],
    isPinned: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: '3',
    title: 'API Design Checklist',
    content: 'Always version your API. Use nouns not verbs in endpoints. Return consistent error shapes. Use proper HTTP status codes.',
    tags: ['dev'],
    isPinned: false,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
]

export const NotesListPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-base font-bold text-gray-900">Notes</h1>
          </div>
          <div className="flex-1" />
          <button
            onClick={() => navigate('/notes/create')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Note
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <p className="text-xs text-gray-400 mb-4">{MOCK_NOTES.length} notes</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_NOTES.map((note) => (
            <NoteCard key={note._id} note={note} onDeleteClick={(id) => console.log('delete', id)} />
          ))}
        </div>
      </main>
    </div>
  )
}