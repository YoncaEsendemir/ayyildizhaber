"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap"
import { authAdmin } from "../../utils/api"
import "../../style/login.css"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await authAdmin(email, password)
      console.log("Giriş Başarılı:", result)
      if (result.message === "Login is successful") {
        // Token'ı localStorage'a kaydedebilirsiniz (opsiyonel)
        if (result.token) {
          localStorage.setItem("authToken", result.token)
          console.log("asdfcghjk")
        }
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error("Giriş hatası:", err)
      setError("Giriş başarısız. Lütfen bilgileri kontrol edin.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="login-container d-flex align-items-center justify-content-center">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="login-card shadow-lg">
            <Card.Body>
              <h3 className="text-center mb-4">Giriş Yap</h3>
              {error && <p className="text-danger text-center">{error}</p>}
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Admin </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Admin giriniz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <Form.Label>Şifre</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Şifre giriniz"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                  {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
