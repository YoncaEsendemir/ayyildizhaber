"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col } from "react-bootstrap"
import "../style/home.css"
import CardGridLayout from "../components/CardGridLayout"
import ThirdGroup from "../components/ThirdGroup"
import SliderGroup from "../components/SliderGroup"


// This function would be replaced with your actual API call
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

