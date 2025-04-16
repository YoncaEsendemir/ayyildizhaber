const fetchPrayerTimesService = require("../services/fetchPrayerTimesService")

const getAllPrayerTimes = async (req, res) => {
  try {
    const prayerTimes = await fetchPrayerTimesService.getAllPrayerTimes()
    res.json(prayerTimes)
  } catch (error) {
    console.error("Namaz vakitleri alınırken hata oluştu:", error)
    res.status(500).json({ error: "Veri alınamadı" })
  }
}

const getPrayerTimeByCity = async (req, res) => {
  try {
    const { city } = req.params
    if (!city) {
      return res.status(400).json({ error: "Şehir adı gereklidir." })
    }

    const prayerTime = await fetchPrayerTimesService.getPrayerTimeByCity(city)
    res.json(prayerTime)
  } catch (error) {
    console.error("Şehir bazında namaz vakitleri alınırken hata oluştu:", error)
    res.status(500).json({ error: "Veri alınamadı" })
  }
}

const getTurkeyRegions = async (req, res) => {
  try {
    const regions = await fetchPrayerTimesService.getTurkeyRegions()
    res.json(regions)
  } catch (error) {
    console.error("Türkiye bölgeleri alınırken hata oluştu:", error)
    res.status(500).json({ error: "Veri alınamadı" })
  }
}

module.exports = {
  getAllPrayerTimes,
  getPrayerTimeByCity,
  getTurkeyRegions,
}

