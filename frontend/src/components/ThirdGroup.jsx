import { useState } from "react";
import { Carousel, Container, Row, Col, Card } from "react-bootstrap";
import "../style/home.css";
import { useNavigate } from "react-router-dom";

function ThirdGroup({ items }) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const handleNewsClick = (news) => {
    navigate(`/haber-icerik`, { state: { news } })
  };

  // Haberleri çift ve tek ID'lere göre filtrele
  const evenIdNews = items
    ? items.filter((news) => {
        const id = Number.parseInt(news.haber_id, 10);
        return !isNaN(id) && id % 2 === 0; // Çift ID'ler
      })
    : [];

  const oddIdNews = items
    ? items.filter((news) => {
        const id = Number.parseInt(news.haber_id, 10);
        return !isNaN(id) && id % 2 !== 0; // Tek ID'ler
      })
    : [];

  return items && items.length > 0 ? (
    <Container fluid>
      <Row>
        {/* Slider Bölümü */}
        <Col lg={8} className="thirdGroup-slider">
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            interval={3000}
            controls
            indicators
          >
            {oddIdNews.map((news) => (
              <Carousel.Item key={news.haber_id}>
                <a
                  onClick={() => handleNewsClick(news)}
                  className="news-list-item"
                  role="button"
                  style={{ cursor: "pointer" }}
                >
                  <img
                    className="d-block w-100"
                    src={
                      typeof news.resim_link === "string" && news.resim_link.startsWith("/")
                        ? `http://localhost:5000${news.resim_link}`
                        : news.resim_link || "/placeholder.svg"
                    }
                    alt={news.name}
                  />
                  <Carousel.Caption>
                    <h3>{news.baslik}</h3>
                  </Carousel.Caption>
                </a>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>

        {/* Küçük Haberler Bölümü */}
        <Col lg={4} className="thirdGroup-small-news">
          {evenIdNews.slice(0, 4).map((news) => (
            <a
              onClick={() => handleNewsClick(news)}
              className="news-list-item"
              key={news.haber_id}
              role="button"
              style={{ cursor: "pointer" }}
            >
              <Card className="news-card mb-3">
                <Row className="g-1">
                  <Col md={4}>
                    <Card.Img
                      src={news.resim_link}
                      alt={news.baslik}
                      className="small-news-img"
                    />
                  </Col>
                  <Col md={8}>
                    <Card.Body>
                      <Card.Title className="small-news-title">
                        {news.baslik}
                      </Card.Title>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </a>
          ))}
        </Col>
      </Row>
    </Container>
  ) : (
    <div>boş bardak bir gün taşar</div>
  );
}

export default ThirdGroup;
