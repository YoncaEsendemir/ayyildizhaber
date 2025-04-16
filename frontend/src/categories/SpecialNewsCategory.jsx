"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Badge } from "react-bootstrap"
import { FaChevronRight, FaChevronLeft } from "react-icons/fa"
import "../style/home.css"
import CarouselHome from "../components/CarouselHome"
import BreakingNews from "../components/BreakingNews";
import VideoComponent from "../components/VideoComponent"
import CardGridLayout from "../components/CardGridLayout"
import FirstGroup from "../components/FirstGroup"
import SecondGroup from "../components/SecondGroup"
import LiveTv from "../components/LiveTv"
import SliderGroup from "../components/SliderGroup"
import { fetchNews2 } from "../utils/api";
import { sortNewsData } from "../utils/sortNews"; 

// This function would be replaced with your actual API call


function SpecialNewsCategory() {
    const [newsData, setNewsData] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
  
    useEffect(() => {
      const loadData = async () => {
        try {
          setLoading(true)
          const data = await fetchNews2("gundem")
          console.log("Gelen veri:", data)
  
          if (!data) {
            throw new Error("Veri alınamadı")
          }
          // Veri bir dizi değilse, dizi içine al
          const dataArray = Array.isArray(data) ? data : [data];
  
          if (dataArray.length === 0) {
            throw new Error("Hiç haber bulunamadı");
          }
  
  
          //Veri bir dizi değilse dizi içine al 
          const sortedData = sortNewsData(dataArray);
          setNewsData(sortedData);
          setError(null);
        }
        catch (error) {
          console.error('Haber alırken hata oluştu', error.message)
          setError(error.message)
        }
        finally {
          setLoading(false);
        }
      }
      loadData()
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
      return <div className="text-center my-5">Gündem haberleri bulunamadı.</div>;
    }
  
    // Veriyi eşit gruba bölme işlemi
    const groupSize = Math.ceil(newsData.length /7); // Her grup için haber sayısını hesapla
    const group1 = newsData.slice(0, groupSize); // İlk grup
    const group2 = newsData.slice(groupSize, groupSize * 2); // İkinci grup
    const group3 = newsData.slice(groupSize * 2, groupSize * 3); // Üçüncü grup
    const group4 = newsData.slice(groupSize * 3, groupSize * 4); // Dördüncü grup
    const group5 = newsData.slice(groupSize * 4, groupSize * 5); // Dördüncü grup
    const group6 = newsData.slice(groupSize * 5, groupSize * 6); // Dördüncü grup
    const group7 = newsData.slice(groupSize * 6, groupSize * 7); // Dördüncü grup


  return (
    <Container>
      {/* Breaking News Ticker */}
      <div className="breaking-news">
        <BreakingNews items={group1} />
      </div>

      {/* Main News Carousel */}
      <section className="main-carousel">
        <CarouselHome items={group2} cardItems={group3} />
      </section>

      {/* News Grid Section */}
      <CardGridLayout items={group4} />

      {/* News Categories */}
      <section className="news-categories">
        <Container fluid>
          <Row>
            {/* Left Column - Main News */}
            <Col lg={8} md={7}>
              {/* GÜNDEM Section */}
              <div className="category-section">
                <h2 className="category-title">GÜNDEM</h2>
                <FirstGroup items={group5} />
              </div>
              {/* EKONOMİ Section */}
              <div className="category-section">
                <h2 className="category-title">EKONOMİ</h2>
                <SecondGroup items={group6} />
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
              {/* KÜLTÜR Section */}
              <div className="category-section">
                <h2 className="category-title">KÜLTÜR</h2>
                <SliderGroup items={group7} />
              </div>
              {/* Columnist Section */}
              <div className="columnist-section">
                <h2 className="category-title">YAZARLARIMIZ</h2>
                <div className="columnist-carousel">
                  <button className="columnist-nav prev">
                    <FaChevronLeft />
                  </button>
                  <div className="columnist-container">
                    <Row>
                      {[
                        { name: "Bülent Erandaç", title: "Yolun açık olsun Türkiye" },
                        { name: "Ekrem Kızıltaş", title: "Olacak olan oluyor..." },
                        { name: "Nihat Hatipoğlu", title: "Cennetin kapıları açıldı" },
                        { name: "Melih Altınok", title: "Vahşi Batı ve şemsiye" },
                        { name: "Erhan Afyoncu", title: "Osmanlı'da iftar, ilk üç gün aile..." },
                        { name: "Haşmet Babaoğlu", title: "Kalabalık içinde yalnızlık meselesi" },
                      ].map((columnist, index) => (
                        <Col xs={4} sm={4} md={2} key={index}>
                          <div className="columnist-item">
                            <div className="columnist-avatar">
                              <img
                                src={`/placeholder.svg?height=80&width=80`}
                                alt={columnist.name}
                                className="rounded-circle"
                                width={80}
                                height={80}
                              />
                            </div>
                            <h4 className="columnist-name">{columnist.name}</h4>
                            <p className="columnist-title">{columnist.title}</p>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                  <button className="columnist-nav next">
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Container>
  )
}

export default SpecialNewsCategory

