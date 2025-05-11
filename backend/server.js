const express = require('express');
const cors = require("cors");
const cron = require("node-cron");
const dotenv = require("dotenv");
const path = require("path");

const weatherRoutes = require("./src/routes/weatherRoutes");
const prayerTimesRoutes = require("./src/routes/prayerTimesRoutes");
const newsRoutes = require("./src/routes/newsRoutes");
const newsRoutes2 = require("./src/routes/newsRoute2");
const currencyRoutes = require("./src/routes/currencyRoute");
const authRoutes = require("./src/routes/authRoutes");
const adminNewsRoute = require("./src/routes/adminNewsRoute");

const currencyService = require("./src/services/fetchCurrencyData");

const app = express();
dotenv.config();

// CORS ayarı
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// JSON ve form veri çözümleme
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik dosyalar: uploads dizinini servis et!
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));



// API rotaları
app.use("/api/weather", weatherRoutes);
app.use("/api/prayer-times", prayerTimesRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/news2", newsRoutes2);
app.use("/api/currency", currencyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/adminNews", adminNewsRoute);

// Döviz güncelleme cron
cron.schedule("*/30 * * * *", async () => {
  try {
    console.log("Döviz verileri güncelleniyor...");
    await currencyService.fetchCurrencyMoneyData();
    await currencyService.fetchCurrencyGoldData();
    await currencyService.fetchCurrencyCryptoData();
    console.log("Döviz verileri güncellendi");
  } catch (error) {
    console.error("Zamanlanmış döviz güncelleme hatası:", error);
  }
});

// İlk başta döviz verisi alma
app.on("ready", async () => {
  try {
    console.log("İlk döviz verileri alınıyor...");
    await currencyService.fetchCurrencyMoneyData();
    await currencyService.fetchCurrencyGoldData();
    await currencyService.fetchCurrencyCryptoData();
    console.log("İlk döviz verileri alındı");
  } catch (error) {
    console.error("İlk döviz verileri alınırken hata:", error);
  }
});

// Global hata yakalama
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Bir hata oluştu" });
});

// Port ayarı ve başlatma
const PORT = process.env.EXPRESS_PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
});
