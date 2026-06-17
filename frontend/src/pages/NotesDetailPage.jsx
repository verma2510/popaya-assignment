import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { notesApi } from '../api/notesApi';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const formatFull = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await notesApi.getById(id);
        setNote(res.data.data);
      } catch (err) {
        setError(err.message || 'Failed to load note');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await notesApi.delete(id);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to delete note');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-1">
          <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-gray-600 font-medium">{error || 'Note not found'}</p>
        <button
          onClick={() => navigate('/')}
          className="text-indigo-600 text-sm font-medium hover:underline"
        >
          ← Back to notes
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">All Notes</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/notes/${id}/edit`)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6.768-6.768a2 2 0 012.828 2.828L11.828 13.828a4 4 0 01-1.414.94l-3 1 1-3a4 4 0 01.94-1.414z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <article className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          {note.isPinned && (
            <div className="flex items-center gap-1.5 mb-3">
              <svg className="h-3.5 w-3.5 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
              </svg>
              <span className="text-xs text-indigo-500 font-medium uppercase tracking-wide">Pinned</span>
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-3">
            {note.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 mb-4">
            <span>Created: {formatFull(note.createdAt)}</span>
            <span className="text-gray-200">•</span>
            <span>Updated: {formatFull(note.updatedAt)}</span>
          </div>

          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <hr className="border-gray-100 mb-6" />

          {note.content.trim() ? (
            <p className="text-gray-700 text-sm leading-7 whitespace-pre-wrap">{note.content}</p>
          ) : (
            <p className="text-gray-300 text-sm italic">This note has no content.</p>
          )}
        </article>
      </main>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isDeleting={isDeleting}
      />
    </div>
  );
};