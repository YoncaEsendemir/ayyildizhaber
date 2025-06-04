"use client"
import Carousel from "react-bootstrap/Carousel"
import { Row, Col, Container } from "react-bootstrap"
import "../App.css"
import "../style/carouselStyles.css"
import { Link } from "react-router-dom"
import { useState } from "react"
import {getFullImageUrl} from "../utils/fotoUrl"

function CarouselHome({ items }) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Carousel'ın aktif slide'ını değiştiren fonksiyon
  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex)
  }

  return (
    <Container fluid className="px-2 my-3">
      <Row className="g-2">
        <Col lg={12} md={6} sm={12}>
          <Carousel
            data-bs-theme="dark"
            className="w-100 carousel-main"
            activeIndex={activeIndex}
            onSelect={handleSelect}
          >
            {items.map((news, index) => (
              <Carousel.Item key={index}>
                <Link
                  to="/haber-icerik"
                  state={{ news }}
                  className="news-list-item position-relative text-decoration-none"
                >
                  <img
                    className="d-block w-100"
                    src={
                      typeof news.resim_link === "string" && news.resim_link.startsWith("/")
                        ? `http://localhost:5000${news.resim_link}`
                        : news.resim_link || "/placeholder.svg"
                    }
                    alt={news.alt || `Slide ${index + 1}`}
                    style={{ height: "480px", objectFit: "cover" }}
                  />
                  <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-2">
                    <h5 className="text-white">{news.baslik || `Slide ${news.haber_id}`}</h5>
                    <p className="text-white mb-0">{news.ozet || "Açıklama"}</p>
                  </Carousel.Caption>
                </Link>
              </Carousel.Item>
            ))}
          </Carousel>
          <div className="carousel-indicators-numbers d-flex justify-content-center mt-2">
            {items.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`btn ${index === activeIndex ? "btn-danger" : "btn-light"} border mx-1`}
                style={{
                  minWidth: "40px",
                  padding: "8px 0",
                  fontWeight: "bold",
                }}
                onClick={() => setActiveIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default CarouselHome
