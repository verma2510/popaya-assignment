const express = require("express");
const app = express();
app.use(express.json());

const users = [
  { id: 1, name: "Amit", email: "amit@test.com" },
  { id: 2, name: "Riya", email: "riya@test.com" },
];

const notes = [
  { id: 1, title: "Note 1", content: "Content 1", userId: 1 },
  { id: 2, title: "Note 2", content: "Content 2", userId: 2 },
];


// BUG 1 FIXED — GET /users
// Was: res.send(userList) -> userList is never defined, causes ReferenceError
// Fix: res.send(users)
app.get("/users", (req, res) => {
  res.send(users);
});


// BUG 2 FIXED — GET /users/:id
// Was: req.params.id is a STRING, user.id is a NUMBER
//      "1" === 1 is false -> find() always returns undefined
// Fix: parse id with Number() before comparison
//      Also added 404 if user not found
app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).send({ message: "User not found" });
  res.send(user);
});


// BUG 3 FIXED — getUserById()
// Was: function body never returns anything -> always returns undefined
// Fix: added return statement
function getUserById(id) {
  const user = users.find((u) => u.id === id);
  return user;
}


// BUG 4 FIXED — GET /notes/count
// Was: notes.lenght -> typo, not a property -> returns undefined
// Fix: notes.length
app.get("/notes/count", (req, res) => {
  const total = notes.length;
  res.send({ total });
});


// BUG 5 FIXED — GET /external-data
// Was 1: fetchExternalData is never defined -> ReferenceError at runtime
// Was 2: missing await -> sends a Promise object instead of resolved data
// Fix: defined the function and added await
async function fetchExternalData() {
  return { data: "sample payload" };
}

app.get("/external-data", async (req, res) => {
  const data = await fetchExternalData();
  res.send(data);
});


// BUG 6 FIXED — GET /notes
// Was: if (notes = []) -> assignment operator, not comparison
//      This wipes the entire notes array and condition always evaluates as falsy
// Fix: if (notes.length === 0)
app.get("/notes", (req, res) => {
  if (notes.length === 0) {
    console.log("No notes found");
  }
  res.send(notes);
});


// BUG 7 FIXED — generateNoteId()
// Was: Math.random() * 1000 -> returns a float like 847.3621
// Fix: Math.floor(Math.random() * 1000) -> returns a whole number
function generateNoteId() {
  return Math.floor(Math.random() * 1000);
}


// BUG 8 FIXED — const newId = generateNoteId
// Was: missing () -> assigns the function reference, not its return value
//      All notes get id = [Function: generateNoteId]
//      Also declared outside the handler -> same id for every note ever created
// Fix: call generateNoteId() inside the POST handler per request



// BUG 9 FIXED — POST /notes
// Was 1: !title && !content -> only rejects if BOTH are missing
//        Allows notes with title but no content, or content but no title
// Was 2: res.send("Invalid input") -> no 400 status code
// Fix: || operator, status(400)
app.post("/notes", (req, res) => {
  const { title, content, userId } = req.body;
  if (!title || !content) {
    return res.status(400).send({ message: "Invalid input: title and content are required" });
  }
  const newNote = {
    id: generateNoteId(),  // Bug 8 fix: called inside handler, not outside
    title,
    content,
    userId,
  };
  notes.push(newNote);
  res.send(newNote);
});


// BUG 10 FIXED — DELETE /notes/:id
// Was 1: req.params.id is string, n.id is number -> findIndex always returns -1
//        notes.splice(-1, 1) silently deletes the LAST note instead
// Was 2: no check if noteIndex is -1 -> always deletes something even for invalid id
// Fix: Number() conversion, added -1 check with 404
app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const noteIndex = notes.findIndex((n) => n.id === id);
  if (noteIndex === -1) return res.status(404).send({ message: "Note not found" });
  notes.splice(noteIndex, 1);
  res.send({ message: "Note deleted" });
});


// BUG 11 FIXED — PUT /users/:id
// Was 1: user.name = username -> 'username' is never defined -> ReferenceError
// Was 2: no null check if user not found -> crash on user.name assignment
// Fix: use 'name' from destructured req.body, added 404 guard
app.put("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).send({ message: "User not found" });
  user.name = name;
  res.send(user);
});


// BUG 12 FIXED — GET /user-notes/:userId
// Was 1: n.userId = userId -> assignment inside filter, not comparison
//        Sets every note's userId to the param value and returns all notes
// Was 2: req.params.userId is string, n.userId is number -> type mismatch
// Fix: === with Number() conversion
app.get("/user-notes/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  const userNotes = notes.filter((n) => n.userId === userId);
  res.send(userNotes);
});


// BUG 13 FIXED — POST /login
// Was: email === "admin@test.com" || password === "123456"
//      OR means login succeeds if EITHER matches, not both
//      Anyone who knows just the email can log in without a password
// Fix: && so both email AND password must match
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@test.com" && password === "123456") {
    res.send({ message: "Login successful" });
  } else {
    res.send({ message: "Invalid credentials" });
  }
});


// BUG 14 FIXED — GET /profile/:id
// Was: users.filter() -> returns an ARRAY, not a single user object
//      res.send(user.name) -> accessing .name on an array -> undefined
// Fix: users.find() to get a single object, added 404 guard
app.get("/profile/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).send({ message: "User not found" });
  res.send({ name: user.name });
});


// BUG 15 FIXED — POST /sum
// Was: const total = a + b
//      If a and b arrive as JSON strings ("5" + "3" = "53" not 8)
// Fix: explicitly convert to Number before adding
app.post("/sum", (req, res) => {
  const a = Number(req.body.a);
  const b = Number(req.body.b);
  const total = a + b;
  res.send({ total });
});


// BUG 16 FIXED — app.listen
// Was: listening on port 3000 but logging "port 5000" -> misleading
// Fix: log matches the actual port
app.listen(3000, () => {
  console.log("Server running on port 3000");
});