import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../style/home.css";
import CarouselHome from "../components/CarouselHome";
import CurrencyRates from "../components/CurrencyRates";
import FirstGroup from "../components/FirstGroup";
import ThirdGroup from "../components/ThirdGroup";
import BreakingNews from "../components/BreakingNews";
import { fetchNewsHelperCategory } from "../utils/fetchNewsDataHelper"


function EconomyCategory() {
 
  const [newsData, setNewsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // "spor" kategorisindeki haberleri getir
    fetchNewsHelperCategory("egıtım", setLoading, setNewsData, setError)
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
  const groupSize = Math.ceil(newsData.length / 3); // Her grup için haber sayısını hesapla
  const group1 = newsData.slice(0, groupSize); // İlk grup
  const group2 = newsData.slice(groupSize, groupSize * 2); // İkinci grup
  const group3 = newsData.slice(groupSize * 2); // Üçüncü grup




  return (
    <Container>
      {/* Breaking News Ticker */}
      <div className="breaking-news">
        <BreakingNews items={group1} />
      </div>

      {/* Main News Carousel */}
      <section className="main-carousel">
        <CarouselHome items={newsData}  />
      </section>

      <div className="currency-bar">
        {/* Currency Rates */}
        <CurrencyRates />
      </div>

      {/* News Categories */}
      <section className="news-categories mt-3">
        <Container fluid>
          <Row>
            {/* Left Column - Main News */}
            <Col lg={12} md={8} sm={12}>
              {/* GÜNDEM Section */}
              <div className="category-section">
                <h2 className="category-title">Ekonomi son Gelişmeler</h2>
                <ThirdGroup items={group2} />
              </div>

              <div className="category-section">

                <FirstGroup items={group3} />
              </div>
            </Col>

            {/* Right Column - Sidebar 
            <Col lg={4} md={5} sm={12}>
              
              <VideoComponent />
            </Col>
           */}
          </Row>
        </Container>
      </section>
    </Container>
  );
}

export default EconomyCategory;
