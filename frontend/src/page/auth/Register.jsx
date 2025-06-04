import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Form, Button, Alert, Card } from "react-bootstrap"
import { registerAdmin } from '../../utils/api'
import "../../style/login.css"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [alert, setAlert] = useState({ show: false, variant: "", message: "" })
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

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAlert({ show: false, variant: "", message: "" })

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
      const result = await registerAdmin(name, email, password)
      console.log("Register result:", result)

      if (result.status=="success") {
       // localStorage.setItem("authToken", result.token)
        setAlert({
          show: true,
          variant: "success",
          message: result.message,
        })
        navigate("/admin/login");
      } else {
        setAlert({
          show: true,
          variant: "danger",
          message: "Kayıt başarısız. Lütfen bilgileri kontrol edin.",
        })
      }
    } catch (err) {
      console.error("Kayıt hatası:", err)
      setAlert({
        show: true,
        variant: "danger",
        message: "Bir hata oluştu. Lütfen tekrar deneyin.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [alert])

  return (
    <Container className="login-container d-flex align-items-center justify-content-center">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="login-card shadow-lg">
            <Card.Body>
              <h3 className="text-center mb-4">Kayıt Ol</h3>

              {alert.show && (
                <Alert
                  variant={alert.variant}
                  onClose={() => setAlert({ ...alert, show: false })}
                  dismissible
                >
                  {alert.message}
                </Alert>
              )}

              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>İsim</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="İsminizi giriniz"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email adresinizi giriniz"
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

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? "Kayıt Olunuyor..." : "Kayıt Ol"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Register
