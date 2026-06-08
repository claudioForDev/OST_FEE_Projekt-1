import { Note } from "../models/note.js";

const notes = [
  new Note({
    id: 1,
    title: "Einkaufsliste",
    content: "Milch, Brot, Kaffee",
  }),
  new Note({
    id: 2,
    title: "Termin",
    content: "Arzttermin um 14:00 Uhr",
    completed: true,
  }),
];

export function getNotes() {
  return notes;
}

export function addNote(note) {
  notes.push(note);
}
