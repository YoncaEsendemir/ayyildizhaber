import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../style/home.css";
import ThirdGroup from "../components/ThirdGroup";
import SliderGroup from "../components/SliderGroup";
import { fetchNews2, getAllNews } from "../utils/api"; 
import { sortNewsData } from "../utils/sortNews";

function Politic() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [myNews, fetched] = await Promise.all([
          getAllNews(),
          fetchNews2("siyaset"),
        ]);

        const myNewsArray = Array.isArray(myNews) ? myNews : [myNews];
        const fetchedArray = Array.isArray(fetched) ? fetched : [fetched];

        if (fetchedArray.length === 0 && manuelArray.length === 0)
          throw new Error("Hiç haber bulunamadı");

        // Manuel haberler en başta olacak şekilde birleştir
        const combinedData = [...myNewsArray, ...fetchedArray];

        const sortedData = sortNewsData(combinedData);
        setNewsData(sortedData);
        setError(null);
      } catch (error) {
        console.error("Haber alırken hata oluştu:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="text-center my-5">Haberler yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center my-5 text-danger">Hata: {error}</div>;
  }

  if (newsData.length === 0) {
    return <div className="text-center my-5">Siyaset haberleri bulunamadı.</div>;
  }

  // Veriyi gruplara böl
  const groupSize = Math.ceil(newsData.length / 4);
  const group1 = newsData.slice(0, groupSize);
  const group2 = newsData.slice(groupSize, groupSize * 2);
  const group3 = newsData.slice(groupSize * 2);

  return (
    <Container>
      <section className="main-carousel">
        <Container fluid>
          <Row>
            <Col md={12} className="px-md-3">
              <div className="category-section">
                <SliderGroup items={group1} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="news-categories">
        <Container fluid>
          <Row>
            <Col lg={12} md={12}>
              <div className="category-section">
                <ThirdGroup items={group2} />
              </div>
              <div className="category-section">

                <SliderGroup items={group3} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Container>
  );
}

export default Politic;
