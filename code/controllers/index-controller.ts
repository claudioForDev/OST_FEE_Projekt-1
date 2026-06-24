import { Request, Response } from "express";
import { CONFIG } from "../config.js";

export class IndexController {
  indexHtml = async (_req: Request, res: Response): Promise<void> => {
    res.sendFile("/index.html", { root: CONFIG.public });
  };
}

export const indexController = new IndexController();
