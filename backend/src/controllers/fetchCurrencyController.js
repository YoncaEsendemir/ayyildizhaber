const currencyService = require("../services/fetchCurrencyData")

// Altın verileri çeker
const getGold = async (req, res) => {
  try {
    const goldData = await currencyService.fetchCurrencyGoldData()
    res.json(goldData)
  } catch (error) {
    console.error("Altın verileri alınırken hata oluştu:", error.message)
    res.status(500).json({ error: "Altın verileri alınamadı" })
  }
}

// Crypto Para verileri çeker
const getCrypto = async (req, res) => {
  try {
    const cryptoData = await currencyService.fetchCurrencyCryptoData()
    res.json(cryptoData)
  } catch (error) {
    console.error("Kripto para verileri alınırken hata oluştu:", error.message)
    res.status(500).json({ error: "Kripto para verileri alınamadı" })
  }
}

// Döviz para verileri çeker
const getMoney = async (req, res) => {
  try {
    const moneyData = await currencyService.fetchCurrencyMoneyData()
    res.json(moneyData)
  } catch (error) {
    console.error("Para birimi verileri alınırken hata oluştu:", error.message)
    res.status(500).json({ error: "Döviz verileri alınamadı" })
  }
}

// Geçmiş döviz verilerini getirir
const getCurrencyHistory = async (req, res) => {
  try {
    const historyData = await currencyService.getAllCurrencyHistory()
    res.json(historyData)
  } catch (error) {
    console.error("Geçmiş döviz verileri alınırken hata oluştu:", error.message)
    res.status(500).json({ error: "Geçmiş veriler alınamadı" })
  }
}

// Tüm döviz verilerini çeker
const getAllCurrency = async (req, res) => {
  try {
    const allData = await currencyService.fetchAllCurrencyData()

    res.json({
      success: true,
      data: allData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Tüm döviz verileri alınırken hata oluştu:", error.message)

    let errorMessage = "Tüm döviz verileri alınamadı"
    if (error.response) {
      errorMessage += ` - Sunucu yanıtı: ${error.response.status}`
    } else if (error.request) {
      errorMessage += " - Sunucudan yanıt alınamadı"
    } else {
      errorMessage += ` - ${error.message}`
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    })
  }
}



module.exports = {
  getCrypto,
  getGold,
  getMoney,
  getAllCurrency,
  getCurrencyHistory,
}
