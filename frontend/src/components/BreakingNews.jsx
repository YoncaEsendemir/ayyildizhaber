"use client"

import { Container, Row, Col, Badge } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

function BreakingNews({ items }) {
    const navigate = useNavigate()
    const konuBaslik = "Ekonomi Haberler"

    const handleNewsClick = (news) => {
        navigate(`/haber-icerik`, { state: { news } })
    }

    return (
        <Container fluid>
            <Row className="align-items-center">
                <Col xs="auto">
                    <Badge className="breaking-badge">{konuBaslik}</Badge>
                </Col>
                <Col className="ticker-wrapper">
                    <div className="ticker-content">
                        {items && items.length > 0 ? (
                            items.slice(0, 5).map((news, index) => (
                                <span
                                    key={index}
                                    className="ticker-item"
                                    onClick={() => handleNewsClick(news)}
                                >
                                    {news.baslik ? news.baslik : "haber alınamadı"}
                                </span>
                            ))
                        ) : (
                            <span>Haber bulunamadı</span>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default BreakingNews

