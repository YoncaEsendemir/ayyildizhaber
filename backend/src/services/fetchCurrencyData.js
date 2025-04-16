const axios = require("axios")
const fs = require("fs").promises
const path = require("path")

// Dosya yolu
const historyFilePath = path.join(__dirname, "../../data/currencyHistory.json")

// Dosya dizininin varlığını kontrol et ve oluştur
const ensureDirectoryExists = async () => {
  const directory = path.dirname(historyFilePath)
  try {
    await fs.access(directory)
  } catch (error) {
    // Dizin yoksa oluştur
    await fs.mkdir(directory, { recursive: true })
  }
}

// Geçmiş verileri oku
const readHistoryData = async () => {
  try {
    await ensureDirectoryExists()

    try {
      const data = await fs.readFile(historyFilePath, "utf8")
      return JSON.parse(data)
    } catch (error) {
      // Dosya yoksa boş bir dizi döndür
      if (error.code === "ENOENT") {
        return []
      }
      throw error
    }
  } catch (error) {
    console.error("Geçmiş verileri okurken hata:", error)
    return []
  }
}

// Geçmiş verileri kaydet
const saveHistoryData = async (data) => {
  try {
    await ensureDirectoryExists()
    await fs.writeFile(historyFilePath, JSON.stringify(data, null, 2), "utf8")
  } catch (error) {
    console.error("Geçmiş verileri kaydederken hata:", error)
  }
}

// Tüm döviz verilerini tek bir kayıt olarak ekle ve en eski kaydı sil (maksimum 10 kayıt)
const updateHistoryData = async (moneyData, goldData, cryptoData) => {
  try {
    const historyData = await readHistoryData()

    const timestamp = new Date().toISOString()

    // Yeni veri kaydı
    const newEntry = {
      timestamp,
      money: {
        USD: {
          buying: moneyData.USD_Buying,
          selling: moneyData.USD_Selling,
          change: moneyData.USD_Change,
        },
        EUR: {
          buying: moneyData.EUR_Buying,
          selling: moneyData.EUR_Selling,
          change: moneyData.EUR_Change,
        },
        GBP: {
          buying: moneyData.GBP_Buying,
          selling: moneyData.GBP_Selling,
          change: moneyData.GBP_Change,
        },
      },
      gold: {
        GRA: {
          buying: goldData.GRA_Buying,
          selling: goldData.GRA_Selling,
          change: goldData.GRA_Change,
        },
      },
      crypto: {
        BTC: {
          buying: cryptoData.BTC_Buying,
          selling: cryptoData.BTC_Selling,
          change: cryptoData.BTC_Change,
        },
      },
    }

    // Yeni veriyi ekle
    const updatedData = [newEntry, ...historyData]

    // Sadece son 10 veriyi tut
    const latestData = updatedData.slice(0, 10)

    // Verileri kaydet
    await saveHistoryData(latestData)

    return latestData
  } catch (error) {
    console.error("Döviz verileri güncellenirken hata:", error)
    throw error
  }
}

// Cache değişkenleri
let cachedMoneyData = null
let cachedGoldData = null
let cachedCryptoData = null
let lastFetchTime = null

const fetchCurrencyCryptoData = async () => {
  try {
    // Cache kontrolü
    if (cachedCryptoData && lastFetchTime && new Date() - lastFetchTime < 2 * 60 * 60 * 1000) {
      return cachedCryptoData
    }

    const getCurrencyCryptoData = await axios.get("https://finance.truncgil.com/api/crypto-currency-rates")
    if (!getCurrencyCryptoData.data) {
      console.error(`API verisi boş`)
      return {}
    }

    const result = {
      // Bitcoin Alış, Satış ve Değişim Oranı
      BTC_Buying: getCurrencyCryptoData?.data?.Rates?.BTC?.Buying || "-",
      BTC_Selling: getCurrencyCryptoData?.data?.Rates?.BTC?.Selling || "-",
      BTC_Change: getCurrencyCryptoData?.data?.Rates?.BTC?.Change || "0",
    }

    // Cache'i güncelle
    cachedCryptoData = result

    return result
  } catch (error) {
    console.error("Crypto para verilerini alırken hata oluştu:", error)
    throw error
  }
}

