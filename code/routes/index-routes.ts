import { Router } from "express";
import { indexController } from "../controllers/index-controller.js";

const router = Router();

router.get("/", indexController.indexHtml);

export const indexRoutes = router;
