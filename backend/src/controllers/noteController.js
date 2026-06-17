const Note = require('../models/Note');
const { validationResult } = require('express-validator');

//  GET /api/notes?search=&page=&limit=
const getNotes = async (req, res, next) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search && search.trim()) {
      // Regex search works without a full text index and handles partial matches
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { content: regex }];
    }

    const notes = await Note.find(query)
      .sort({ isPinned: -1, updatedAt: -1 }) // pinned first, then by last update
      .select('title content tags isPinned createdAt updatedAt')
      .lean();

    res.json({ success: true, count: notes.length, data: notes });
  } catch (error) {
    next(error);
  }
};

//  GET /api/notes/:id
const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id).lean();

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

//  POST /api/notes
const createNote = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, content, tags = [], isPinned = false } = req.body;

    const note = await Note.create({ title, content, tags, isPinned });

    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};


//  PUT /api/notes/:id
const updateNote = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, content, tags, isPinned } = req.body;

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, tags, isPinned },
      { new: true, runValidators: true } // returns updated doc and re runs schema validators
    ).lean();

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};


//  DELETE /api/notes/:i
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotes, getNoteById, createNote, updateNote, deleteNote };