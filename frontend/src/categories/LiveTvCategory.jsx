"use client"
import { Container, Row, Col } from "react-bootstrap"
import "../style/home.css"
import LiveTv from "../components/LiveTv"

function LiveTvCategory() {
  return (
    <Container>
      {/* Main News Carousel */}
      <section className="main-carousel">
        <Container fluid>
          <Row>
            {/* Right Column - Sidebar */}
            <Col lg={12} md={12} sm={12} className="px-md-4">
              {/* Live TV */}
              <LiveTv />
            </Col>
          </Row>
        </Container>
      </section>
    </Container>
  )
}

export default LiveTvCategory

