import { useState, useEffect } from "react"
import { Container, Row, Col } from "react-bootstrap"
import "../style/home.css"
import CurrencyRates from "../components/CurrencyRates"
import CardGridLayout from "../components/CardGridLayout"
import SecondGroup from "../components/SecondGroup"
import ThirdGroup from "../components/ThirdGroup"
import { fetchNews2 } from "../utils/api";
import { sortNewsData } from "../utils/sortNews"; 

function Education(){
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const loadData = async () => {
        try {
          setLoading(true);
          const data = await fetchNews2("egitim");
          console.log("Gelen Veri:", data); // API'den dönen veriyi kontrol et
  
          if (!data) {
            throw new Error("Veri alınamadı");
          }
  
          // Veri bir dizi değilse, dizi içine al
          const dataArray = Array.isArray(data) ? data : [data];
  
          if (dataArray.length === 0) {
            throw new Error("Hiç haber bulunamadı");
          }
  
          // Use the sortNewsData function to sort the data
          const sortedData = sortNewsData(dataArray);
  
          setNewsData(sortedData);
          setError(null);
        } catch (error) {
          console.error(`Haber alırken hata oluştu:`, error.message);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      loadData();
    }, []);
  
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
    const groupSize = Math.ceil(newsData.length /3); // Her grup için haber sayısını hesapla
    const group1 = newsData.slice(0, groupSize); // İlk grup
    const group2 = newsData.slice(groupSize, groupSize * 2); // İkinci grup
    const group3 = newsData.slice(groupSize * 2); // Üçüncü grup
  
  
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
          <CurrencyRates />
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
              <Col lg={8} md={12} sm={12}>
                {/* EKONOMİ Section */}
                <div className="category-section">
                  <h2 className="category-title">Başlik</h2>
                  <SecondGroup items={group3} />
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </Container>
    )
  }

export default Education