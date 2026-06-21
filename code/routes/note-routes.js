import express from "express";

const router = express.Router();
import { noteController } from "../controllers/note-controller.js";

// TODO: add routes from notes
router.get("/", noteController.getAllNotes);
router.get("/:id", noteController.getNoteById);
router.post("/", noteController.addNote);
router.put("/:id", noteController.updateNote);
router.delete("/:id", noteController.deleteNote);

export const noteRoutes = router;
