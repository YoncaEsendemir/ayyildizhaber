import { Container, Row, Col } from "react-bootstrap";

function Rss() {
  return (
    <Container className="py-5">
      <section>
        {/* Başlık */}
        <Row className="mb-4">
          <Col>
            <h1 className="fw-bold text-black text-center">RSS Bilgilendirme</h1>
            <hr />
          </Col>
        </Row>

        {/* Açıklama */}
        <Row className="mb-4">
          <Col xs={12}>
            <p>
              Bu sayfa aracılığıyla, sitemizde yayımlanan içeriklerin kaynağı hakkında bilgi edinebilirsiniz. 
              Yayınladığımız içeriklerin bir kısmı kendi editörlerimiz tarafından oluşturulmakta, bir kısmı ise 
              <strong> trtHaber </strong> kaynaklı haberlerin RSS üzerinden otomatik olarak çekilmesiyle sağlanmaktadır.
            </p>
            <hr />
          </Col>
        </Row>

        {/* İletişim Adresi */}
        <Row className="mb-4">
          <Col xs={12}>
            <h5 className="fw-bold text-black">İletişim Adresi</h5>
            <address>
              <p><strong>RSS Editör Ekibi</strong></p>
              <p>İskenderun, Hatay</p>
            </address>
            <hr />
          </Col>
        </Row>

        {/* Reklam Talepleri */}
        <Row className="mb-4">
          <Col xs={12}>
            <h5 className="fw-bold text-black">Reklam Talepleri İçin</h5>
            <p>Telefon: +90 555 555 5555</p>
            <hr />
          </Col>
        </Row>

        {/* Sosyal Medya */}
        <Row className="mb-4">
          <Col xs={12}>
            <h5 className="fw-bold text-black">Sosyal Medya Hesaplarımız</h5>
            <ul className="list-unstyled d-flex flex-wrap">
              <li className="me-4 mb-2">
                <a href="#" className="text-decoration-none text-dark">Facebook</a>
              </li>
              <li className="me-4 mb-2">
                <a href="#" className="text-decoration-none text-dark">Instagram</a>
              </li>
              <li className="me-4 mb-2">
                <a href="#" className="text-decoration-none text-dark">Twitter</a>
              </li>
            </ul>
            <hr />
          </Col>
        </Row>
      </section>
    </Container>
  );
}

export default Rss;
