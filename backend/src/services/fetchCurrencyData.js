// src/services/fetchCurrencyData.js
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

// API erişilebilirliğini kontrol et
const checkApiAvailability = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: "https://www.google.com/",
      },
      timeout: 10000,
    })
    return response.status === 200
  } catch (error) {
    console.error(`API erişilebilirlik kontrolü başarısız (${url}):`, error.message)
    return false
  }
}

// Alternatif API URL'leri
const API_URLS = {
  money: [
    "https://finans.truncgil.com/v4/today.json",
    "https://api.genelpara.com/embed/doviz.json", // Alternatif API
  ],
  gold: [
    "https://finance.truncgil.com/api/gold-rates",
    "https://api.genelpara.com/embed/altin.json", // Alternatif API
  ],
  crypto: [
    "https://finance.truncgil.com/api/crypto-currency-rates",
    "https://api.genelpara.com/embed/kripto.json", // Alternatif API
  ],
}

// En uygun API URL'sini seç
const getBestApiUrl = async (type) => {
  for (const url of API_URLS[type]) {
    const isAvailable = await checkApiAvailability(url)
    if (isAvailable) {
      return url
    }
  }
  // Hiçbir API erişilebilir değilse, ilk URL'yi döndür
  return API_URLS[type][0]
}

const fetchCurrencyCryptoData = async () => {
  try {
    // Cache kontrolü
    if (cachedCryptoData && lastFetchTime && new Date() - lastFetchTime < 2 * 60 * 60 * 1000) {
      return cachedCryptoData
    }

    // En uygun API URL'sini seç
    const apiUrl = await getBestApiUrl("crypto")

    const getCurrencyCryptoData = await axios.get(apiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: "https://www.google.com/",
      },
      timeout: 10000,
    })

    if (!getCurrencyCryptoData.data) {
      console.error(`API verisi boş`)
      return {}
    }

    let result = {}

    // Truncgil API formatı
    if (apiUrl.includes("truncgil")) {
      result = {
        BTC_Buying: getCurrencyCryptoData?.data?.Rates?.BTC?.Buying || "-",
        BTC_Selling: getCurrencyCryptoData?.data?.Rates?.BTC?.Selling || "-",
        BTC_Change: getCurrencyCryptoData?.data?.Rates?.BTC?.Change || "0",
      }
    }
    // Genelpara API formatı
    else if (apiUrl.includes("genelpara")) {
      result = {
        BTC_Buying: getCurrencyCryptoData?.data?.BTC?.alis || "-",
        BTC_Selling: getCurrencyCryptoData?.data?.BTC?.satis || "-",
        BTC_Change: getCurrencyCryptoData?.data?.BTC?.degisim || "0",
      }
    }

    // Cache'i güncelle
    cachedCryptoData = result
    lastFetchTime = new Date()

    return result
  } catch (error) {
    console.error("Crypto para verilerini alırken hata oluştu:", error.message)

    // Hata durumunda cache'deki verileri kullan
    if (cachedCryptoData) {
      console.log("Cache'deki crypto para verileri kullanılıyor")
      return cachedCryptoData
    }

    // Cache boşsa boş nesne döndür
    return {}
  }
}

