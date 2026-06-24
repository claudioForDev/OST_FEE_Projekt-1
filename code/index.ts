import dotenv from "dotenv";

dotenv.config({ path: `code/.env` });

const { app } = await import("./app.js");

const hostname: string = process.env.HOSTNAME || "127.0.0.1";
const port: string | number = Number(process.env.PORT) || 3000;

app.listen(port, hostname, (error?: Error): void => {
  if (error) {
    console.error(error);
  } else {
    console.log(`Server running at http://${hostname}:${port}/`);
  }
});
