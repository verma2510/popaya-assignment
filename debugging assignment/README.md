# Bug Fix — resolved.js

This file documents the 16 bugs identified and resolved in the original Express.js server code.

---

## Bugs Resolved

| # | Location | Issue | Fix Applied |
|---|---|---|---|
| 1 | `GET /users` | `userList` was undefined | Changed to `users` |
| 2 | `GET /users/:id` | `params.id` (string) never matched numeric `u.id` | Wrapped with `Number()`, added 404 |
| 3 | `getUserById()` | Missing `return` statement | Added `return user` |
| 4 | `GET /notes/count` | `notes.lenght` typo | Fixed to `notes.length` |
| 5 | `GET /external-data` | `fetchExternalData` never defined, `await` missing | Defined function, added `await` |
| 6 | `GET /notes` | `if (notes = [])` assignment wiped the notes array | Changed to `notes.length === 0` |
| 7 | `generateNoteId()` | Returned a float instead of integer | Wrapped with `Math.floor()` |
| 8 | `const newId` | Function reference assigned instead of called | Moved `generateNoteId()` call inside handler |
| 9 | `POST /notes` | `&&` only rejected when both fields missing, no status codes | Changed to `\|\|`, added `400` and `201` |
| 10 | `DELETE /notes/:id` | Type mismatch caused `splice(-1,1)` to delete last note silently | Added `Number()`, added `-1` guard with 404 |
| 11 | `PUT /users/:id` | `username` undefined, no null check on user | Used `name` from `req.body`, added 404 guard |
| 12 | `GET /user-notes/:userId` | `=` in filter mutated all notes instead of filtering | Changed to `===` with `Number()` |
| 13 | `POST /login` | `\|\|` allowed login with only email or only password | Changed to `&&` |
| 14 | `GET /profile/:id` | `filter` returned array, `.name` on array was `undefined` | Changed to `find`, added 404 guard |
| 15 | `POST /sum` | `"5" + "3"` produced `"53"` instead of `8` | Wrapped inputs with `Number()` |
| 16 | `app.listen` | Logged `"port 5000"` while listening on `3000` | Fixed log to match actual port |

---

## How to Run

```bash
npm install express
node index.js
```

Server runs at `http://localhost:3000`