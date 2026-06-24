import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const ROOT = path.resolve("code");
export const ConfigRoot = path.resolve(__dirname);
export const CONFIG = {
  root: ROOT,
  data: (dbName) => path.join(ROOT, "data", dbName),
  public: path.join(ROOT, "public"),
  publicCombined: (dbName) => path.join(ROOT, "data", dbName),
  publicDefault: path.resolve(__dirname, "../public"),
  views: path.join(ROOT, "views"),
  viewsDefault: path.resolve(__dirname, "../views"),
};
