import { Container, Row, Col, Image } from "react-bootstrap";

function AboutUs() {
  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col xs={12}>
          <h1 className="fw-bold text-black text-center">Hakkımızda</h1>
          <hr />
        </Col>
      </Row>

      <Row className="align-items-center mb-5">
        <Col md={6} className="mb-4 mb-md-0">
          <Image
            src="https://via.placeholder.com/600x400?text=Haber+Sitesi"
            alt="Haber Sitesi"
            fluid
            rounded
          />
        </Col>
        <Col md={6}>
          <h4 className="fw-bold text-black">Bağımsız ve Güvenilir Haber</h4>
          <p>
            Ayıldız Haber, yerel ve ulusal gelişmeleri tarafsızlık ilkesine bağlı
            kalarak siz değerli okuyucularımıza ulaştırmaktadır. Kendi haber
            kadromuzla ürettiğimiz içerikler, doğruluk ve şeffaflık temellerine
            dayanmaktadır.
          </p>
        </Col>
      </Row>

      <Row className="align-items-center mb-5 flex-md-row-reverse">
        <Col md={6} className="mb-4 mb-md-0">
          <Image
            src="https://via.placeholder.com/600x400?text=TRT+RSS+Veri"
            alt="RSS Kaynakları"
            fluid
            rounded
          />
        </Col>
        <Col md={6}>
          <h4 className="fw-bold text-black">Geniş İçerik Ağı</h4>
          <p>
            Kendi içeriklerimizin yanı sıra, güvenilir kaynaklardan da faydalanıyoruz.
            TRT başta olmak üzere çeşitli haber kaynaklarından otomatik olarak RSS
            yoluyla veri çekerek, ziyaretçilerimize daha zengin bir içerik sunuyoruz.
          </p>
        </Col>
      </Row>

      <Row className="align-items-center mb-5">
        <Col md={6} className="mb-4 mb-md-0">
          <Image
            src="https://via.placeholder.com/600x400?text=Admin+Panel"
            alt="Yönetim Paneli"
            fluid
            rounded
          />
        </Col>
        <Col md={6}>
          <h4 className="fw-bold text-black">Gelişmiş Yönetim Paneli</h4>
          <p>
            Sitemiz, tamamen bize ait özel bir yönetim paneliyle desteklenmektedir.
            Admin panelimiz sayesinde haber ekleme, güncelleme ve kategorilere ayırma
            işlemleri kolaylıkla yapılabilmektedir.
          </p>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <h4 className="fw-bold text-black">Misyonumuz</h4>
          <p>
            Ayıldız Haber olarak amacımız, doğru ve tarafsız bilgiye ulaşma hakkını
            herkes için erişilebilir kılmaktır. Gelişen teknoloji ile birlikte içerik
            kalitemizi artırmak ve okuyucularımıza en iyi deneyimi sunmak için
            sürekli olarak çalışıyoruz.
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default AboutUs;
