"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Badge } from "react-bootstrap"
import { FaChevronRight, FaChevronLeft } from "react-icons/fa"
import "../style/home.css"
import CarouselHome from "../components/CarouselHome"
import CurrencyRatesHome from "../components/CurrencyRatesHome"
import VideoComponent from "../components/VideoComponent"
import CardGridLayout from "../components/CardGridLayout"
import FirstGroup from "../components/FirstGroup"
import SecondGroup from "../components/SecondGroup"
import LiveTv from "../components/LiveTv"
import ThirdGroup from "../components/ThirdGroup"
import { fetchNews2 } from "../utils/api";
import { sortNewsData } from "../utils/sortNews"; 
import "bootstrap/dist/css/bootstrap.min.css"
import "../style/home.css"


function HomePage() {
  const [newsData, setNewsData] = useState([])
 const [loading,setLoading] = useState(true)
 const [error,setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
        try{
          setLoading(true);
          const data = await fetchNews2(" ");
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
    const groupSize = Math.ceil(newsData.length /4); // Her grup için haber sayısını hesapla
    const group1 = newsData.slice(0, groupSize); // İlk grup
    const group2 = newsData.slice(groupSize, groupSize * 2); // İkinci grup
    const group3 = newsData.slice(groupSize * 2, groupSize * 3); // Üçüncü grup
    const group4 = newsData.slice(groupSize * 3); // Dördüncü grup






  return (
    <Container>
      {/* Breaking News Ticker */}

      {/* Main News Carousel */}
      <section className="main-carousel">
        <CarouselHome items={newsData}  />
      </section>

      <div className="currency-bar">
        {/* Currency Rates */}
        <CurrencyRatesHome />
      </div>

      {/* News Grid Section */}
      <CardGridLayout items={group1} />

      {/* News Categories */}
      <section className="news-categories">
        <Container fluid>
          <Row>
            {/* Left Column - Main News */}
            <Col lg={12} md={6}>
              {/* GÜNDEM Section */}
              <div className="category-section">
                <h2 className="category-title">Ana Sayfa</h2>
                <FirstGroup items={group2} />
              </div>
              {/* EKONOMİ Section */}
              <div className="category-section">
                <h2 className="category-title">EKONOMİ</h2>
                <SecondGroup items={group3} />
              </div>
            </Col>

           {           
            /* Right Column - Sidebar */
      //      <Col lg={4} md={5}>
              /* Video News */
           //   <VideoComponent />

              /* Live TV */
            //  <LiveTv />
          //  </Col>
           }
            <Col lg={12} md={6}>
              {/* SPOR Section */}
              <div className="category-section">
                <h2 className="category-title">SPOR</h2>
                <ThirdGroup items={group4} />
              </div>

            </Col>
          </Row>
        </Container>
      </section>
    </Container>
  )
}

export default HomePage

