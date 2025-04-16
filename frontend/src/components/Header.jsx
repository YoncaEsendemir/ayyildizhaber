"use client"

import { useEffect, useState } from "react"
import { Container, Row, Col } from "react-bootstrap"
import {Link} from "react-router-dom"
import logo from "../logo/logo.jpg"
import "../style/header.css"
import { useTime, formatTime } from "../utils/timeUtils"

const Header = () => {
  const time = useTime()
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Hide header when scrolled past a certain point
  const headerClass = scrollPosition > 200 ? "header-container hidden" : "header-container"

  return (
    <div className={headerClass}>
      <Container fluid>
        <Row className="align-items-center">
          <Col xs={12} md={4} className="d-flex align-items-center">
            <Link to="/" className="d-flex align-items-center" style={{ textDecoration: 'none', color: 'inherit' }}>
              <img src={logo || "/placeholder.svg"} alt="Logo" className="header-logo" />
              <h1 className="site-name">AY YILDIZ HABER AJANSI</h1>
            </Link>
          </Col>
          <Col xs={12} md={8}>
            <div className="d-flex justify-content-end align-items-center header-right">
       
              <div className="header-badge canli-badge">
                <span className="badge-icon">📺</span>
                <div className="badge-content">
                  <span className="badge-title">CANLI</span>
                  <span className="badge-subtitle">YAYIN</span>
                </div>
              </div>

              <div className="time-widget">
                <div className="time-label">SAAT</div>
                <div className="time-value">{formatTime(time)}</div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Header

