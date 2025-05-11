import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import "../style/newsContet.css";
import { Container, Button, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";


const NewsContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const news = location.state?.news;

  if (!news) {
    return <h2>Haber bulunamadı!</h2>;
  }

  return (
    <Container className="news-container">
      <Row>
        <Col className="news-col">
          <div className="news-card ">
            <div>
              <h3 className="mt-3 py-3 px-3  news-title">{news.baslik}</h3>

              <div className="news-content mt-3 py-3 px-3">
                {news.ozet}
              </div>

              <img className="news-image py-3 px-3"                     src={
                    typeof news.resim_link === "string" && news.resim_link.startsWith("/")
                      ? `http://localhost:5000${news.resim_link}`
                      : news.resim_link || "/placeholder.svg"
                  }/>
            </div>
            <div
              className="news-content mt-3 py-3 px-3"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.haber_metni) }}
            ></div>

            <div>
              <Button variant="primary" className="back-btn my-4 mt-3 " onClick={() => navigate(-1)}>
                Geri Dön
              </Button>

              <div className="news-date">
                {news.haber_tarihi}
              </div>
            </div>

          </div>
        </Col>

      </Row>
    </Container>
  );
};

export default NewsContent;