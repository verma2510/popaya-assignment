import React from 'react'
import { useNavigate } from 'react-router-dom'

const EmptyState = ({ isSearching = false }) => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
        {isSearching ? (
          <svg className="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        ) : (
          <svg className="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
      </div>
      {isSearching ? (
        <>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">No notes match your search</h3>
          <p className="text-xs text-gray-500">Try different keywords</p>
        </>
      ) : (
        <>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">No notes yet</h3>
          <p className="text-xs text-gray-500 mb-5">Create your first note to get started</p>
          <button
            onClick={() => navigate('/notes/create')}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create your first note
          </button>
        </>
      )}
    </div>
  )
}

export default EmptyState