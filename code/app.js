import express from "express";

import { indexRoutes } from "./routes/index-routes.js";
import { noteRoutes } from "./routes/note-routes.js";
import { CONFIG } from "./config.js";

export const app = express();

app.use(express.static(CONFIG.public));
app.use(express.json());

app.use("/", indexRoutes);
app.use("/notes", noteRoutes);

app.get("/", function (req, res) {
  res.sendFile("/index.html", { root: CONFIG.public });
});

// app.use("/", indexRoutes);
// app.use("/orders", orderRoutes);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  next(err);
  // if (err.name === 'UnauthorizedError') {
  //     res.status(401).send('No token / Invalid token provided');
  // } else {
  //     next(err);
  // }
});
