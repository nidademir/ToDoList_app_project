// Gerekli modülleri içe aktardık
const express = require("express");
const fs = require("fs");

// Express Router'ı oluşturduk
const router = express.Router();

// JSON veritabanı dosyasının yolu
const dbFile = "db.json";

// Veritabanını okuma fonksiyonu
function readDB() {
    return JSON.parse(fs.readFileSync(dbFile, "utf-8"));
}

// Veritabanına veri yazma fonksiyonu
function writeDB(data) {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), "utf-8");
}

// Ana sayfa yönlendirmesi (todo.ejs dosyasını render eder)
router.get("/", (req, res) => {
    const data = readDB();
    res.render("todo", { tasks: data.tasks });
});

// Yeni görev ekleme endpoint'i
router.post("/tasks", (req, res) => {
    const data = readDB();

    // Yeni görev nesnesi oluştur
    const newTask = {
        id: Date.now(),  // Her görev için benzersiz ID
        text: req.body.text,
        completed: false,
    };

    // Yeni görevi JSON dosyasına ekler
    data.tasks.push(newTask);
    writeDB(data);

    res.status(201).json(newTask);
});

// Görev güncelleme endpoint'i
router.put("/tasks/:id", (req, res) => {
    const data = readDB();

    // Güncellenecek görevi bulur
    const task = data.tasks.find(t => t.id == req.params.id);

    // Eğer görev bulunamazsa hata döndürür
    if (!task) return res.status(404).send("Görev bulunamadı.");

    // Gelen veriye göre güncellemeleri yapar
    if (req.body.text !== undefined) task.text = req.body.text;
    if (req.body.completed !== undefined) task.completed = req.body.completed;

    writeDB(data);
    res.json(task);
});

// Belirli bir görevi silme endpoint'i
router.delete("/tasks/:id", (req, res) => {
    let data = readDB();

    // ID'si eşleşmeyen görevleri filtreleyerek kalanları saklar
    data.tasks = data.tasks.filter(t => t.id != req.params.id);
    writeDB(data);

    res.send("Görev silindi.");
});

// Tüm görevleri silme endpoint'i
router.delete("/tasks", (req, res) => {
    writeDB({ tasks: [] });
    res.send("Tüm görevler silindi.");
});

// Router'ı dışa aktar
module.exports = router;
