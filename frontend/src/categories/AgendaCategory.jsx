import { useState, useEffect } from "react"
import { Container, Row, Col } from "react-bootstrap"
import "../style/home.css"
import CardGridLayout from "../components/CardGridLayout"
import FirstGroup from "../components/FirstGroup"
import ThirdGroup from "../components/ThirdGroup"
import SliderGroup from "../components/SliderGroup"
import { fetchNews2, getManuelHaber } from "../utils/api"
import { sortNewsData } from "../utils/sortNews"

function AgendaCategory() {
  const [newsData, setNewsData] = useState([])
  const [categorizedNews, setCategorizedNews] = useState({})
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        let manuelNews = []
        try {
          manuelNews = await getManuelHaber()
          console.log("Manuel haberler:", manuelNews)
        } catch (manuelError) {
          console.error("Manuel haber yüklenemedi:", manuelError)
        }

        const trtNews = await fetchNews2("gundem")
        console.log("TRT gündem haberleri:", trtNews)

        const manuelArray = Array.isArray(manuelNews) ? manuelNews : manuelNews ? [manuelNews] : []
        const trtArray = Array.isArray(trtNews) ? trtNews : trtNews ? [trtNews] : []

        if (manuelArray.length === 0 && trtArray.length === 0) {
          throw new Error("Hiç haber bulunamadı.")
        }

        const sortedFetched = sortNewsData(trtArray)
        const combinedNews = [...manuelArray, ...sortedFetched]

        // Kategorilere göre ayır
        const grouped = {}
        const categoryNames = []

        combinedNews.forEach((news) => {
          const category = news.kategori || "Diğer"
          if (!grouped[category]) {
            grouped[category] = []
            categoryNames.push(category)
          }
          grouped[category].push(news)
        })

        setNewsData(combinedNews)
        setCategorizedNews(grouped)
        setCategories(categoryNames)
        setError(null)
      } catch (err) {
        console.error("Haber yüklenemedi:", err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) return <div className="text-center my-5">Haberler yükleniyor...</div>
  if (error) return <div className="text-center my-5 text-danger">Hata: {error}</div>
  if (newsData.length === 0) return <div className="text-center my-5">Haber bulunamadı.</div>

  return (
    <Container>
      {/* Öne çıkan haberler */}
      <CardGridLayout items={newsData.slice(0, 6)} />

      {/* Kategorilere göre render */}
      <section className="news-categories">
        <Container fluid>
          <Row>
            <Col lg={12}>
              {categories.map((category, index) => {
                const items = categorizedNews[category]
                let GroupComponent
                if (index % 3 === 0) {
                  GroupComponent = FirstGroup
                } else if (index % 3 === 1) {
                  GroupComponent = ThirdGroup
                } else {
                  GroupComponent = SliderGroup
                }

                return (
                  <div key={category} className="category-section mb-5">
                    <h2 className="category-title border-bottom pb-2 mb-4">
                      {category.toUpperCase()}
                    </h2>
                    <GroupComponent items={items.slice(0, 6)} />
                  </div>
                )
              })}
            </Col>
          </Row>
        </Container>
      </section>
    </Container>
  )
}

export default AgendaCategory
