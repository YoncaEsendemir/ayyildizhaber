"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col } from "react-bootstrap"
import "../style/home.css"
import ThirdGroup from "../components/ThirdGroup"
import SliderGroup from "../components/SliderGroup"
import { fetchNewsHelperCategory } from "../utils/fetchNewsDataHelper"

// This function would be replaced with your actual API call

function WorldCategory() {
  
  const [newsData, setNewsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // "spor" kategorisindeki haberleri getir
    fetchNewsHelperCategory("dunya", setLoading, setNewsData, setError)
  }, [])
    // Veri yoksa veya yükleniyorsa yükleniyor mesajı göster
    if (loading) {
      return <div className="text-center my-5">Haberler yükleniyor...</div>;
    }

 // Veri yoksa veya yükleniyorsa yükleniyor mesajı göster
 if (loading) {
  return <div className="text-center my-5">Haberler yükleniyor...</div>;
}

// Hata varsa hata mesajı göster
if (error) {
  return <div className="text-center my-5 text-danger">Hata: {error}</div>;
}

// Veri boşsa mesaj göster
if (newsData.length === 0) {
  return <div className="text-center my-5">Ekonomi haberleri bulunamadı.</div>;
}

  // Veriyi  eşit gruba bölme işlemi
  const groupSize = Math.ceil(newsData.length / 4); // Her grup için haber sayısını hesapla
  const group1 = newsData.slice(0, groupSize); // İlk grup
  const group2= newsData.slice(groupSize, groupSize * 2); // İkinci grup
  const group3 = newsData.slice(groupSize * 2); // Üçüncü grup




  return (
    <Container>
      {/* Main News Carousel */}
      <section className="main-carousel">
        <Container fluid>
          <Row>
            <Col md={12} className="px-md-3">
              <div className="category-section">
                <h2 className="category-title">KÜLTÜR</h2>
                <SliderGroup items={group1} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* News Categories */}
      <section className="news-categories">
        <Container fluid>
          <Row>
            {/* Left Column - Main News */}
            <Col lg={12} md={12}>
              {/* SPOR Section */}
              <div className="category-section">
                <h2 className="category-title">SPOR</h2>
                <ThirdGroup items={group2} />
              </div>
              {/* KÜLTÜR Section */}
              <div className="category-section">
                <h2 className="category-title">KÜLTÜR</h2>
                <SliderGroup items={group3} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Container>
  )
}

export default WorldCategory

