import app from "./app";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

app.listen(port, "0.0.0.0", () => {
    console.log(`Buddy server is running on port ${port}`);
})