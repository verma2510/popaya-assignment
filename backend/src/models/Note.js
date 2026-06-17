const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
    
    // Bonus features
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: 'Maximum 10 tags allowed',
      },
    },

    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // auto manages createdAt and updatedAt
  }
);

// Compound text index for full text search on title + content
noteSchema.index({ title: 'text', content: 'text' });

// Fallback regex search index
noteSchema.index({ title: 1 });
noteSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Note', noteSchema);