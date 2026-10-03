'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, AlertCircle, StickyNote, Sparkles } from 'lucide-react';

// ==========================================
// BONUS 2: Separate Component for Note Item
// ==========================================
function NoteItem({ note, onDelete, onStartEdit, isEditing, editTitle, setEditTitle, editDescription, setEditDescription, onSaveEdit, onCancelEdit }) {
  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-indigo-500 p-5 transition-all duration-200">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 text-gray-800 font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Edit Title..."
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
            placeholder="Edit Description..."
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onCancelEdit}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <X size={16} /> Cancel
            </button>
            <button
              onClick={() => onSaveEdit(note.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Check size={16} /> Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 p-5 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-xl text-gray-800 break-words flex-1 pr-2">
            {note.title}
          </h3>
          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onStartEdit(note)}
              className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit Note"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Note"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <p className="text-gray-600 whitespace-pre-wrap leading-relaxed text-sm break-words">
          {note.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
        <span>{note.createdAt || 'Just now'}</span>
      </div>
    </div>
  );
}

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function NoteApp() {
  // State 1: Store list of notes
  const [notes, setNotes] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nextjs_notes');
      return saved ? JSON.parse(saved) : [
        { id: '1', title: 'Welcome Note', description: 'This is a sample note in your Next.js application.', createdAt: new Date().toLocaleDateString() }
      ];
    }
    return [];
  });

  // State 2: Input fields for new note
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // State 3: Editing state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // State 4: Bonus 1 - Check if title exists
  const [isDuplicate, setIsDuplicate] = useState(false);

  // Save notes to localStorage on update
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nextjs_notes', JSON.stringify(notes));
    }
  }, [notes]);

  // ==========================================
  // BONUS 1: useEffect checking if note exists
  // ==========================================
  useEffect(() => {
    if (!title.trim()) {
      setIsDuplicate(false);
      return;
    }
    const exists = notes.some(
      (note) => note.title.trim().toLowerCase() === title.trim().toLowerCase()
    );
    setIsDuplicate(exists);
  }, [title, notes]);

  // 1. ADD NOTE FUNCTION
  const handleAddNote = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('Please fill in both the title and description.');
      return;
    }

    if (isDuplicate) {
      alert('A note with this title already exists!');
      return;
    }

    const newNote = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setNotes([newNote, ...notes]);
    setTitle('');
    setDescription('');
  };

  // 3. DELETE NOTE FUNCTION
  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  // START EDITING
  const handleStartEdit = (note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditDescription(note.description);
  };

  // 4. UPDATE NOTE FUNCTION
  const handleSaveEdit = (id) => {
    if (!editTitle.trim() || !editDescription.trim()) {
      alert('Title and description cannot be empty.');
      return;
    }

    setNotes(
      notes.map((note) =>
        note.id === id
          ? { ...note, title: editTitle.trim(), description: editDescription.trim() }
          : note
      )
    );
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
            <Sparkles size={16} /> Next.js Note Application
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            My Notes
          </h1>
          <p className="text-gray-500">Manage your daily tasks and ideas with ease.</p>
        </div>

        {/* Add Note Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleAddNote} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Note Title</label>
              <input
                type="text"
                placeholder="Enter title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border text-gray-800 ${
                  isDuplicate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                } focus:outline-none focus:ring-2`}
              />
              {/* Bonus 1 Duplicate Indicator */}
              {isDuplicate && (
                <div className="flex items-center gap-1.5 text-red-600 text-xs font-medium pt-1">
                  <AlertCircle size={14} />
                  <span>Duplicate Title Detected! A note with this title already exists.</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                placeholder="Enter description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isDuplicate}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium transition-all ${
                isDuplicate
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-indigo-200'
              }`}
            >
              <Plus size={18} /> Add Note
            </button>
          </form>
        </div>

        {/* Notes Grid (2. View all Notes) */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <StickyNote className="text-indigo-600" />
            All Notes ({notes.length})
          </h2>

          {notes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-400">No notes found. Create your first note above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  onDelete={handleDeleteNote}
                  onStartEdit={handleStartEdit}
                  isEditing={editingId === note.id}
                  editTitle={editTitle}
                  setEditTitle={setEditTitle}
                  editDescription={editDescription}
                  setEditDescription={setEditDescription}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}