import React from 'react'
import { useNavigate } from 'react-router-dom'

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const getPreview = (content, max = 130) => {
  if (!content?.trim()) return null
  return content.length > max ? content.slice(0, max) + '…' : content
}

const NoteCard = ({ note, onDeleteClick }) => {
  const navigate = useNavigate()
  const preview = getPreview(note.content)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/notes/${note._id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/notes/${note._id}`)}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {note.isPinned && (
            <svg className="h-3.5 w-3.5 text-indigo-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
            </svg>
          )}
          <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate">{note.title}</h3>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/notes/${note._id}/edit`) }}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6.768-6.768a2 2 0 012.828 2.828L11.828 13.828a4 4 0 01-1.414.94l-3 1 1-3a4 4 0 01.94-1.414z" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); console.log('delete', note._id) }}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {preview
        ? <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-3">{preview}</p>
        : <p className="text-xs text-gray-300 italic mb-3">No content</p>
      }

      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium">{tag}</span>
          ))}
          {note.tags.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">+{note.tags.length - 3}</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
        <span>Created {formatDate(note.createdAt)}</span>
        <span>Updated {formatDate(note.updatedAt)}</span>
      </div>
    </div>
  )
}

export default NoteCard