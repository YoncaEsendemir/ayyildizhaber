const newsService = require("../services/fetchNewsByDataService")

const getNews = async (req, res) => {
  const categoryName = req.params.category
  console.log(`Controller: Kategori isteği alındı: ${categoryName}`)

  try {
    const newsData = await newsService.fetchNews(categoryName)

    // Veri kontrolü
    if (!newsData) {
      console.error("Controller: Veri alınamadı")
      return res.status(500).json({ error: "Veri alınamadı" })
    }

    // Veri bir dizi değilse, dizi içine al
    const dataArray = Array.isArray(newsData) ? newsData : [newsData]

    console.log(`Controller: Veri başarıyla alındı, ${dataArray.length} haber gönderiliyor`)
    res.status(200).json(dataArray)
  } catch (error) {
    console.error("Controller: Hata oluştu:", error.message)
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getNews }
/*

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

 */