import { Note } from "../models/note.js";

const notes = [
  new Note({
    id: 1,
    title: "Einkaufsliste aus notesService.js",
    content: "Milch, Brot, Kaffee",
    completed: false,
  }),
  new Note({
    id: 2,
    title: "Termin aus notesService.js",
    content: "Arzttermin um 14:00 Uhr",
    completed: true,
  }),
];

export function getNotes() {
  return notes;
}
