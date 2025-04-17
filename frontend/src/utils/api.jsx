import axios from "axios"

const API_BASE_URL = "http://localhost:5000/api"

export const fetchWeatherData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/weather/all`)
    return response.data
  } catch (error) {
    console.error("Error fetching all weather data:", error)
    throw error
  }
}

export const fetchWeatherByCity = async (city) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/weather/${encodeURIComponent(city)}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error)
    throw error
  }
}

export const fetchAllPrayerTimes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/prayer-times/all`)
    return response.data
  } catch (error) {
    console.error("Error fetching all prayer times:", error)
    throw error
  }
}

export const fetchPrayerTimesByCity = async (city) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/prayer-times/${encodeURIComponent(city)}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching prayer times for ${city}:`, error)
    throw error
  }
}

export const fetchTurkeyRegions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/prayer-times/regions/turkey`)
    return response.data
  } catch (error) {
    console.error("Error fetching Turkey regions:", error)
    throw error
  }
}

export const fetchNews = async (category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/news/${encodeURIComponent(category)}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching news ${category}`, error)
    throw error
  }
}

export const fetchNews2 = async (category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/news2/${encodeURIComponent(category)}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching news ${category}`, error)
    throw error
  }
}

export const fetchCurrencyGold = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/currency/gold`)
    return response.data
  } catch (error) {
    console.error(`Error fetching gold currency data:`, error)
    throw error
  }
}

export const fetchCurrencyCrypto = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/currency/crypto`)
    return response.data
  } catch (error) {
    console.error(`Error fetching crypto currency data:`, error)
    throw error
  }
}

export const fetchCurrencyMoney = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/currency/money`)
    return response.data
  } catch (error) {
    console.error(`Error fetching money currency data:`, error)
    throw error
  }
}

// getManuelHaber fonksiyonunu src klasöründeki dosya yoluna göre düzeltiyorum
export const getManuelHaber = async () => {
  try {
    // Dosya yolunu src/ManuelHaber/ayyildizhaber.json olarak düzeltiyorum
    const response = await axios.get("/src/ManuelHaber/ayyildizhaber.json")

    // Gelen veriyi kontrol etmek için log ekliyorum
    console.log("Manuel haber verisi:", response.data)

    // Veri yapısını TRT haberleri ile uyumlu hale getiriyorum
    if (Array.isArray(response.data)) {
      return response.data.map((haber) => ({
        ...haber,
        // Eksik alanları varsa dolduruyorum
        haber_metni: haber.haber_metni || "",
        haber_link: haber.haber_link || "",
        kategori: haber.kategori || "Genel",
      }))
    }

    return response.data
  } catch (error) {
    console.error(`Manuel haber alırken hata oluştu:`, error)
    console.error(`Hata detayı:`, error.response || error.message)

    // Alternatif yol deniyorum
    try {
      // Alternatif dosya yolu
      const altResponse = await import("../ManuelHaber/ayyildizhaber.json")
      console.log("Alternatif yoldan manuel haber verisi:", altResponse.default)
      return Array.isArray(altResponse.default) ? altResponse.default : [altResponse.default]
    } catch (altError) {
      console.error(`Alternatif yoldan manuel haber alırken hata:`, altError)
      // Hata durumunda boş dizi döndürüyorum ki uygulama çalışmaya devam etsin
      return []
    }
  }
}

export const fetchCurrencyHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/currency/history`)
    return response.data
  } catch (error) {
    console.error(`Error fetching currency history data:`, error)
    throw error
  }
}
