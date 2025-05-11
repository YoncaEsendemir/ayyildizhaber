"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap"
import { logout } from "../../utils/auth"
import "../../style/login.css"

function Logout() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogout = async () => {
    setLoading(true)
    setError("")

    try {
      // Basit logout işlemi
      logout(navigate)
    } catch (error) {
      console.error("Çıkış hatası:", error)
      setError("Çıkış yapılırken bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="login-container d-flex align-items-center justify-content-center">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="login-card shadow-lg">
            <Card.Body className="text-center">
              <h3 className="mb-4">Çıkış Yap</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <p>Oturumu kapatmak istediğinizden emin misiniz?</p>
              <Button onClick={handleLogout} variant="danger" className="w-100" disabled={loading}>
                {loading ? "Çıkış Yapılıyor..." : "Çıkış Yap"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Logout
