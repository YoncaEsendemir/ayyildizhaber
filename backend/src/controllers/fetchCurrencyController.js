const currencyService = require("../services/fetchCurrencyData")

// Altın verileri çeker
const getGold = async (req, res) => {
  try {
    const goldData = await currencyService.fetchCurrencyGoldData()
    res.json(goldData)
  } catch (error) {
    console.error("Altın verileri alınırken hata oluştu:", error.message)

    // Daha detaylı hata mesajı
    let errorMessage = "Veri alınamadı"
    if (error.response) {
      errorMessage += ` - Sunucu yanıtı: ${error.response.status}`
    } else if (error.request) {
      errorMessage += " - Sunucudan yanıt alınamadı"
    } else {
      errorMessage += ` - ${error.message}`
    }

    res.status(500).json({ error: errorMessage })
  }
}

// Crypto Para verileri çeker
const getCrypto = async (req, res) => {
  try {
    const cryptoData = await currencyService.fetchCurrencyCryptoData()
    res.json(cryptoData)
  } catch (error) {
    console.error("Kripto para verileri alınırken hata oluştu:", error.message)

    // Daha detaylı hata mesajı
    let errorMessage = "Veri alınamadı"
    if (error.response) {
      errorMessage += ` - Sunucu yanıtı: ${error.response.status}`
    } else if (error.request) {
      errorMessage += " - Sunucudan yanıt alınamadı"
    } else {
      errorMessage += ` - ${error.message}`
    }

    res.status(500).json({ error: errorMessage })
  }
}

// Döviz para verileri çeker
const getMoney = async (req, res) => {
  try {
    const moneyData = await currencyService.fetchCurrencyMoneyData()
    res.json(moneyData)
  } catch (error) {
    console.error("Para birimi verileri alınırken hata oluştu:", error.message)

    // Daha detaylı hata mesajı
    let errorMessage = "Veri alınamadı"
    if (error.response) {
      errorMessage += ` - Sunucu yanıtı: ${error.response.status}`
    } else if (error.request) {
      errorMessage += " - Sunucudan yanıt alınamadı"
    } else {
      errorMessage += ` - ${error.message}`
    }

    res.status(500).json({ error: errorMessage })
  }
}

// Tüm döviz verilerini çeker
const getAllCurrency = async (req, res) => {
  try {
    const allData = await currencyService.fetchAllCurrencyData()
    res.json(allData)
  } catch (error) {
    console.error("Tüm döviz verileri alınırken hata oluştu:", error.message)

    // Daha detaylı hata mesajı
    let errorMessage = "Veri alınamadı"
    if (error.response) {
      errorMessage += ` - Sunucu yanıtı: ${error.response.status}`
    } else if (error.request) {
      errorMessage += " - Sunucudan yanıt alınamadı"
    } else {
      errorMessage += ` - ${error.message}`
    }

    res.status(500).json({ error: errorMessage })
  }
}

// Geçmiş döviz verilerini getirir
const getCurrencyHistory = async (req, res) => {
  try {
    const historyData = await currencyService.getAllCurrencyHistory()
    res.json(historyData)
  } catch (error) {
    console.error("Geçmiş döviz verileri alınırken hata oluştu:", error.message)

    // Daha detaylı hata mesajı
    let errorMessage = "Geçmiş veriler alınamadı"
    if (error.response) {
      errorMessage += ` - Sunucu yanıtı: ${error.response.status}`
    } else if (error.request) {
      errorMessage += " - Sunucudan yanıt alınamadı"
    } else {
      errorMessage += ` - ${error.message}`
    }

    res.status(500).json({ error: errorMessage })
  }
}

// API durumunu kontrol eder
const checkApiStatus = async (req, res) => {
  try {
    const moneyApiUrl = await currencyService.getBestApiUrl("money")
    const goldApiUrl = await currencyService.getBestApiUrl("gold")
    const cryptoApiUrl = await currencyService.getBestApiUrl("crypto")

    res.json({
      status: "success",
      apis: {
        money: {
          url: moneyApiUrl,
          available: await currencyService.checkApiAvailability(moneyApiUrl),
        },
        gold: {
          url: goldApiUrl,
          available: await currencyService.checkApiAvailability(goldApiUrl),
        },
        crypto: {
          url: cryptoApiUrl,
          available: await currencyService.checkApiAvailability(cryptoApiUrl),
        },
      },
    })
  } catch (error) {
    console.error("API durumu kontrol edilirken hata oluştu:", error.message)
    res.status(500).json({
      status: "error",
      message: "API durumu kontrol edilemedi",
      error: error.message,
    })
  }
}

module.exports = {
  getCrypto,
  getGold,
  getMoney,
  getAllCurrency,
  getCurrencyHistory,
  checkApiStatus,
}
