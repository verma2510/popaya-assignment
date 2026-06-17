# Notes Management System

A full-stack notes app — create, edit, delete, view, and search notes.

**Stack:** React · JavaScript · Vite · Tailwind CSS · Node.js · Express · MongoDB

---

## Folder Structure

```
notes-management/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   └── noteController.js # All CRUD handlers
│   │   ├── models/
│   │   │   └── Note.js           # Mongoose schema
│   │   ├── routes/
│   │   │   └── noteRoutes.js     # Express routes + validation
│   │   └── middleware/
│   │       └── errorHandler.js   # Global error handler
│   ├── app.js                    # Express app setup
│   ├── server.js                 # Entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── notesApi.js       # Axios calls to backend
    │   ├── components/
    │   │   ├── NoteCard.jsx      # Note grid card
    │   │   ├── NoteForm.jsx      # Shared create/edit form
    │   │   ├── SearchBar.jsx     # Search input
    │   │   ├── DeleteConfirmModal.jsx
    │   │   └── EmptyState.jsx
    │   ├── hooks/
    │   │   └── useDebounce.js    # Debounce search input
    │   ├── pages/
    │   │   ├── NotesListPage.jsx  # / — all notes
    │   │   ├── NotesDetailPage.jsx # /notes/:id
    │   │   └── NotesFormPage.jsx   # /notes/create + /notes/:id/edit
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## Prerequisites

- Node.js
- MongoDB (local or Atlas)

---

## Setup & Run

### 1. Backend

```bash
cd backend
npm install

# Create .env from example
cp .env.example .env
# Edit MONGO_URI if needed (default: mongodb://localhost:27017/notes_db)

npm run dev       # dev with nodemon
```

Backend runs on → `http://localhost:5000`

---

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on → `http://localhost:5173`

> Vite proxies `/api` to `http://localhost:5000` during dev — no CORS config needed.

---

## API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint          | Description                          |
|--------|-------------------|--------------------------------------|
| GET    | `/notes`          | Get all notes (optional `?search=`)  |
| GET    | `/notes/:id`      | Get single note                      |
| POST   | `/notes`          | Create a note                        |
| PUT    | `/notes/:id`      | Update a note                        |
| DELETE | `/notes/:id`      | Delete a note                        |
| GET    | `/health`         | Health check                         |

### Example payloads

**POST /api/notes**
```json
{
  "title": "My first note",
  "content": "Some content here",
  "tags": ["work", "ideas"],
  "isPinned": false
}
```

**GET /api/notes?search=meeting**
Returns all notes where title or content matches "meeting" (case-insensitive).

---

## Features

### Core
- ✅ Create / Edit / Delete / View notes
- ✅ List all notes sorted by last updated
- ✅ Live search by title and content (debounced)
- ✅ Form validation with inline error messages
- ✅ Delete confirmation modal
- ✅ Loading skeletons and empty states
- ✅ Responsive grid layout (1 → 2 → 3 columns)

### Bonus
- ✅ Tags with add/remove UI
- ✅ Pin notes (pinned notes appear at the top)
- ✅ Hover-reveal card actions (edit/delete)

---

## Note Schema

```
{
  _id:       ObjectId (auto)
  title:     String (required, max 200 chars)
  content:   String (default "")
  tags:      [String] (max 10 tags)
  isPinned:  Boolean (default false)
  createdAt: Date (auto)
  updatedAt: Date (auto-updated on save)
}
```