const currencyService = require("../services/fetchCurrencyData")

// Altın verileri çeker
const getGold = async (req, res) => {
  try {
    const goldData = await currencyService.fetchCurrencyGoldData()
    res.json(goldData)
  } catch (error) {
    console.error("Döviz verileri alınırken hata oluştu:", error)
    res.status(500).json({ error: "Veri alınamadı" })
  }
}

// Crypto Para verileri çeker
const getCrypto = async (req, res) => {
  try {
    const cryptoData = await currencyService.fetchCurrencyCryptoData()
    res.json(cryptoData)
  } catch (error) {
    console.error("Döviz verileri alınırken hata oluştu:", error)
    res.status(500).json({ error: "Veri alınamadı" })
  }
}

// Döviz para verileri çeker
const getMoney = async (req, res) => {
  try {
    const moneyData = await currencyService.fetchCurrencyMoneyData()
    res.json(moneyData)
  } catch (error) {
    console.error("Döviz verileri alınırken hata oluştu:", error)
    res.status(500).json({ error: "Veri alınamadı" })
  }
}

// Tüm döviz verilerini çeker
const getAllCurrency = async (req, res) => {
  try {
    const allData = await currencyService.fetchAllCurrencyData()
    res.json(allData)
  } catch (error) {
    console.error("Tüm döviz verileri alınırken hata oluştu:", error)
    res.status(500).json({ error: "Veri alınamadı" })
  }
}

// Geçmiş döviz verilerini getirir
const getCurrencyHistory = async (req, res) => {
  try {
    const historyData = await currencyService.getAllCurrencyHistory()
    res.json(historyData)
  } catch (error) {
    console.error("Geçmiş döviz verileri alınırken hata oluştu:", error)
    res.status(500).json({ error: "Geçmiş veriler alınamadı" })
  }
}

module.exports = {
  getCrypto,
  getGold,
  getMoney,
  getAllCurrency,
  getCurrencyHistory,
}
