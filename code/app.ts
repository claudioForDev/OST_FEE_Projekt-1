import { Request, Response, NextFunction } from "express";
import express from "express";

import { indexRoutes } from "./routes/index-routes.js";
import { noteRoutes } from "./routes/note-routes.js";
import { CONFIG } from "./config.js";

export const app = express();

// Allow CORS for all origins (for development purposes)
app.use((req: Request, res: Response, next: NextFunction): void => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(express.static(CONFIG.public));
app.use(express.json());

app.use("/", indexRoutes);
app.use("/notes", noteRoutes);

app.get("/", (_req: Request, res: Response): void => {
  res.sendFile("/index.html", { root: CONFIG.public });
});

// Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(
  (err: Error, _req: Request, _res: Response, next: NextFunction): void => {
    console.error(err.stack);
    next(err);
  }
);
