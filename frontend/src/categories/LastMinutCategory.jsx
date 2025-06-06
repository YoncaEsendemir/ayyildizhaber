
import { useState, useEffect } from "react"
import { Container, Row, Col } from "react-bootstrap"
import "../style/home.css"
import CurrencyRatesHome from "../components/CurrencyRatesHome"
import CardGridLayout from "../components/CardGridLayout"
import SecondGroup from "../components/SecondGroup"
import ThirdGroup from "../components/ThirdGroup"
import SliderGroup from "../components/SliderGroup"
import { fetchNewsHelperCategory } from "../utils/fetchNewsDataHelper"

// This function would be replaced with your actual API call

function LastMinutCategory() {
  const [newsData, setNewsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // "spor" kategorisindeki haberleri getir
    fetchNewsHelperCategory("son-dakika", setLoading, setNewsData, setError)
  }, [])

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
  const groupSize = Math.ceil(newsData.length /4); // Her grup için haber sayısını hesapla
  const group1 = newsData.slice(0, groupSize); // İlk grup
  const group2 = newsData.slice(groupSize, groupSize * 2); // İkinci grup
  const group3 = newsData.slice(groupSize * 2, groupSize * 3); // Üçüncü grup
  const group4 = newsData.slice(groupSize * 3,); // Dördüncü grup


  return (
    <Container>
      {/* Main News Carousel */}
      <section className="main-carousel">
        <Container fluid>
          <Row>
            <Col md={12} className="px-md-3">
              <ThirdGroup items={group1} />
            </Col>
          </Row>
        </Container>
      </section>

      <div className="currency-bar">
        {/* Currency Rates */}
        <CurrencyRatesHome />
      </div>

      <section className="news-grid-section mt-3">
        {/* News Grid Section */}
        <CardGridLayout items={group2} />
      </section>

      {/* News Categories */}
      <section className="news-categories">
        <Container fluid>
          <Row>
            {/* Left Column - Main News */}
            <Col lg={12} md={6} sm={12}>
              {/* EKONOMİ Section */}
              <div className="category-section">
                <h2 className="category-title">Son Dakika Haberler</h2>
                <SecondGroup items={group3} />
              </div>
            </Col>

            <Col lg={12} md={6} sm={12}>
              {/* KÜLTÜR Section */}
              <div className="category-section">
                <SliderGroup items={group4} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Container>
  )
}

export default LastMinutCategory