const fetchCurrencyMoneyData = async () => {
  try {
    // Cache kontrolü
    if (cachedMoneyData && lastFetchTime && new Date() - lastFetchTime < 2 * 60 * 60 * 1000) {
      return cachedMoneyData
    }

    const getCurrencyMoney = await axios.get("https://finans.truncgil.com/v4/today.json")
    if (!getCurrencyMoney.data) {
      console.error(`Döviz verileri para çekilemedi`)
      return {}
    }

    const result = {
      // USD Alış, Satış ve Değişim Oranı
      USD_Buying: getCurrencyMoney.data.USD?.["Buying"] || "-",
      USD_Selling: getCurrencyMoney.data.USD?.["Selling"] || "-",
      USD_Change: getCurrencyMoney.data.USD?.["Change"] || "0",

      // EUR Alış, Satış ve Değişim Oranı
      EUR_Buying: getCurrencyMoney.data.EUR?.["Buying"] || "-",
      EUR_Selling: getCurrencyMoney.data.EUR?.["Selling"] || "-",
      EUR_Change: getCurrencyMoney.data.EUR?.["Change"] || "0",

      // GBP Alış, Satış ve Değişim Oranı
      GBP_Buying: getCurrencyMoney.data.GBP?.["Buying"] || "-",
      GBP_Selling: getCurrencyMoney.data.GBP?.["Selling"] || "-",
      GBP_Change: getCurrencyMoney.data.GBP?.["Change"] || "0",
    }

    // Cache'i güncelle
    cachedMoneyData = result

    return result
  } catch (error) {
    console.error("Para birimi verilerini alırken hata oluştu:", error)
    throw error
  }
}

const fetchCurrencyGoldData = async () => {
  try {
    // Cache kontrolü
    if (cachedGoldData && lastFetchTime && new Date() - lastFetchTime < 2 * 60 * 60 * 1000) {
      return cachedGoldData
    }

    const getCurrencyGold = await axios.get("https://finance.truncgil.com/api/gold-rates")
    if (!getCurrencyGold.data) {
      console.error(`Döviz verileri altın çekilemedi`)
      return {}
    }

    const result = {
      // Gramaltın Alış, Satış ve Değişim Oranı
      GRA_Buying: getCurrencyGold.data.Rates.GRA?.Buying || "-",
      GRA_Selling: getCurrencyGold.data.Rates.GRA?.Selling || "-",
      GRA_Change: getCurrencyGold.data.Rates.GRA?.Change || "0",

      // CEYREKALTIN Alış, Satış ve Değişim Oranı
      CEY_Buying: getCurrencyGold.data.Rates.CEY?.Buying || "-",
      CEY_Selling: getCurrencyGold.data.Rates.CEY?.Selling || "-",
      CEY_Change: getCurrencyGold.data.Rates.CEY?.Change || "0",

      // Tamaltın Alış, Satış ve Değişim Oranı
      TAM_Buying: getCurrencyGold.data.Rates.TAM?.Buying || "-",
      TAM_Selling: getCurrencyGold.data.Rates.TAM?.Selling || "-",
      TAM_Change: getCurrencyGold.data.Rates.TAM?.Change || "0",
    }

    // Cache'i güncelle
    cachedGoldData = result

    return result
  } catch (error) {
    console.error("Altın verilerini alırken hata oluştu:", error)
    throw error
  }
}

// Tüm döviz verilerini çek ve geçmiş verileri güncelle
const fetchAllCurrencyData = async (forceUpdate = false) => {
  try {
    // Cache kontrolü
    const now = new Date()
    if (!forceUpdate && lastFetchTime && now - lastFetchTime < 2 * 60 * 60 * 1000) {
      return {
        money: cachedMoneyData,
        gold: cachedGoldData,
        crypto: cachedCryptoData,
      }
    }

    // Tüm verileri çek
    const moneyData = await fetchCurrencyMoneyData()
    const goldData = await fetchCurrencyGoldData()
    const cryptoData = await fetchCurrencyCryptoData()

    // Son çekme zamanını güncelle
    lastFetchTime = now

    // Geçmiş verileri güncelle
    await updateHistoryData(moneyData, goldData, cryptoData)

    return {
      money: moneyData,
      gold: goldData,
      crypto: cryptoData,
    }
  } catch (error) {
    console.error("Tüm döviz verilerini çekerken hata:", error)
    throw error
  }
}

// Tüm geçmiş verileri getir
const getAllCurrencyHistory = async () => {
  return await readHistoryData()
}

module.exports = {
  fetchCurrencyCryptoData,
  fetchCurrencyMoneyData,
  fetchCurrencyGoldData,
  fetchAllCurrencyData,
  getAllCurrencyHistory,
}
