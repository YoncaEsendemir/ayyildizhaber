"use client"

import { useLocation, useNavigate } from "react-router-dom"
import "../style/newsContet.css"
import { Container, Button, Row, Col } from "react-bootstrap"
import {getFullImageUrl} from "../utils/fotoUrl"
import DOMPurify from "dompurify"

// YouTube URL'sini embed formatına çeviren yardımcı fonksiyon
const getYouTubeEmbedUrl = (url) => {
  if (!url || typeof url !== "string") return null
  const regExp =
    /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/
  const match = url.match(regExp)
  return match && match[1] ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&controls=1` : null
}


const NewsContent = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const news = location.state?.news

  if (!news) return <h2>Haber bulunamadı!</h2>

  // Resim linki dizi ise ilk elemanını al
  const imageUrl = Array.isArray(news.resim_link)
    ? news.resim_link[0]
    : news.resim_link

  // Video render fonksiyonu
  const renderVideo = (videoLink) => {
    // Boş veya geçersiz video linki durumu
    if (!videoLink) return null
    
    // String değilse string'e çevir (sayı veya başka tip olabilir)
    const videoUrl = typeof videoLink === 'string' ? videoLink : String(videoLink)
    
    // YouTube kontrolü
    const youtubeEmbedUrl = getYouTubeEmbedUrl(videoUrl)
    if (youtubeEmbedUrl) {
      return (
        <iframe
          className="news-video"
          width="100%"
          height="315"
          src={youtubeEmbedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video player"
        />
      )
    }

    // MP4 veya local video kontrolü
    try {
      const urlObj = new URL(videoUrl.startsWith('/') ? `http://45.147.47.55:5000/api${videoUrl}` : videoUrl)
      if (urlObj.pathname.endsWith('.mp4') || videoUrl.startsWith('http://45.147.47.55:5000/api')) {
        return (
          <video
            className="news-video"
            controls
            src={videoUrl.startsWith("/") ? `http://45.147.47.55:5000/api${videoUrl}` : videoUrl}
          >
            Tarayıcınız video etiketini desteklemiyor.
          </video>
        )
      }
    } catch (e) {
      // URL oluşturulamadıysa geçersiz format olarak kabul et
      console.warn('Geçersiz video URL formatı:', videoUrl)
    }

    return null // Desteklenmeyen formatlarda hiçbir şey gösterme
  }

  return (
    <Container className="news-container">
      <Row>
        <Col className="news-col">
          <div className="news-card">
            <h3 className="mt-3 py-3 px-3 news-title">{news.baslik}</h3>

            {/* Video varsa ve render edilebiliyorsa göster */}
            {news.video_link && renderVideo(news.video_link) && (
              <div className="video-container px-3">
                {renderVideo(news.video_link)}
              </div>
            )}

            <div className="news-content mt-3 py-3 px-3">{news.ozet}</div>

            {/* Resim */}
            <img
              className="news-image py-3 px-3"
              src={getFullImageUrl(imageUrl)}
              alt={news.baslik}
            />

            <div
              className="news-content mt-3 py-3 px-3"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.haber_metni) }}
            ></div>

            <Button variant="primary" className="back-btn my-4 mt-3" onClick={() => navigate(-1)}>
              Geri Dön
            </Button>

            <div className="news-date">{news.haber_tarih}</div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default NewsContent