const express = require("express");
const path = require("path");
const todoRouter = require("./routers/todoRouter");

const app = express();
const PORT = 4444;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public klasörünü kullan (CSS ve JS dosyaları için)
app.use(express.static(path.join(__dirname, "public")));

// EJS ayarı
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Todo rotasını kullan
app.use("/", todoRouter);

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});


app.delete('/tasks/clear-completed', (req, res) => {
    Task.deleteMany({ completed: true })  // Sadece tamamlanmış görevleri siler
        .then(() => res.status(200).send('Completed tasks deleted successfully'))
});