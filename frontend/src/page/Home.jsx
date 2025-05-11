"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col } from "react-bootstrap"
import "../style/home.css"
import CarouselHome from "../components/CarouselHome"
import CurrencyRatesHome from "../components/CurrencyRatesHome"
import CardGridLayout from "../components/CardGridLayout"
import FirstGroup from "../components/FirstGroup"
import SecondGroup from "../components/SecondGroup"
import ThirdGroup from "../components/ThirdGroup"
import { fetchNewsHelper, categorizeNews } from "../utils/fetchNewsDataHelper"
import "bootstrap/dist/css/bootstrap.min.css"

function HomePage() {
  const [newsData, setNewsData] = useState([])
  const [categorizedNews, setCategorizedNews] = useState({})
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [trtNews, setTrtNews] = useState([])
  const [myNews, setMyNews] = useState([])

  useEffect(() => {
    // Tüm haberleri getir
    fetchNewsHelper(setLoading, setNewsData, setError).then(() => {
      // fetchNewsHelper içinde setNewsData çağrıldığı için
      // burada newsData güncellenmiş olacak, ancak state güncellemeleri
      // asenkron olduğu için doğrudan newsData'yı kullanamayız
    })
  }, [])

  // newsData değiştiğinde kategorilere ayır
  useEffect(() => {
    if (newsData.length > 0) {
      const { categorizedNews: catNews, categories: cats } = categorizeNews(newsData)
      setCategorizedNews(catNews)
      setCategories(cats)

      // TRT ve kendi haberlerimizi ayır (opsiyonel)
      // Bu kısmı API'nizin döndürdüğü verilere göre düzenlemeniz gerekebilir
      const trtItems = newsData.filter((item) => item.source === "trt" || item.kaynak === "trt")
      const myItems = newsData.filter((item) => item.source !== "trt" && item.kaynak !== "trt")

      setTrtNews(trtItems)
      setMyNews(myItems)
    }
  }, [newsData])

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
      {/* Debug bilgileri */}
      <div className="debug-info" style={{ display: "none" }}>
        <p>TRT Haberler: {trtNews.length}</p>
        <p>Kendi Haberlerim: {myNews.length}</p>
        <p>Toplam Haberler: {newsData.length}</p>
        <p>Kategoriler: {categories.join(", ")}</p>
        <p>Resim Yolları: {JSON.stringify(newsData.slice(0, 2).map((item) => item.resim_link))}</p>
      </div>

      {/* Main News Carousel - Tüm haberleri göster */}
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
              {sortedCategories.map((category, index) => {
                // Kategorideki haber sayısını kontrol et
                if (!categorizedNews[category] || categorizedNews[category].length === 0) {
                  return null
                }

                return (
                  <div key={category} className="category-section mb-5">
                    <h2 className="category-title border-bottom pb-2 mb-4">
                      {category.toUpperCase()} ({categorizedNews[category].length})
                    </h2>
                    {index % 3 === 0 ? (
                      <FirstGroup items={categorizedNews[category].slice(0, 6)} />
                    ) : index % 3 === 1 ? (
                      <SecondGroup items={categorizedNews[category].slice(0, 6)} />
                    ) : (
                      <ThirdGroup items={categorizedNews[category].slice(0, 6)} />
                    )}
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

export default HomePage
