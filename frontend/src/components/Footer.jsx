import { Container, Row, Col } from "react-bootstrap"
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaRss } from "react-icons/fa"
import { BsPhone, BsTv } from "react-icons/bs"
import logo from "../logo/ayyildizajansFooter.png"
import { Link } from "react-router-dom"
import "../style/footer.css"

const Footer = () => {
  return (
    <footer className="footer-main">
      <Container fluid className="footer-top">
        <Row className="py-4">
          <Col lg={2} md={4} sm={6} xs={12} className="footer-column">
            <div className="footer-logo-container">
              <img src={logo || "/placeholder.svg"} alt="Logo" className="footer-logo" />
              <h3 className="footer-brand">AY YILDIZ HABER AJANSI</h3>
            </div>
            <div className="footer-links">
              <Link to="/video" className="footer-link">
                VİDEO
              </Link>
              <Link to="/canli-yayin" className="footer-link">
                CANLI YAYIN
              </Link>

            </div>
          </Col>

          <Col lg={2} md={4} sm={6} xs={12} className="footer-column">
            <h4 className="footer-title">Ay Yıldız Haber Özel</h4>
            <div className="footer-links">
              <a href="/gundem" target="_blank"  rel="noopener noreferrer" className="footer-link">
                GÜNDEM
              </a>
              <a href="/ekonomi" target="_blank"  rel="noopener noreferrer" className="footer-link">
                EKONOMİ
              </a>
              <a href="/son-dakika" target="_blank"  rel="noopener noreferrer" className="footer-link">
                SON DAKİKA
              </a>
              <a href="/yasam"target="_blank"  rel="noopener noreferrer" className="footer-link">
                YAŞAM
              </a>
              <a href="/dunya"target="_blank"  rel="noopener noreferrer" className="footer-link">
                DÜNYA
              </a>
              <a href="/spor" target="_blank"  rel="noopener noreferrer" className="footer-link">
                SPOR
              </a>
            </div>
          </Col>

          <Col lg={2} md={4} sm={6} xs={12} className="footer-column">
            <h4 className="footer-title">VİDEO</h4>
            <div className="footer-links">
              <a href="programlar" target="_blank"  rel="noopener noreferrer" className="footer-link">
                Programlar
              </a>
              <a href="gundem" target="_blank"  rel="noopener noreferrer" className="footer-link">
                Gündem
              </a>
              <a href="yasam" target="_blank"  rel="noopener noreferrer"className="footer-link">
                Yaşam
              </a>
              <a href="dunya" target="_blank"  rel="noopener noreferrer" className="footer-link">
                Dünya
              </a>
              <a href="spor" target="_blank"  rel="noopener noreferrer" className="footer-link">
                Spor
              </a>
              <a href="ekonomi" target="_blank"  rel="noopener noreferrer" className="footer-link">
                Ekonomi
              </a>
            </div>
          </Col>

          <Col lg={2} md={4} sm={6} xs={12} className="footer-column">
            <h4 className="footer-title">GALERİ</h4>
            <div className="footer-links">
              <Link to="/gundem" className="footer-link">
                Gündem
              </Link>
              <Link to="/yasam" className="footer-link">
                Yaşam
              </Link>
              <Link to="/dunya" className="footer-link">
                Dünya
              </Link>
              <Link to="/ekonomi" className="footer-link">
                Ekonomi
              </Link>
            </div>
          </Col>

          <Col lg={2} md={4} sm={6} xs={12} className="footer-column">
            <h4 className="footer-title">KURUMSAL</h4>
            <div className="footer-links">
              <a href="/bize-ulasin" target="_blank"  rel="noopener noreferrer" className="footer-link">
                BİZE ULAŞIN
              </a>
              <a href="/kunye" target="_blank"  rel="noopener noreferrer" className="footer-link">
                KÜNYE
              </a>
              <a href="/hakkimizda" target="_blank"  rel="noopener noreferrer" className="footer-link">
                HAKKIMIZDA
              </a>
            </div>
          </Col>

          <Col lg={2} md={4} sm={6} xs={12} className="footer-column">
            <h4 className="footer-title">Kvkk</h4>
            <div className="footer-links">
              <a a href="/rss" target="_blank"  rel="noopener noreferrer" className="footer-link" >
                RSS
              </a>
              <a href="/veri-saklama-imha-politikasi" target="_blank"  rel="noopener noreferrer" className="footer-link">
              KİŞİSEL VERİLERİ SAKLAMA VE İMHA POLİTİKASI
              </a>
              <a href="/veri-politikasi" target="_blank"  rel="noopener noreferrer"  className="footer-link">
                VERİ POLİTİKASI
              </a>
            </div>
          </Col>
        </Row>
      </Container>

      <div className="footer-bottom">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
              <div className="footer-logo-container">
                <img src={logo || "/placeholder.svg"} alt="Logo" className="footer-bottom-logo" />
                <span className="copyright">© 2024 AY YILDIZ HABER AJANSI. Tüm hakları saklıdır.</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="social-icons">
                <a href="#" className="social-icon">
                  <BsTv />
                </a>
                <a href="#" className="social-icon">
                  <BsPhone />
                </a>
                <a href="#" className="social-icon">
                  <FaFacebook />
                </a>
                <a href="#" className="social-icon">
                  <FaTwitter />
                </a>
                <a href="#" className="social-icon">
                  <FaInstagram />
                </a>
                <a href="#" className="social-icon">
                  <FaYoutube />
                </a>
                <a href="#" className="social-icon">
                  <FaRss />
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  )
}

export default Footer

