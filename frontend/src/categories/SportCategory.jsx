import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../style/home.css";
import VideoComponent from "../components/VideoComponent";
import FirstGroup from "../components/FirstGroup";
import SecondGroup from "../components/SecondGroup";
import ThirdGroup from "../components/ThirdGroup";
import { fetchNews2 } from "../utils/api";

function SportCategory() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchNews2("spor");

                //
                if(!data){
                  throw new Error("Veri alınamaz")
                }

                // veri bir dizi değilse, dizi içine al
                const dataArray=Array.isArray(data) ? data : [data]

                if(dataArray.length===0){
                  throw new Error("Hiç haber bulunamadı")
                }

                        // Haberleri ID'lerine göre sıralayalım
        const sortedData = [...dataArray].sort((a, b) => {
          // haber_id string olabilir, sayıya çevirelim
          const idA = Number.parseInt(a.haber_id, 10) || 0
          const idB = Number.parseInt(b.haber_id, 10) || 0
          return idB - idA // En yeni haberler üstte olsun (büyükten küçüğe)
        })
        setNewsData(sortedData);
        setError(null)
      } catch (error) {
        console.error(`Haber alırken hata oluştu:`, error.message)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    loadData();
  }, []);

  // Veri yoksa veya yükleniyorsa yükleniyor mesajı göster
  if (loading) {
    return <div className="text-center my-5">Haberler yükleniyor...</div>
  }

    // Hata varsa hata mesajı göster
    if (error) {
      return <div className="text-center my-5 text-danger">Hata: {error}</div>
    }
  
      // Veri boşsa mesaj göster
  if (newsData.length === 0) {
    return <div className="text-center my-5">Spor haberleri bulunamadı.</div>
  }

  // Veriyi 3 gruba bölme işlemi
  const groupSize = Math.ceil(newsData.length / 3); // Her grup için haber sayısını hesapla
  const firstGroup = newsData.slice(0, groupSize); // İlk grup
  const secondGroup = newsData.slice(groupSize, groupSize * 2); // İkinci grup
  const thirdGroup = newsData.slice(groupSize * 2); // Üçüncü grup

  console.log("Gruplar:", {
    toplam: newsData.length,
    groupSize,
    firstGroup: firstGroup.length,
    secondGroup: secondGroup.length,
    thirdGroup: thirdGroup.length,
  })

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
            {/* Left Column - Main News */}
            <Col lg={8} md={7} sm={12}>
              {/* GÜNDEM Section */}
              <div className="category-section">
                <h2 className="category-title">Son Spor Haberleris</h2>
                <FirstGroup items={firstGroup} />
              </div>
              {/* EKONOMİ Section */}
              <div className="category-section">
                <h2 className="category-title">EKONOMİ</h2>
                <SecondGroup items={secondGroup} />
              </div>
            </Col>

            {/* Right Column - Sidebar */}
            <Col lg={4} md={5} sm={12}>
              {/* Video News */}
              <VideoComponent />
            </Col>
          </Row>
        </Container>
      </section>
    </Container>
  );
}

export default SportCategory;
