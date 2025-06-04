import { Container, Row, Col } from "react-bootstrap";

function Communication() {
  return (
    <Container className="py-5">
      <section>
        {/* Başlık */}
        <Row className="mb-4">
          <Col>
            <h1 className="fw-bold text-black text-center">İLETİŞİM</h1>
            <hr />
          </Col>
        </Row>

        {/* İletişim Adresi */}
        <Row className="mb-4">
          <Col xs={12}>
            <h5 className="fw-bold text-black">İletişim Adresi</h5>
            <address>
              <p><strong>Ayıldız Web İletişim</strong></p>
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

        {/* Haber Merkezi */}
        <Row className="mb-4">
          <Col xs={12}>
            <h5 className="fw-bold text-black">Haber Merkezi</h5>
            <address>
              <p><strong>Ayıldız Haber</strong></p>
              <p>İskenderun, Hatay</p>
              <p>Tel: +90 555 555 5555</p>
            </address>
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

export default Communication;
