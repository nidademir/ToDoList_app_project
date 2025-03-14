// Express modülünü projeye dahil ettik
const express = require("express");

// Path modülünü içe aktardık
const path = require("path");

// Router'ı dahil ettik (Todo işlemleri için yönlendirme yapacak)
const todoRouter = require("./routers/todoRouter");

// Express uygulmasını başlat
const app = express();

// Sunucunun çalışacağı port
const PORT = 4444;

// JSON formatındaki isteklerin işlenmesini sağlar
app.use(express.json());

// URL-encoded verilerin işlenmesini sağlar (Form verileri için gereklidir)
app.use(express.urlencoded({ extended: true }));

// Public klasörünü statik dosyalar için kullanır (CSS, JS, görseller vb.)
app.use(express.static(path.join(__dirname, "public")));

// Şablon motoru olarak EJS kullanır (Sayfaların dinamik olarak oluşturulması için)
app.set("view engine", "ejs");

// Views klasörünün yolunu belirtir (EJS dosyalarının bulunduğu klasör)
app.set("views", path.join(__dirname, "views"));

// Ana router olarak todoRouter'ı kullanır (Tüm yönlendirmeler bu dosyada olacak)
app.use("/", todoRouter);

// Sunucuyu belirtilen portta çalışır ve terminale bilgi mesajı yazdırır
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