const fetchCurrencyMoneyData = async () => {
  try {
    // Cache kontrolü
    if (cachedMoneyData && lastFetchTime && new Date() - lastFetchTime < 2 * 60 * 60 * 1000) {
      return cachedMoneyData
    }

    // En uygun API URL'sini seç
    const apiUrl = await getBestApiUrl("money")

    const getCurrencyMoney = await axios.get(apiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: "https://www.google.com/",
      },
      timeout: 10000,
    })

    if (!getCurrencyMoney.data) {
      console.error(`Döviz verileri para çekilemedi`)
      return {}
    }

    let result = {}

    // Truncgil API formatı
    if (apiUrl.includes("truncgil")) {
      result = {
        USD_Buying: getCurrencyMoney.data.USD?.["Buying"] || "-",
        USD_Selling: getCurrencyMoney.data.USD?.["Selling"] || "-",
        USD_Change: getCurrencyMoney.data.USD?.["Change"] || "0",
        EUR_Buying: getCurrencyMoney.data.EUR?.["Buying"] || "-",
        EUR_Selling: getCurrencyMoney.data.EUR?.["Selling"] || "-",
        EUR_Change: getCurrencyMoney.data.EUR?.["Change"] || "0",
        GBP_Buying: getCurrencyMoney.data.GBP?.["Buying"] || "-",
        GBP_Selling: getCurrencyMoney.data.GBP?.["Selling"] || "-",
        GBP_Change: getCurrencyMoney.data.GBP?.["Change"] || "0",
      }
    }
    // Genelpara API formatı
    else if (apiUrl.includes("genelpara")) {
      result = {
        USD_Buying: getCurrencyMoney.data.USD?.alis || "-",
        USD_Selling: getCurrencyMoney.data.USD?.satis || "-",
        USD_Change: getCurrencyMoney.data.USD?.degisim || "0",
        EUR_Buying: getCurrencyMoney.data.EUR?.alis || "-",
        EUR_Selling: getCurrencyMoney.data.EUR?.satis || "-",
        EUR_Change: getCurrencyMoney.data.EUR?.degisim || "0",
        GBP_Buying: getCurrencyMoney.data.GBP?.alis || "-",
        GBP_Selling: getCurrencyMoney.data.GBP?.satis || "-",
        GBP_Change: getCurrencyMoney.data.GBP?.degisim || "0",
      }
    }

    // Cache'i güncelle
    cachedMoneyData = result
    lastFetchTime = new Date()

    return result
  } catch (error) {
    console.error("Para birimi verilerini alırken hata oluştu:", error.message)

    // Hata durumunda cache'deki verileri kullan
    if (cachedMoneyData) {
      console.log("Cache'deki para birimi verileri kullanılıyor")
      return cachedMoneyData
    }

    // Cache boşsa boş nesne döndür
    return {}
  }
}

const fetchCurrencyGoldData = async () => {
  try {
    // Cache kontrolü
    if (cachedGoldData && lastFetchTime && new Date() - lastFetchTime < 2 * 60 * 60 * 1000) {
      return cachedGoldData
    }

    // En uygun API URL'sini seç
    const apiUrl = await getBestApiUrl("gold")

    const getCurrencyGold = await axios.get(apiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: "https://www.google.com/",
      },
      timeout: 10000,
    })

    if (!getCurrencyGold.data) {
      console.error(`Döviz verileri altın çekilemedi`)
      return {}
    }

    let result = {}

    // Truncgil API formatı
    if (apiUrl.includes("truncgil")) {
      result = {
        GRA_Buying: getCurrencyGold.data.Rates.GRA?.Buying || "-",
        GRA_Selling: getCurrencyGold.data.Rates.GRA?.Selling || "-",
        GRA_Change: getCurrencyGold.data.Rates.GRA?.Change || "0",
        CEY_Buying: getCurrencyGold.data.Rates.CEY?.Buying || "-",
        CEY_Selling: getCurrencyGold.data.Rates.CEY?.Selling || "-",
        CEY_Change: getCurrencyGold.data.Rates.CEY?.Change || "0",
        TAM_Buying: getCurrencyGold.data.Rates.TAM?.Buying || "-",
        TAM_Selling: getCurrencyGold.data.Rates.TAM?.Selling || "-",
        TAM_Change: getCurrencyGold.data.Rates.TAM?.Change || "0",
      }
    }
    // Genelpara API formatı
    else if (apiUrl.includes("genelpara")) {
      result = {
        GRA_Buying: getCurrencyGold.data.GA?.alis || "-",
        GRA_Selling: getCurrencyGold.data.GA?.satis || "-",
        GRA_Change: getCurrencyGold.data.GA?.degisim || "0",
        CEY_Buying: getCurrencyGold.data.C?.alis || "-",
        CEY_Selling: getCurrencyGold.data.C?.satis || "-",
        CEY_Change: getCurrencyGold.data.C?.degisim || "0",
        TAM_Buying: getCurrencyGold.data.T?.alis || "-",
        TAM_Selling: getCurrencyGold.data.T?.satis || "-",
        TAM_Change: getCurrencyGold.data.T?.degisim || "0",
      }
    }

    // Cache'i güncelle
    cachedGoldData = result
    lastFetchTime = new Date()

    return result
  } catch (error) {
    console.error("Altın verilerini alırken hata oluştu:", error.message)

    // Hata durumunda cache'deki verileri kullan
    if (cachedGoldData) {
      console.log("Cache'deki altın verileri kullanılıyor")
      return cachedGoldData
    }

    // Cache boşsa boş nesne döndür
    return {}
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
    console.error("Tüm döviz verilerini çekerken hata:", error.message)

    // Hata durumunda cache'deki verileri kullan
    return {
      money: cachedMoneyData || {},
      gold: cachedGoldData || {},
      crypto: cachedCryptoData || {},
    }
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
  checkApiAvailability,
  API_URLS,
  getBestApiUrl,
}
