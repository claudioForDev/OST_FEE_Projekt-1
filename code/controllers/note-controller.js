import Datastore from "@seald-io/nedb";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class NoteController {
  constructor() {
    // Initialize NeDB database with file persistence
    this.db = new Datastore({
      filename: path.join(__dirname, "../data/notes.db"),
      autoload: true,
    });
  }

  // seed = async () => {
  //   const notes = [
  //     { title: "AAA", content: "BBB", isCompleted: false },
  //     { title: "BBB", content: "DDD", isCompleted: true },
  //     { title: "CCC", content: "AAA", isCompleted: undefined },
  //     { title: "DDD", content: "CCC", isCompleted: null },
  //   ];

  //   for (const note of notes) {
  //     await this.db.insertAsync(note);
  //   }
  // };

  // TODO: Add Filter and Sorting.
  getAllNotes = async (req, res) => {
    try {
      // Filter by request parameters if provided
      let filter = {};
      const isCompleted = req.query.isCompleted === "true"
          ? true
          : req.query.isCompleted === "false"
            ? false
            : null;
      if (isCompleted !== null) {
        filter = { completed: isCompleted };
      }

      // Sort by request query parameters if provided, otherwise default to sorting by title
      let sortField = req.query.sortBy || "title";
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

      let notes = await this.db.findAsync(filter);

      // DueDate: null-safe sorting (null values always at the end)
      if (sortField === "dueDate") {
        notes = notes.sort((a, b) => {
          // Both have dueDate
          if (a.dueDate && b.dueDate) {
            return sortOrder * (new Date(a.dueDate) - new Date(b.dueDate));
          }
          // Only a has dueDate -> a comes first (before nulls)
          if (a.dueDate) return -1;
          // Only b has dueDate -> b comes first (before nulls)
          if (b.dueDate) return 1;
          // Both are null -> equal
          return 0;
        });
      }
      // Title: case-insensitive sorting
      else if (sortField === "title") {
        notes = notes.sort((a, b) => 
          sortOrder * a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
        );
      }
      // createdAt: numeric timestamp sorting
      else if (sortField === "createdAt") {
        notes = notes.sort((a, b) => {
          const aVal = Number(a.createdAt) || 0;
          const bVal = Number(b.createdAt) || 0;
          return sortOrder * (aVal - bVal);
        });
      }
      // importance: numeric sorting
      else if (sortField === "importance") {
        notes = notes.sort((a, b) => {
          const aVal = Number(a.importance) || 0;
          const bVal = Number(b.importance) || 0;
          return sortOrder * (aVal - bVal);
        });
      }
      // Other fields: standard NeDB sorting
      else {
        notes = notes.sort({ [sortField]: sortOrder });
      }

      res.json(notes);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving notes", error: error.message });
    }
  };

  getNoteById = async (req, res) => {
    try {
      const noteId = req.params.id;
      const note = await this.db.findOneAsync({ _id: noteId });
      if (note) {
        res.json(note);
      } else {
        res.status(404).json({ message: "Note not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving note", error: error.message });
    }
  };

  addNote = async (req, res) => {
    try {
      req.body._id = undefined; // Ensure that the ID is not set by the client
      const insertedNote = await this.db.insertAsync(req.body);
      res.status(201).json(insertedNote);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating note", error: error.message });
    }
  };

  updateNote = async (req, res) => {
    try {
      const noteId = req.params.id;
      const fields = req.body;

      const { numAffected: updatedCount } = await this.db.updateAsync(
        { _id: noteId },
        { $set: fields }
      );

      if (updatedCount === 0) {
        res.status(404).json({ message: "Note not found" });
        return;
      }

      // Retrieve the updated note to return it
      const note = await this.db.findOneAsync({ _id: noteId });
      res.json(note);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating note", error: error.message });
    }
  };
}

const noteController = new NoteController();
// noteController.seed(); // Seed the database with initial notes
export { noteController };
