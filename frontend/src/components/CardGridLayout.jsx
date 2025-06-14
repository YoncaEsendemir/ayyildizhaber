

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getFullImageUrl } from "../utils/fotoUrl"


function CardGridLayout({ items }) {
  const navigate = useNavigate();

  const handleNewsClick = (news) => {
    navigate(`/haber-icerik`, { state: { news } });
  }

  return (
    <Container fluid>
      <Row className="g-5 mb-5 my-1">
        {items.slice(0, 9).map((news, index) => (
          <Col xs={12} sm={6} md={4} lg={4} key={index}>
            <Col className="news-grid-item">
              <a onClick={() => handleNewsClick(news)} style={{ cursor: "pointer" }} role="button" className="news-list-item position-relative w-100 h-100">
                <Col className="news-grid-img" >
                  <img                   src={
                    typeof news.resim_link === "string" && news.resim_link.startsWith("/")
                      ? `http://45.147.47.55:5000/api${news.resim_link}`
                      : news.resim_link || "/placeholder.svg"
                  } alt={`News ${news.haber_id}`} />
                </Col>
                <Col className="news-grid-content">
                  <h4 className="fs-5">
                    {news.baslik}
                  </h4>
                </Col>
              </a>
            </Col>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default CardGridLayout

