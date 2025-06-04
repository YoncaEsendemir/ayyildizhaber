"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Form,Alert, Button, Card } from "react-bootstrap"
import { authAdmin } from "../../utils/api"
import "../../style/login.css"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [alert, setAlert] = useState({ show: false, variant: "", message: "" });
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()


  //E-posta formatı doğrulama (Regex) yöntemı ile yapılsı 
  const validateEmail= (email)=>{
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  // Şifre kontrolü (Regex) yöntemı ile yapılsı 
  const validatePassword= (password)=>{
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[._-]).{6,}$/
    return re.test(password)
    }
    
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

     // E-posta formatı kontrolü
    if(!validateEmail(email)) {
      setAlert({
        show: true,
        variant: "danger",
        message: "Lütfen geçerli bir e-posta adresi giriniz.",
      })
      setLoading(false)
      return
    }

    if(!validatePassword(password)){
      setAlert({
        show: true,
        variant: "danger",
        message: "Şifre en az 6 karakter uzunluğunda olmalı ve en az bir büyük harf, bir küçük harf ve bir nokta içermeli.",
      })
      setLoading(false)
      return
    }

    try {
      const result = await authAdmin(email, password)
      console.log("Giriş Başarılı:", result)
      if (result.message === "Login is successful") {
        // Token'ı localStorage'a kaydedebilirsiniz (opsiyonel)
        if (result.token) {
          localStorage.setItem("authToken", result.token)
        }
        setAlert({ show: true, variant: "success", message: "Giriş başarılı, yönlendiriliyorsunuz..." });
        setTimeout(()=>{
          navigate("/admin/dashboard")
        },1500)
      }
      else {
        setAlert({
          show: true,
          variant: "danger",
          message: "Giriş başarısız. Lütfen bilgileri kontrol edin.",
        })
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
        {alert.show && (
                <Alert
                  variant={alert.variant}
                  onClose={() => setAlert({ ...alert, show: false })}
                  dismissible
                >
                  {alert.message}
                </Alert>
              )}
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
