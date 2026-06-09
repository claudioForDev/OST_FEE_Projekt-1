import { Note } from "../models/note.js";

const STORAGE_KEY = "notes";

/* Load notes from localStorage */

function loadNotes() {
  const storedNotes = localStorage.getItem(STORAGE_KEY);

  if (!storedNotes) {
    return [];
  }

  const parsedNotes = JSON.parse(storedNotes);

  return parsedNotes.map((noteData) => new Note(noteData));
}

/* Save notes to localStorage */

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

/* In-memory state */

let notes = loadNotes();

/* Public API */

export function getNotes() {
  return notes;
}

export function addNote(note) {
  notes.push(note);
  saveNotes(notes);
}

export function updateNotes(updatedNotes) {
  notes = updatedNotes;
  saveNotes(notes);
}
