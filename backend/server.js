const express = require("express")
const cors = require("cors")
const cron = require("node-cron")
const weatherRoutes = require("./src/routes/weatherRoutes")
const prayerTimesRoutes = require("./src/routes/prayerTimesRoutes")
const newsRoutes = require("./src/routes/newsRoutes")
const newsRoutes2 = require("./src/routes/newsRoute2")
const currencyRoutes = require("./src/routes/currencyRoute")
const currencyService = require("./src/services/fetchCurrencyData")

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

// API rotaları
app.use("/api/weather", weatherRoutes)
app.use("/api/prayer-times", prayerTimesRoutes)
app.use("/api/news", newsRoutes)
app.use("/api/news2", newsRoutes2)
app.use("/api/currency", currencyRoutes)

// Her 30 dakikada bir döviz verilerini güncelle
cron.schedule("*/30 * * * *", async () => {
  try {
    console.log("Döviz verileri güncelleniyor...")
    await currencyService.fetchCurrencyMoneyData()
    await currencyService.fetchCurrencyGoldData()
    await currencyService.fetchCurrencyCryptoData()
    console.log("Döviz verileri güncellendi")
  } catch (error) {
    console.error("Zamanlanmış döviz güncelleme hatası:", error)
  }
})

// Uygulama başladığında ilk döviz verilerini al
app.on("ready", async () => {
  try {
    console.log("İlk döviz verileri alınıyor...")
    await currencyService.fetchCurrencyMoneyData()
    await currencyService.fetchCurrencyGoldData()
    await currencyService.fetchCurrencyCryptoData()
    console.log("İlk döviz verileri alındı")
  } catch (error) {
    console.error("İlk döviz verileri alınırken hata:", error)
  }
})

// Global hata yakalama
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Bir hata oluştu" })
})

const server = app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`)
  app.emit("ready")
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM sinyali alındı, sunucu kapatılıyor")
  server.close(() => {
    console.log("Sunucu kapatıldı")
    process.exit(0)
  })
})
