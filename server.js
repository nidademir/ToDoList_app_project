const express = require("express");
const path = require("path");
const todoRouter = require("./routers/todoRouter");

const app = express();
const PORT = 4444;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", todoRouter);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.delete('/tasks/clear-completed', (req, res) => {
    Task.deleteMany({ completed: true })  // Sadece tamamlanmış görevleri siler
        .then(() => res.status(200).send('Completed tasks deleted successfully'))
});