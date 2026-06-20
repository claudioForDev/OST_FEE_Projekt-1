import { CONFIG } from "../config.js";

export class IndexController {
  indexHtml = async (req, res) => {
    res.sendFile("/index.html", { root: CONFIG.public });
  };
}

export const indexController = new IndexController();
