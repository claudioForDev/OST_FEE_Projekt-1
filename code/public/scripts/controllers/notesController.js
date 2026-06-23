import { getNotes, addNote, updateNotes } from "../services/notesService.js";
import { renderNotes } from "../views/notesView.js";
import { Note } from "../models/note.js";

/* State */

let notes = [];
let currentFilter = "all";
let currentSort = "dueDate";
let noteBeingEdited = null;
let sortDirection = "asc"; // Default: earliest due date first

/* Public API */

export async function initNotesController() {
  setupInitialTheme();

  notes = await getNotes();

  setupCreateNoteForm();
  setupFilterControls();
  setupSortControls();
  updateSortButtonsUI();
  setupThemeToggle();

  await render();
}

/* Rendering */

async function render() {
  const visibleNotes = await getNotes(
    currentFilter === "completed" ? true : currentFilter === "open" ? false : undefined,
    currentSort,
    sortDirection
  );

  // if (currentFilter === "open") {
  //   visibleNotes = notes.filter((note) => !note.completed);
  // }

  // if (currentFilter === "completed") {
  //   visibleNotes = notes.filter((note) => note.completed);
  // }

  // if (currentSort === "name") {
  //   visibleNotes = [...visibleNotes].sort((a, b) =>
  //     sortDirection === "desc"
  //       ? a.title.localeCompare(b.title)
  //       : b.title.localeCompare(a.title)
  //   );
  // }

  // if (currentSort === "dueDate") {
  //   visibleNotes = [...visibleNotes].sort((a, b) => {
  //     if (!a.dueDate) return 1;
  //     if (!b.dueDate) return -1;

  //     return sortDirection === "desc"
  //       ? new Date(a.dueDate) - new Date(b.dueDate)
  //       : new Date(b.dueDate) - new Date(a.dueDate);
  //   });
  // }

  // if (currentSort === "createdAt") {
  //   visibleNotes = [...visibleNotes].sort((a, b) =>
  //     sortDirection === "desc"
  //       ? a.createdAt - b.createdAt
  //       : b.createdAt - a.createdAt
  //   );
  // }

  // if (currentSort === "importance") {
  //   visibleNotes = [...visibleNotes].sort((a, b) =>
  //     sortDirection === "desc"
  //       ? a.importance - b.importance
  //       : b.importance - a.importance
  //   );
  // }

  renderNotes(visibleNotes, {
    onToggleCompleted: handleToggleCompleted,
    onEditNote: handleEditNote,
  });
}

/* Event Handlers */

async function handleToggleCompleted(noteId) {
  const note = notes.find((n) => n._id === noteId);

  if (!note) {
    return;
  }

  note.completed = !note.completed;
  await updateNotes(note);
  await render();
}

function handleEditNote(noteId) {
  const note = notes.find((n) => n._id === noteId);

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

async function setupCreateNoteForm() {
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

  form.addEventListener("submit", async (event) => {
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

      await updateNotes(noteBeingEdited);
      noteBeingEdited = null;
    } else {
      // CREATE
      const newNote = new Note({
        // id: Date.now(),
        title,
        content,
        importance,
        dueDate,
      });

      await addNote(newNote);
      const filterCompleted = currentFilter === "completed" ? true : currentFilter === "open" ? false : undefined;
      notes = await getNotes(filterCompleted, currentSort, sortDirection);
    }

    form.reset();
    noteBeingEdited = null;
    resetFormState();
    await render();
    showListView();
  });
}

/* Filter */

function setupFilterControls() {
  const filterButtons = document.querySelectorAll("[data-filter]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      // const newFilter = button.dataset.filter;
      currentFilter = button.dataset.filter;
      await render();
    });
  });
}

/* Sorting */

function setupSortControls() {
  const sortButtons = document.querySelectorAll("[data-sort]");

  sortButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const newSort = button.dataset.sort;

      if (currentSort === newSort) {
        sortDirection = sortDirection === "desc" ? "asc" : "desc";
      } else {
        currentSort = newSort;
        sortDirection = "desc";
      }

      updateSortButtonsUI();
      await render();
    });
  });
}

/* Sorting UI */

function updateSortButtonsUI() {
  const sortButtons = document.querySelectorAll("[data-sort]");

  sortButtons.forEach((button) => {
    const sortType = button.dataset.sort;

    let baseText = "";

    if (sortType === "title") baseText = "Titel";
    if (sortType === "dueDate") baseText = "Fälligkeitsdatum";
    if (sortType === "createdAt") baseText = "Erstellungsdatum";
    if (sortType === "importance") baseText = "Wichtigkeit";

    if (currentSort === sortType) {
      // Arrow direction: ↑ for newest first, ↓ for oldest first
      const arrow = sortDirection === "desc" ? " ↑" : " ↓";
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

function setupInitialTheme() {
  const savedTheme = localStorage.getItem("theme");

  const root = document.documentElement;
  const button = document.querySelector("#theme-toggle");

  if (savedTheme === "dark") {
    root.setAttribute("data-theme", "dark");
  }

  if (button) {
    button.textContent = savedTheme === "dark" ? "Light Mode" : "Dark Mode";
  }
}

function setupThemeToggle() {
  const button = document.querySelector("#theme-toggle");

  if (!button) return;

  const root = document.documentElement;

  button.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";

    if (isDark) {
      root.removeAttribute("data-theme");
      button.textContent = "Dark Mode";
      localStorage.setItem("theme", "light");
    } else {
      root.setAttribute("data-theme", "dark");
      button.textContent = "Light Mode";
      localStorage.setItem("theme", "dark");
    }
  });
}
