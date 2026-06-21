import express from "express";

const router = express.Router();
import { indexController } from "../controllers/index-controller.js";

router.get("/", indexController.indexHtml);

export const indexRoutes = router;
