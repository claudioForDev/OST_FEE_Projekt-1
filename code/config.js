import path from "path";

const __dirname = import.meta.dirname;

export const ROOT = path.resolve("code");
export const ConfigRoot = path.resolve(__dirname);

export const CONFIG = {
  root: ROOT,
  data: (dbName) => path.join(ROOT, "data", dbName),
  public: path.join(ROOT, "public"),
  publicCombined: (dbName) => path.join(ROOT, "data", dbName),
  publicDefault: path.join(ConfigRoot, "public"),
  views: path.join(ROOT, "views"),
  viewsDefault: path.join(ConfigRoot, "views"),
};
