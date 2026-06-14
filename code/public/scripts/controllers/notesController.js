import { getNotes, addNote, updateNotes } from "../services/notesService.js";
import { renderNotes } from "../views/notesView.js";
import { Note } from "../models/note.js";

/* State */

let notes = [];
let currentFilter = "all";
let currentSort = null;
let noteBeingEdited = null;

/* Public API */

export function initNotesController() {
  notes = getNotes();

  render();

  setupCreateNoteForm();
  setupFilterControls();
  setupSortControls();
}

/* Rendering */

function render() {
  let visibleNotes = notes;

  if (currentFilter === "open") {
    visibleNotes = notes.filter((note) => !note.completed);
  }

  if (currentFilter === "completed") {
    visibleNotes = notes.filter((note) => note.completed);
  }

  if (currentSort === "newest") {
    visibleNotes = [...visibleNotes].sort((a, b) => b.createdAt - a.createdAt);
  }

  if (currentSort === "oldest") {
    visibleNotes = [...visibleNotes].sort((a, b) => a.createdAt - b.createdAt);
  }

  renderNotes(visibleNotes, {
    onToggleCompleted: handleToggleCompleted,
    onEditNote: handleEditNote,
  });
}

/* Event Handlers */

function handleToggleCompleted(noteId) {
  const note = notes.find((n) => n.id === noteId);

  if (!note) {
    return;
  }

  note.completed = !note.completed;
  updateNotes(notes);
  render();
}

function handleEditNote(noteId) {
  const note = notes.find((n) => n.id === noteId);

  if (!note) {
    return;
  }

  noteBeingEdited = note;
  fillFormForEdit(note);
}

/* Form helpers */

function fillFormForEdit(note) {
  const titleInput = document.querySelector("#title");
  const contentInput = document.querySelector("#content");
  const importanceInput = document.querySelector("#importance");
  const dueDateInput = document.querySelector("#dueDate");

  const submitButton = document.querySelector(
    "#note-form button[type='submit']"
  );

  titleInput.value = note.title;
  contentInput.value = note.content;
  importanceInput.value = note.importance;
  dueDateInput.value = note.dueDate || "";

  submitButton.textContent = "Änderungen speichern";
}

function resetFormState() {
  const submitButton = document.querySelector(
    "#note-form button[type='submit']"
  );
  submitButton.textContent = "Notiz speichern";
}

function setupCreateNoteForm() {
  const form = document.querySelector("#note-form");

  if (!form) {
    return;
  }

  const titleInput = form.querySelector("#title");
  const contentInput = form.querySelector("#content");
  const importanceInput = form.querySelector("#importance");
  const dueDateInput = form.querySelector("#dueDate");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const importance = Number(importanceInput.value);
    const dueDate = dueDateInput.value || null;

    if (!title) {
      return;
    }

    if (noteBeingEdited) {
      // EDIT
      noteBeingEdited.title = title;
      noteBeingEdited.content = content;
      noteBeingEdited.importance = importance;
      noteBeingEdited.dueDate = dueDate;

      updateNotes(notes);
      noteBeingEdited = null;
    } else {
      // CREATE
      const newNote = new Note({
        id: Date.now(),
        title,
        content,
        importance,
        dueDate,
      });

      addNote(newNote);
      notes = getNotes();
    }

    form.reset();
    noteBeingEdited = null;
    resetFormState();
    render();
  });
}

/* Filter */

function setupFilterControls() {
  const filterButtons = document.querySelectorAll("[data-filter]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter;
      render();
    });
  });
}

/* Sorting */

function setupSortControls() {
  const sortButtons = document.querySelectorAll("[data-sort]");

  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentSort = button.dataset.sort;
      render();
    });
  });
}
