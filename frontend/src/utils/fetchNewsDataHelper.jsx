import { fetchNews2, getNewsByCategory, getAllNews } from "./api"
import { sortNewsData } from "./sortNews"

// Kategori bazlı haber getirme fonksiyonu
export const fetchNewsHelperCategory = async (category, setLoading, setNewsData, setError) => {
  try {
    setLoading(true)
    let trtNewsData = []
    let myNewsData = []

    try {
      // Kategori parametresini kullanarak kendi haberlerimizi getir
      myNewsData = await getNewsByCategory(category)
      console.log("Manuel haberler (myNews):", myNewsData)
    } catch (manuelError) {
      console.error("Manuel haberler yüklenirken hata:", manuelError)
    }

    try {
      // Kategori parametresini kullanarak TRT haberlerini getir
      trtNewsData = await fetchNews2(category)
      console.log("TRT haberler:", trtNewsData)
    } catch (trtError) {
      console.error("TRT haberler yüklenirken hata:", trtError)
    }

    const trtArray = Array.isArray(trtNewsData) ? trtNewsData : trtNewsData ? [trtNewsData] : []
    const myNewsArray = Array.isArray(myNewsData) ? myNewsData : myNewsData ? [myNewsData] : []

    const allNews = [...myNewsArray, ...trtArray]

    if (allNews.length === 0) {
      setError("Hiç haber bulunamadı.")
      return
    }

    // sortNewsData fonksiyonunu kullanarak haberleri sırala
    const sortedData = sortNewsData(allNews)

    setNewsData(sortedData)
    setError(null)
  } catch (error) {
    console.error("Haber alırken hata oluştu:", error.message)
    setError(error.message)
  } finally {
    setLoading(false)
  }
}

// Tüm haberleri getiren fonksiyon
export const fetchNewsHelper = async (setLoading, setNewsData, setError) => {
  try {
    setLoading(true)
    let trtNewsData = []
    let myNewsData = []

    try {
      myNewsData = await getAllNews()
      // Kendi haberlerimize 'myNews' kaynağını ekle
      myNewsData = myNewsData.map((news) => ({ ...news, source: "myNews" }))
      console.log("Manuel haberler (myNews):", myNewsData)
    } catch (manuelError) {
      console.error("Manuel haberler yüklenirken hata:", manuelError)
    }

    try {
      trtNewsData = await fetchNews2(" ")
      // TRT haberlerine 'trt' kaynağını ekle ve kategori ataması yap
      trtNewsData = trtNewsData.map((news) => ({
        ...news,
        source: "trt",
        kategori: news.kategori || "Genel Haberler", // Kategori yoksa "Genel Haberler" olarak ata
      }))
      console.log("TRT haberler:", trtNewsData)
    } catch (trtError) {
      console.error("TRT haberler yüklenirken hata:", trtError)
    }

    const trtArray = Array.isArray(trtNewsData) ? trtNewsData : trtNewsData ? [trtNewsData] : []
    const myNewsArray = Array.isArray(myNewsData) ? myNewsData : myNewsData ? [myNewsData] : []
    const allNews = [...myNewsArray, ...trtArray]

    if (allNews.length === 0) {
      setError("Hiç haber bulunamadı.")
      return
    }

    // sortNewsData fonksiyonunu kullanarak haberleri sırala
    const sortedData = sortNewsData(allNews)

    setNewsData(sortedData)
    setError(null)
  } catch (error) {
    console.error("Haber alırken hata oluştu:", error.message)
    setError(error.message)
  } finally {
    setLoading(false)
  }
}

// Haberleri kategorilere ayıran yardımcı fonksiyon
export const categorizeNews = (newsData) => {
  const categorized = {}
  const categoryList = []

  newsData.forEach((news) => {
    const category = news.kategori || "Diğer" // Bu satır artık TRT haberleri için "Diğer" atamayacak
    // çünkü yukarıda varsayılan kategori ataması yapıldı.

    if (!categorized[category]) {
      categorized[category] = []
      categoryList.push(category)
    }

    categorized[category].push(news)
  })

  return { categorizedNews: categorized, categories: categoryList }
}

