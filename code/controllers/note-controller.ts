import { Request, Response } from "express";
import Datastore from "@seald-io/nedb";
import path from "path";
import { fileURLToPath } from "url";
import type { Note, CreateNoteDto, UpdateNoteDto } from "../types/note.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class NoteController {
  private db: Datastore<Note>;

  constructor() {
    this.db = new Datastore({
      filename: path.join(__dirname, "../data/notes.db"),
      autoload: true,
    });
  }

  getAllNotes = async (req: Request, res: Response): Promise<void> => {
    try {
      let filter: Partial<Record<keyof Note, unknown>> = {};
      const isCompleted =
        req.query.isCompleted === "true"
          ? true
          : req.query.isCompleted === "false"
            ? false
            : null;
      if (isCompleted !== null) {
        filter.completed = isCompleted;
      }

      let sortField = (req.query.sortBy as string) || "title";
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

      let notes: Note[] = await this.db.findAsync(filter);

      if (sortField === "dueDate") {
        notes = notes.sort((a, b) => {
          if (a.dueDate && b.dueDate) {
            return (
              sortOrder *
              (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            );
          }
          if (a.dueDate) return -1;
          if (b.dueDate) return 1;
          return 0;
        });
      } else if (sortField === "title") {
        notes = notes.sort(
          (a, b) =>
            sortOrder *
            a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
        );
      } else if (sortField === "createdAt") {
        notes = notes.sort((a, b) => {
          const aVal = Number(a.createdAt) || 0;
          const bVal = Number(b.createdAt) || 0;
          return sortOrder * (aVal - bVal);
        });
      } else if (sortField === "importance") {
        notes = notes.sort((a, b) => {
          const aVal = Number(a.importance) || 0;
          const bVal = Number(b.importance) || 0;
          return sortOrder * (aVal - bVal);
        });
      } else if (typeof notes[0]?.[sortField as keyof Note] === "number") {
        notes = notes.sort((a, b) => {
          const aVal = Number(a[sortField as keyof Note]) || 0;
          const bVal = Number(b[sortField as keyof Note]) || 0;
          return sortOrder * (aVal - bVal);
        });
      }

      res.json(notes);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res
        .status(500)
        .json({ message: "Error retrieving notes", error: errorMessage });
    }
  };

  getNoteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const noteId = req.params.id;
      const note = await this.db.findOneAsync({ _id: noteId } as Partial<Note>);
      if (note) {
        res.json(note);
      } else {
        res.status(404).json({ message: "Note not found" });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res
        .status(500)
        .json({ message: "Error retrieving note", error: errorMessage });
    }
  };

  addNote = async (req: Request, res: Response): Promise<void> => {
    try {
      const createDto: CreateNoteDto = req.body as CreateNoteDto;
      const insertedNote = await this.db.insertAsync(createDto);
      res.status(201).json(insertedNote);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res
        .status(500)
        .json({ message: "Error creating note", error: errorMessage });
    }
  };

  updateNote = async (req: Request, res: Response): Promise<void> => {
    try {
      const noteId = req.params.id;
      const fields: UpdateNoteDto = req.body as UpdateNoteDto;

      const { numAffected } = await this.db.updateAsync(
        { _id: noteId } as Partial<Note>,
        { $set: fields }
      );

      if (numAffected === 0) {
        res.status(404).json({ message: "Note not found" });
        return;
      }

      const note = await this.db.findOneAsync({ _id: noteId } as Partial<Note>);
      res.json(note);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res
        .status(500)
        .json({ message: "Error updating note", error: errorMessage });
    }
  };
}

const noteController = new NoteController();
export { noteController };
