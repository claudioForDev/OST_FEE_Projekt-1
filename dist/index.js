import dotenv from "dotenv";
dotenv.config({ path: `code/.env` });
const { app } = await import("./app.js");
const hostname = process.env.HOSTNAME || "127.0.0.1";
const port = Number(process.env.PORT) || 3000;
app.listen(port, hostname, (error) => {
    if (error) {
        console.error(error);
    }
    else {
        console.log(`Server running at http://${hostname}:${port}/`);
    }
});
