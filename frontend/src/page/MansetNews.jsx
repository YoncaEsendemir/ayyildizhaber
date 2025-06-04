"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col } from "react-bootstrap"
import "../style/home.css"
import CarouselHome from "../components/CarouselHome"
import CurrencyRates from "../components/CurrencyRates"
import VideoComponent from "../components/VideoComponent"
import CardGridLayout from "../components/CardGridLayout"
import FirstGroup from "../components/FirstGroup"
import SecondGroup from "../components/SecondGroup"
import LiveTv from "../components/LiveTv"
import ThirdGroup from "../components/ThirdGroup"
import { fetchNews2 } from "../utils/api";
import { sortNewsData } from "../utils/sortNews"; 
import "bootstrap/dist/css/bootstrap.min.css"


function MansetNews() {
  const [newsData, setNewsData] = useState([])
 const [loading,setLoading] = useState(true)
 const [error,setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
        try{
          setLoading(true);
          const data = await fetchNews2("manset");
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
    const groupSize = Math.ceil(newsData.length /7); // Her grup için haber sayısını hesapla
    const group1 = newsData.slice(0, groupSize); // İlk grup
    const group2 = newsData.slice(groupSize, groupSize * 2); // İkinci grup
    const group3 = newsData.slice(groupSize * 2, groupSize * 3); // Üçüncü grup
    const group4 = newsData.slice(groupSize * 3, groupSize * 4); // Dördüncü grup
    const group5 = newsData.slice(groupSize * 4, groupSize * 5); // Beşinci grup
    const group6 = newsData.slice(groupSize * 5); // altıncı grup



  return (
    <Container>
      {/* Breaking News Ticker */}

      {/* Main News Carousel */}
      <section className="main-carousel">
        <CarouselHome items={group1} cardItems={group2} />
      </section>

      <div className="currency-bar">
        {/* Currency Rates */}
        <CurrencyRates />
      </div>

      {/* News Grid Section */}
      <CardGridLayout items={group3} />

      {/* News Categories */}
      <section className="news-categories">
        <Container fluid>
          <Row>
            {/* Left Column - Main News */}
            <Col lg={8} md={7}>
              {/* GÜNDEM Section */}
              <div className="category-section">
           
                <FirstGroup items={group4} />
              </div>
              {/* EKONOMİ Section */}
              <div className="category-section">
          
                <SecondGroup items={group5} />
              </div>
            </Col>

            {/* Right Column - Sidebar */}
            <Col lg={4} md={5}>
              {/* Video News */}
              <VideoComponent />

              {/* Live TV */}
              <LiveTv />
            </Col>

            <Col lg={12} md={12}>
              {/* SPOR Section */}
              <div className="category-section">
                <h2 className="category-title">Manşet Haberler</h2>
                <ThirdGroup items={group6} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Container>
  )
}

export default MansetNews

