const express = require("express");
const fs = require("fs");
const router = express.Router();
const dbFile = "db.json";

function readDB() {
    return JSON.parse(fs.readFileSync(dbFile, "utf-8"));
}

function writeDB(data) {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), "utf-8");
}

router.get("/", (req, res) => {
    const data = readDB();
    res.render("todo", { tasks: data.tasks });
});

router.post("/tasks", (req, res) => {
    const data = readDB();
    const newTask = {
        id: Date.now(),
        text: req.body.text,
        completed: false,
    };
    data.tasks.push(newTask);
    writeDB(data);
    res.status(201).json(newTask);
});

router.put("/tasks/:id", (req, res) => {
    const data = readDB();
    const task = data.tasks.find(t => t.id == req.params.id);

    if (!task) return res.status(404).send("Görev bulunamadı.");

    if (req.body.text !== undefined) task.text = req.body.text;
    if (req.body.completed !== undefined) task.completed = req.body.completed;

    writeDB(data);
    res.json(task);
});

router.delete("/tasks/:id", (req, res) => {
    let data = readDB();
    data.tasks = data.tasks.filter(t => t.id != req.params.id);
    writeDB(data);
    res.send("Görev silindi.");
});

router.delete("/tasks", (req, res) => {
    writeDB({ tasks: [] });
    res.send("Tüm görevler silindi.");
});

module.exports = router;
