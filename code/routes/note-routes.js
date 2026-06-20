import express from 'express';

const router = express.Router();
import {noteController} from '../controllers/note-controller.js';

// TODO: add routes from notes
router.get("/", noteController.indexHtml);

export const noteRoutes = router;