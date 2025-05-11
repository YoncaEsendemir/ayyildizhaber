import { Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SecondGroup({ items }) {

  const navigate = useNavigate();


  const handleNewsClick = (news) => {
    navigate(`/haber-icerik`, { state: { news } });
  }
  // Tek ve çift ID'lere göre ayır
  const evenIdNews = items
    ? items.filter((news) => {
      const lastDigit = news.haber_id?.toString().slice(-1);
      return !isNaN(lastDigit) && parseInt(lastDigit) % 2 === 0;
    })
    : [];

  const oddIdNews = items
    ? items.filter((news) => {
      const lastDigit = news.haber_id?.toString().slice(-1);
      return !isNaN(lastDigit) && parseInt(lastDigit) % 2 !== 0;
    })
    : [];

  // Toplam haber sayısı
  const totalNews = [...evenIdNews, ...oddIdNews];

  // Yarıya böl (sağ-sol)
  const half = Math.ceil(totalNews.length / 2);

  // Sol sütun için ilk yarı, sağ sütun için ikinci yarı
  const leftColumn = totalNews.slice(0, half);
  const rightColumn = totalNews.slice(half);

  return (
    <Row>
      <Col md={6}>
        {leftColumn.map((news) => (
          <Card key={news.haber_id} className="news-card mb-3" onClick={() => handleNewsClick(news)}>
            <Card.Img
              variant="top"
              src={news.resim_link}
              width={350}
              height={200}
              style={{ objectFit: "cover", height: "200px" }}
            />
            <Card.Body>
              <Card.Title>{news.baslik}</Card.Title>
            </Card.Body>
          </Card>
        ))}
      </Col>
      <Col md={6}>
        <div className="news-list">
          {rightColumn.map((news) => (
            <a onClick={() => handleNewsClick(news)} className="news-list-item" key={news.haber_id}>
              <div className="news-thumbnail" style={{ minWidth: 120, height: 80 }}>
                <img
                  src={
                    typeof news.resim_link === "string" && news.resim_link.startsWith("/")
                      ? `http://localhost:5000${news.resim_link}`
                      : news.resim_link || "/placeholder.svg"
                  }
                  alt="News thumbnail"
                  width={120}
                  height={80}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
              <span className="news-item-title">{news.baslik}</span>
            </a>
          ))}
        </div>
      </Col>
    </Row>
  );
}

export default SecondGroup;
