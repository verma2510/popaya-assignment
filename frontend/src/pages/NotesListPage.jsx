import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { notesApi } from '../api/notesApi'
import NoteCard from '../components/NoteCard'
import SearchBar from '../components/SearchBar'
import useDebounce from '../hooks/useDebounce'
import EmptyState from '../components/EmptyState'
import DeleteConfirmModal from '../components/DeleteConfirmModal'

const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
    <div className="h-4 bg-gray-200 rounded-full w-2/3 mb-3" />
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-gray-100 rounded-full w-full" />
      <div className="h-3 bg-gray-100 rounded-full w-4/5" />
      <div className="h-3 bg-gray-100 rounded-full w-3/5" />
    </div>
    <div className="flex justify-between">
      <div className="h-2.5 bg-gray-100 rounded-full w-24" />
      <div className="h-2.5 bg-gray-100 rounded-full w-24" />
    </div>
  </div>
)

export const NotesListPage = () => {
  const navigate = useNavigate()
  const [notes, setNotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 350)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [page, setPage] = useState(1)
  const [paginationInfo, setPaginationInfo] = useState(null)

  const fetchNotes = useCallback(async (search, pageNum) => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await notesApi.getAll(search || undefined, pageNum)
      setNotes(res.data.data)
      setPaginationInfo(res.data.pagination)
    } catch (err) {
      setError(err.message || 'Failed to load notes')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchNotes(debouncedSearch || undefined, page) }, [debouncedSearch, page, fetchNotes])

  const handleSearchChange = (val) => {
    setSearchQuery(val)
    setPage(1)
  }

  const handleConfirmDelete = async () => {
  if (!pendingDeleteId) return
  try {
    setIsDeleting(true)
    await notesApi.delete(pendingDeleteId)
    setNotes((prev) => prev.filter((n) => n._id !== pendingDeleteId))
    setPendingDeleteId(null)
  } catch (err) {
    setError(err.message || 'Failed to delete note')
  } finally {
    setIsDeleting(false)
  }
}

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
          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={handleSearchChange} />
          </div>
          <button
            onClick={() => navigate('/notes/create')}
            className="flex cursor-pointer items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Note
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-4">
              {paginationInfo && paginationInfo.totalCount !== undefined
                ? `${paginationInfo.totalCount} result${paginationInfo.totalCount !== 1 ? 's' : ''}` + (debouncedSearch ? ` for "${debouncedSearch}"` : '')
                : debouncedSearch
                  ? `${notes.length} result${notes.length !== 1 ? 's' : ''} for "${debouncedSearch}"`
                  : `${notes.length} note${notes.length !== 1 ? 's' : ''}`}
            </p>
            {notes.length === 0 ? (
              <EmptyState isSearching={!!debouncedSearch} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notes.map((note) => (
                    <NoteCard key={note._id} note={note} onDeleteClick={setPendingDeleteId} />
                  ))}
                </div>
                {paginationInfo && paginationInfo.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-gray-200 mt-8 pt-4">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-500">
                      Page <span className="font-medium text-gray-900">{paginationInfo.currentPage}</span> of <span className="font-medium text-gray-900">{paginationInfo.totalPages}</span>
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(paginationInfo.totalPages, p + 1))}
                      disabled={!paginationInfo.hasNextPage}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
      <DeleteConfirmModal
        isOpen={!!pendingDeleteId}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
        isDeleting={isDeleting}
      />
    </div>
  )
}