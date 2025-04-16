const newsDataService = require("../services/fetchNewsDataService")

// Genel haberleri döndür
const getNewsByCategory = async (req, res) => {
  const categoryName = req.params.category
  console.log(`Controller: Kategori isteği alındı: ${categoryName}`)

  try {
    const newsData = await newsDataService.getNewsByCategory(categoryName)
    console.log(`Controller: Veri başarıyla alındı, yanıt gönderiliyor`)
    res.json(newsData)
  } catch (error) {
    console.error("Controller: Hata oluştu:", error.message)
    res.status(500).json({ error: "Veri alınamadı" })
  }
}

module.exports = {
  getNewsByCategory,
}

