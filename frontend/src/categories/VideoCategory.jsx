"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col } from "react-bootstrap"
import "../style/home.css"
import CardGridLayout from "../components/CardGridLayout"
import ThirdGroup from "../components/ThirdGroup"
import SliderGroup from "../components/SliderGroup"
import imageEkonomi from "../images/ekono.jpg"
import imageSpor from "../images/spor.jpg"
import imageMoney from "../images/gundem.jpg"

// This function would be replaced with your actual API call
const fetchNewsData = async () => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        newsData: [
          {
            id: 1,
            title: "Merkez Bankası faiz kararını açıkladı",
            image: imageMoney,
            url: "/haber/faiz-karari",
          },
          {
            id: 2,
            title: "Yeni çıkan kitaplar: Mart ayının en çok satanları",
            image: imageEkonomi,
            url: "/haber/kitaplar",
          },
          {
            id: 3,
            title: "İstanbul'da bu hafta sonu gidilecek etkinlikler",
            image: imageEkonomi,
            url: "/haber/etkinlikler",
          },
        ],
        cultureNewsItems: [
          {
            id: 1,
            title: "İstanbul'da bu hafta sonu gidilecek kültür etkinlikleri",
            image: imageEkonomi,
            url: "/haber/kultur-etkinlik",
          },
          {
            id: 2,
            title: "Yeni çıkan kitaplar: Mart ayının en çok satan kültür eserleri",
            image: imageEkonomi,
            url: "/haber/kultur-kitap",
          },
          {
            id: 3,
            title: "Türkiye'nin en büyük kültür festivali başlıyor",
            image: imageSpor,
            url: "/haber/kultur-festival",
          },
          {
            id: 4,
            title: "Ünlü ressam İstanbul'da sergi açtı",
            image: imageSpor,
            url: "/haber/kultur-sergi",
          },
          {
            id: 5,
            title: "Tarihi eserler müzede sergilenmeye başladı",
            image: imageMoney,
            url: "/haber/kultur-muze",
          },
          {
            id: 6,
            title: "Yeni tiyatro sezonu oyunları belli oldu",
            image: imageMoney,
            url: "/haber/kultur-tiyatro",
          },
        ],
      })
    }, 1000) // Simulating network delay
  })
}
function VideoCategory() {
  const [newsData, setNewsData] = useState([])
  const [cultureNewsItems, setCultureNewsItems] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchNewsData()
      setNewsData(data.newsData)
      setCultureNewsItems(data.cultureNewsItems)
    }
    loadData()
  }, [])

  return (
    <Container>
      {/* Main News Carousel */}
      <section className="main-carousel">
        <Container fluid>
          <Row>
            <Col md={12} className="px-md-3">
              <ThirdGroup items={cultureNewsItems} />
            </Col>
          </Row>
        </Container>
      </section>

      {/* News Categories */}
      <section className="news-categories">
        <Container fluid>
          <Row>
            {/* Left Column - Main News */}
            <Col lg={8} md={12} sm={12}>
              {/* GÜNDEM Section */}
              <div className="category-section">
                <h2 className="category-title">Başlik</h2>
                <SliderGroup items={cultureNewsItems} />
              </div>
            </Col>

            <Col lg={12} md={12}>
              {/* SPOR Section */}
              <div className="category-section">
                <h2 className="category-title">Başlik</h2>
                <ThirdGroup items={cultureNewsItems} />
              </div>
              {/* KÜLTÜR Section */}
              <div className="category-section">
                <h2 className="category-title">Başlik</h2>
                <SliderGroup items={cultureNewsItems} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="news-grid-section mt-3">
        <Container fluid>
          <Row>
            <Col md={12} className="px-md-3">
              {/* News Grid Section */}
              <CardGridLayout items={newsData} />
            </Col>
          </Row>
        </Container>
      </section>
    </Container>
  )
}

export default VideoCategory

