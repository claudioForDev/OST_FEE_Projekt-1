import { Router } from "express";
import { noteController } from "../controllers/note-controller.js";
const router = Router();
router.get("/", noteController.getAllNotes);
router.get("/:id", noteController.getNoteById);
router.post("/", noteController.addNote);
router.put("/:id", noteController.updateNote);
export const noteRoutes = router;
