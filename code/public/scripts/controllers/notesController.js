import { getNotes, addNote, updateNotes } from "../services/notesService.js";
import { renderNotes } from "../views/notesView.js";
import { Note } from "../models/note.js";

/* State */

let notes = [];
let currentFilter = "all";
let currentSort = "dueDate";
let noteBeingEdited = null;
let sortDirection = "desc";

/* Public API */

export function initNotesController() {
  notes = getNotes();

  setupCreateNoteForm();
  setupFilterControls();
  setupSortControls();
  updateSortButtonsUI();
  setupThemeToggle();

  render();
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

  if (currentSort === "name") {
    visibleNotes = [...visibleNotes].sort((a, b) =>
      sortDirection === "desc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );
  }

  if (currentSort === "dueDate") {
    visibleNotes = [...visibleNotes].sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return sortDirection === "desc"
        ? new Date(a.dueDate) - new Date(b.dueDate)
        : new Date(b.dueDate) - new Date(a.dueDate);
    });
  }

  if (currentSort === "createdAt") {
    visibleNotes = [...visibleNotes].sort((a, b) =>
      sortDirection === "desc"
        ? a.createdAt - b.createdAt
        : b.createdAt - a.createdAt
    );
  }

  if (currentSort === "importance") {
    visibleNotes = [...visibleNotes].sort((a, b) =>
      sortDirection === "desc"
        ? a.importance - b.importance
        : b.importance - a.importance
    );
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
  showFormView();
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
  const cancelButton = document.querySelector("#cancel-button");
  const newNoteButton = document.querySelector("#new-note-button");

  cancelButton.addEventListener("click", () => {
    noteBeingEdited = null;
    form.reset();
    resetFormState();
    showListView();
  });

  newNoteButton.addEventListener("click", () => {
    noteBeingEdited = null;
    form.reset();
    resetFormState();
    showFormView();
  });

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
    showListView();
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
      const newSort = button.dataset.sort;

      if (currentSort === newSort) {
        sortDirection = sortDirection === "desc" ? "asc" : "desc";
      } else {
        currentSort = newSort;
        sortDirection = "desc";
      }

      updateSortButtonsUI();
      render();
    });
  });
}

/* Sorting UI */

function updateSortButtonsUI() {
  const sortButtons = document.querySelectorAll("[data-sort]");

  sortButtons.forEach((button) => {
    const sortType = button.dataset.sort;

    let baseText = "";

    if (sortType === "name") baseText = "Name";
    if (sortType === "dueDate") baseText = "Fälligkeitsdatum";
    if (sortType === "createdAt") baseText = "Erstellungsdatum";
    if (sortType === "importance") baseText = "Wichtigkeit";

    if (currentSort === sortType) {
      const arrow = sortDirection === "asc" ? " ↑" : " ↓";
      button.textContent = baseText + arrow;
    } else {
      button.textContent = baseText;
    }
  });
}

/* View Switching */

function showListView() {
  document.querySelector("#note-form-section").style.display = "none";
  document.querySelector("#notes-section").style.display = "block";
}

function showFormView() {
  document.querySelector("#note-form-section").style.display = "block";
  document.querySelector("#notes-section").style.display = "none";
}

/* Theme */

function setupThemeToggle() {
  const button = document.querySelector("#theme-toggle");

  if (!button) return;

  button.addEventListener("click", () => {
    const root = document.documentElement;
    const isDark = root.getAttribute("data-theme") === "dark";

    if (isDark) {
      root.removeAttribute("data-theme");
      button.textContent = "Dark Mode";
    } else {
      root.setAttribute("data-theme", "dark");
      button.textContent = "Light Mode";
    }
  });
}
