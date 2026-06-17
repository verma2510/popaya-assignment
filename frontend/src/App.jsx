import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { NotesListPage } from './pages/NotesListPage'
import { NoteFormPage } from './pages/NotesFormPage'
import { NoteDetailPage } from './pages/NotesDetailPage'

function App() {

  return (
  <BrowserRouter>
    <Routes>
      {/* Notes list */}
      <Route path="/" element={<NotesListPage />} />
 
      {/* Create new note — must come before /:id to avoid conflict */}
      <Route path="/notes/create" element={<NoteFormPage />} />
 
      {/* View single note */}
      <Route path="/notes/:id" element={<NoteDetailPage />} />
 
      {/* Edit note */}
      <Route path="/notes/:id/edit" element={<NoteFormPage />} />
 
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
