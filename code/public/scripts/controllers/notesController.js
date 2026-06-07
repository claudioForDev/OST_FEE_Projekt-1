import { getNotes } from "../services/notesService.js";
import { renderNotes } from "../views/notesView.js";

let notes = [];

export function initNotesController() {
  notes = getNotes();

  renderNotes(notes);

  setupFilterControls();
  setupSortControls();
}

/* Filter */

function setupFilterControls() {
  const filterButtons = document.querySelectorAll("[data-filter]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      let filteredNotes = notes;

      if (filter === "open") {
        filteredNotes = notes.filter((note) => !note.completed);
      }

      if (filter === "completed") {
        filteredNotes = notes.filter((note) => note.completed);
      }

      renderNotes(filteredNotes);
    });
  });
}

/* Sorting */

function setupSortControls() {
  const sortButtons = document.querySelectorAll("[data-sort]");

  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const sortType = button.dataset.sort;

      let sortedNotes = [...notes];

      if (sortType === "newest") {
        sortedNotes.sort((a, b) => b.createdAt - a.createdAt);
      }

      if (sortType === "oldest") {
        sortedNotes.sort((a, b) => a.createdAt - b.createdAt);
      }

      renderNotes(sortedNotes);
    });
  });
}
