
import { useState, useEffect } from "react"
import { Container, Row, Col } from "react-bootstrap"
import "../style/home.css"
import CarouselHome from "../components/CarouselHome"
import CurrencyRatesHome from "../components/CurrencyRatesHome"
import CardGridLayout from "../components/CardGridLayout"
import FirstGroup from "../components/FirstGroup"
import SecondGroup from "../components/SecondGroup"
import ThirdGroup from "../components/ThirdGroup"
import { fetchNews2, getManuelHaber } from "../utils/api"
import { sortNewsData } from "../utils/sortNews"
import "bootstrap/dist/css/bootstrap.min.css"

function HomePage() {
  const [newsData, setNewsData] = useState([])
  const [categorizedNews, setCategorizedNews] = useState({})
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Manuel haberleri al
        let manuelNews = []
        try {
          manuelNews = await getManuelHaber()
          console.log("Manuel haberler başarıyla yüklendi:", manuelNews)
        } catch (manuelError) {
          console.error("Manuel haberler yüklenirken hata:", manuelError)
        }

        // TRT haberlerini al
        const trtNews = await fetchNews2(" ")
        console.log("TRT haberleri başarıyla yüklendi:", trtNews)

        // Dizilere dönüştür
        const manuelArray = Array.isArray(manuelNews) ? manuelNews : manuelNews ? [manuelNews] : []
        const fetchedArray = Array.isArray(trtNews) ? trtNews : trtNews ? [trtNews] : []

        if (fetchedArray.length === 0 && manuelArray.length === 0) {
          throw new Error("Hiç haber bulunamadı")
        }

        // TRT haberlerini sırala
        const sortedFetched = sortNewsData(fetchedArray)

        // Manuel haberleri başta tut, diğerlerini sırala
        const combinedSorted = [...manuelArray, ...sortedFetched]
        console.log("Birleştirilmiş ve sıralanmış veri:", combinedSorted)

        // Kategorilere göre gruplama
        const newsCategories = {}
        const categoryList = []

        combinedSorted.forEach((news) => {
          const category = news.kategori || "Diğer"

          if (!newsCategories[category]) {
            newsCategories[category] = []
            categoryList.push(category)
          }

          newsCategories[category].push(news)
        })

        setNewsData(combinedSorted)
        setCategorizedNews(newsCategories)
        setCategories(categoryList)
        setError(null)
      } catch (error) {
        console.error("Haber alırken hata oluştu:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])
  // Veri yoksa veya yükleniyorsa yükleniyor mesajı göster
  if (loading) {
    return <div className="text-center my-5">Haberler yükleniyor...</div>
  }

  // Hata varsa hata mesajı göster
  if (error) {
    return <div className="text-center my-5 text-danger">Hata: {error}</div>
  }

  // Veri boşsa mesaj göster
  if (newsData.length === 0) {
    return <div className="text-center my-5">Haberler bulunamadı.</div>
  }

  // Önemli kategorileri önce göster
  const priorityCategories = ["Gündem", "Ekonomi", "Spor", "Dünya", "Sağlık", "Teknoloji"]
  const sortedCategories = [
    ...priorityCategories.filter((cat) => categories.includes(cat)),
    ...categories.filter((cat) => !priorityCategories.includes(cat)),
  ]



  return (
    <Container>
      {/* Main News Carousel */}
      <section className="main-carousel">
        <CarouselHome items={newsData} />
      </section>

      <div className="currency-bar">
        {/* Currency Rates */}
        <CurrencyRatesHome />
      </div>

      {/* İlk 6 haberi CardGridLayout'da göster */}
      <CardGridLayout items={newsData.slice(0, 6)} />

      {/* Kategorilere göre haberler */}
      <section className="news-categories">
        <Container fluid>
          <Row>
            <Col lg={12}>
              {sortedCategories.map((category, index) => (
                <div key={category} className="category-section mb-5">
                  <h2 className="category-title border-bottom pb-2 mb-4">{category.toUpperCase()}</h2>
                  {index % 3 === 0 ? (
                    <FirstGroup items={categorizedNews[category].slice(0, 6)} />
                  ) : index % 3 === 1 ? (
                    <SecondGroup items={categorizedNews[category].slice(0, 6)} />
                  ) : (
                    <ThirdGroup items={categorizedNews[category].slice(0, 6)} />
                  )}
                </div>
              ))}
            </Col>
          </Row>
        </Container>
      </section>
    </Container>
  )
}

export default HomePage
  