"use client"

import { Row, Col } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

function FirstGroup({ items }) {
  const navigate = useNavigate()

  const handleNewsClick = (news) => {
    navigate(`/haber-icerik`, { state: { news } });
  }

  // Haberleri çift ve tek ID'lere göre filtrele
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
  const grup1 = totalNews.slice(0, half);
  const grup2 = totalNews.slice(half);

  return (
    <Row>
      {/* Sol kolon - Çift ID'li haberler */}
      <Col md={6}>
        <div className="news-list">
          {grup1.slice(0, 5).map((news) => (
            <a onClick={() => handleNewsClick(news)} className="news-list-item" key={news.haber_id}>
              <div className="news-thumbnail" style={{ minWidth: 120, height: 80 }}>
                <img
                    src={
                    typeof news.resim_link === "string" && news.resim_link.startsWith("/")
                      ? `http://localhost:5000${news.resim_link}`
                      : news.resim_link || "/placeholder.svg"
                  }
                  alt={news.baslik || "Haber görseli"}
                  className="img-fluid"
                  width={120}
                  height={80}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=80&width=120"
                  }}
                />
              </div>
              <span className="news-item-title">
                {news.baslik ||
                  (news.haber_manset && Array.isArray(news.haber_manset) ? news.haber_manset[0] : news.haber_manset) ||
                  "Başlık bulunamadı"}
              </span>
            </a>
          ))}
          {evenIdNews.length === 0 && <p>Çift ID'li haber bulunamadı</p>}
        </div>
      </Col>

      {/* Sağ kolon - Tek ID'li haberler */}
      <Col md={6}>
        <div className="news-list">
          {grup2.slice(0, 4).map((news) => (
            <a onClick={() => handleNewsClick(news)} className="news-list-item" key={news.haber_id}>
              <div className="news-thumbnail" style={{ minWidth: 120, height: 80 }}>
                <img
                  src={news.resim_link || "/placeholder.svg?height=80&width=120"}
                  alt={news.baslik || "Haber görseli"}
                  className="img-fluid"
                  width={120}
                  height={80}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=80&width=120"
                  }}
                />
              </div>
              <span className="news-item-title">
                {news.baslik ||
                  (news.haber_manset && Array.isArray(news.haber_manset) ? news.haber_manset[0] : news.haber_manset) ||
                  "Başlık bulunamadı"}
              </span>
            </a>
          ))}
          {oddIdNews.length === 0 && <p>Tek ID'li haber bulunamadı</p>}
        </div>
      </Col>
    </Row>
  )
}

export default FirstGroup

