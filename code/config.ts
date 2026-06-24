import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT: string = path.resolve("code");
export const ConfigRoot: string = path.resolve(__dirname);

interface CONFIG {
  root: string;
  data: (dbName: string) => string;
  public: string;
  publicCombined: (dbName: string) => string;
  publicDefault: string;
  views: string;
  viewsDefault: string;
}

export const CONFIG: CONFIG = {
  root: ROOT,
  data: (dbName: string): string => path.join(ROOT, "data", dbName),
  public: path.join(ROOT, "public"),
  publicCombined: (dbName: string): string => path.join(ROOT, "data", dbName),
  publicDefault: path.resolve(__dirname, "../public"),
  views: path.join(ROOT, "views"),
  viewsDefault: path.resolve(__dirname, "../views"),
};
