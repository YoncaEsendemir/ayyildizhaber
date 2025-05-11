"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col } from "react-bootstrap"
import "../style/home.css"
import VideoComponent from "../components/VideoComponent"
import FirstGroup from "../components/FirstGroup"
import SecondGroup from "../components/SecondGroup"
import ThirdGroup from "../components/ThirdGroup"
import { fetchNewsHelperCategory } from "../utils/fetchNewsDataHelper"

function SportCategory() {
  const [newsData, setNewsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // "spor" kategorisindeki haberleri getir
    fetchNewsHelperCategory("spor", setLoading, setNewsData, setError)
  }, [])

  if (loading) {
    return <div className="text-center my-5">Haberler yükleniyor...</div>
  }

  if (error) {
    return <div className="text-center my-5 text-danger">Hata: {error}</div>
  }

  if (newsData.length === 0) {
    return <div className="text-center my-5">Spor haberleri bulunamadı.</div>
  }

  // Gruplama işlemi
  const groupSize = Math.ceil(newsData.length / 3)
  const firstGroup = newsData.slice(0, groupSize)
  const secondGroup = newsData.slice(groupSize, groupSize * 2)
  const thirdGroup = newsData.slice(groupSize * 2)

  return (
    <Container>
      {/* Main News Carousel */}
      <section className="main-carousel">
        <Container fluid>
          <Row>
            <Col md={12} className="px-md-3">
              <ThirdGroup items={thirdGroup} />
            </Col>
          </Row>
        </Container>
      </section>

      {/* News Categories */}
      <section className="news-categories">
        <Container fluid>
          <Row>
            <Col lg={8} md={7} sm={12}>
              <div className="category-section">
                <h2 className="category-title">Son Spor Haberleri</h2>
                <FirstGroup items={firstGroup} />
              </div>
              <div className="category-section">
                <h2 className="category-title">Diğer Spor Haberleri</h2>
                <SecondGroup items={secondGroup} />
              </div>
            </Col>

            <Col lg={4} md={5} sm={12}>
              <VideoComponent />
            </Col>
          </Row>
        </Container>
      </section>
    </Container>
  )
}

export default SportCategory
