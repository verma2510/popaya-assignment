import React, { useState } from 'react';

const DEFAULT_FORM = {
  title: '',
  content: '',
  tags: [],
  isPinned: false,
};

const NoteForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = 'Save Note',
}) => {
  const [form, setForm] = useState(initialData ?? DEFAULT_FORM);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    else if (form.title.length > 200) newErrors.title = 'Title cannot exceed 200 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit(form);
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (tag && !form.tags.includes(tag) && form.tags.length < 10) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }));
    }
    setTagInput('');
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag) =>
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));

  return (
    <div className="space-y-5">
      {/* Pin toggle */}
      <div className="flex items-center justify-between py-1">
        <span className="text-sm text-gray-600 font-medium">Pin this note</span>
        <button
          type="button"
          role="switch"
          aria-checked={form.isPinned}
          onClick={() => setForm((f) => ({ ...f, isPinned: !f.isPinned }))}
          className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
            form.isPinned ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              form.isPinned ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="note-title" className="block text-sm font-medium text-gray-700 mb-1.5">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="note-title"
          type="text"
          value={form.title}
          onChange={(e) => {
            setForm((f) => ({ ...f, title: e.target.value }));
            if (errors.title) setErrors((err) => ({ ...err, title: undefined }));
          }}
          placeholder="Give your note a title…"
          autoFocus
          className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
            errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
          }`}
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>

      {/* Content */}
      <div>
        <label htmlFor="note-content" className="block text-sm font-medium text-gray-700 mb-1.5">
          Content
        </label>
        <textarea
          id="note-content"
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          placeholder="Start writing…"
          rows={12}
          className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y min-h-[200px] leading-relaxed"
        />
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="note-tags" className="block text-sm font-medium text-gray-700 mb-1.5">
          Tags <span className="text-gray-400 font-normal">(optional · max 10)</span>
        </label>
        <div className="flex gap-2">
          <input
            id="note-tags"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Type and press Enter to add…"
            disabled={form.tags.length >= 10}
            className="flex-1 px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={addTag}
            disabled={!tagInput.trim() || form.tags.length >= 10}
            className="px-3 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>

        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                  className="hover:text-indigo-900 ml-0.5 transition-colors"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving…
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </div>
  );
};

export default NoteForm;