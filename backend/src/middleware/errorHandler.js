// eslint disable next line (no unused vars) error-handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err.message);

  // Mongoose: invalid ObjectId (e.g. /api/notes/fakeID)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ success: false, message: 'Invalid note ID format' });
  }

  // Mongoose: schema level validation failure
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join('. ') });
  }

  // Mongoose: duplicate key (unique index violation)
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Duplicate entry detected' });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;