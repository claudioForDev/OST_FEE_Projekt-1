import { getNotes } from "../services/notesService.js";
import { renderNotes } from "../views/notesView.js";

/* State */

let notes = [];
let currentFilter = "all";
let currentSort = null;

/* Public API */

export function initNotesController() {
  notes = getNotes();

  render();

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
  });
}

/* Event Handlers */

function handleToggleCompleted(noteId) {
  const note = notes.find((n) => n.id === noteId);

  if (!note) {
    return;
  }

  note.completed = !note.completed;
  render();
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
