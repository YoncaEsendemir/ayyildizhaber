"use client"

// NewsCreate.jsx
import { useState, useRef, useEffect } from "react"
import { Form, Button, Container, Row, Col, Card, ListGroup, Badge } from "react-bootstrap" // ListGroup ve Badge eklendi
import "../../style/newsAdmin.css"
import { addNews, fetchDashboardData } from "../../utils/api"
import NewsCategory from "./NewsCategory"
import { FaImage, FaVideo } from "react-icons/fa" // İkonlar eklendi

function NewsCreate() {
  const [haber, setHaber] = useState({
    baslik: "",
    ozet: "",
    icerik: "",
    resim: [], // Yüklenen resim dosyaları için
    resimLink: "", // Resim URL'si için
    video: "", // video artık bir string (URL) olacak
    kategoriler: [],
    yazar: "",
    durum: "aktif",
    yayinTarihi: "",
  })

  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const editorRef = useRef(null)

  useEffect(() => {
    fetchSession()

    if (editorRef.current && window.CKEDITOR) {
      // CKEDITOR'ün varlığını kontrol et
      // Önce varsa mevcut instance'ı temizle
      if (window.CKEDITOR.instances.icerik) {
        window.CKEDITOR.instances.icerik.destroy()
      }

      window.CKEDITOR.replace("icerik", {
        height: 200,
        toolbar: [
          ["Bold", "Italic", "Underline"],
          ["NumberedList", "BulletedList"],
          ["Link", "Unlink"],
          ["Image", "Table"],
        ],
      })

      window.CKEDITOR.instances.icerik.on("change", () => {
        const data = window.CKEDITOR.instances.icerik.getData()
        setHaber((prev) => ({ ...prev, icerik: data }))
      })
    }

    return () => {
      if (window.CKEDITOR && window.CKEDITOR.instances.icerik) {
        // CKEDITOR'ün varlığını kontrol et
        window.CKEDITOR.instances.icerik.destroy()
      }
    }
  }, [])

  const fetchSession = async () => {
    try {
      const data = await fetchDashboardData()
      if (!data) {
        setErrorMessage("Oturum yok")
      }
    } catch (err) {
      setErrorMessage("Giriş token'ı bulunamadı. Lütfen tekrar giriş yapın.")
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setHaber((prev) => ({
      ...prev,
      [name]: name === "resim" ? Array.from(files) : value, // resim için dosyaları, diğerleri için değeri al
    }))
  }

  const handleKategoriChange = (newCategories) => {
    setHaber((prev) => ({ ...prev, kategoriler: newCategories }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage("")
    setErrorMessage("")

    try {
      console.log("Gönderilen Haber:", haber)

      // Backend'e gönder
      const response = await addNews(haber) // addNews fonksiyonu api.jsx'te güncellendi

      console.log("Sunucu yanıtı:", response)
      setSuccessMessage("Haber başarıyla eklendi!")

      // Formu sıfırla
      setHaber({
        baslik: "",
        ozet: "",
        icerik: "",
        resim: [], // resim dosyalarını sıfırla
        resimLink: "", // resim linkini sıfırla
        video: "", // video alanını sıfırla
        kategoriler: [],
        yazar: "",
        durum: "aktif",
        yayinTarihi: "",
      })

      // CKEditor içeriğini temizle
      if (window.CKEDITOR.instances.icerik) {
        window.CKEDITOR.instances.icerik.setData("")
      }
    } catch (error) {
      console.error("Haber ekleme hatası:", error)
      setErrorMessage("Haber eklenirken bir hata oluştu: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (errorMessage) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        Hata: {errorMessage}
      </div>
    )
  }

  return (
    <Container className="news-creation-page">
      <h1 className="text-center mb-4">📰 Haber Ekle</h1>
      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Body>
            {successMessage && (
              <div className="alert alert-success mb-3" role="alert">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="alert alert-danger mb-3" role="alert">
                {errorMessage}
              </div>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Başlık</Form.Label>
              <Form.Control type="text" name="baslik" value={haber.baslik} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Özet</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="ozet"
                value={haber.ozet}
                onChange={handleChange}
                placeholder="Haberin kısa özetini yazın..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>İçerik</Form.Label>
              <textarea id="icerik" name="icerik" defaultValue={haber.icerik} ref={editorRef} />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaImage className="me-2" />
                    Resimler
                  </Form.Label>
                  <Form.Control type="file" name="resim" onChange={handleChange} accept="image/*" multiple />
                  <Form.Text className="text-muted">
                    Birden fazla resim dosyası seçebilirsiniz. (Maksimum 5 adet)
                  </Form.Text>

                  {/* Yeni seçilen resim dosyaları */}
                  {haber.resim.length > 0 && (
                    <div className="mt-2">
                      <Badge bg="info" className="mb-2">
                        Yeni Seçilen Resim Dosyaları: {haber.resim.length}
                      </Badge>
                      <ListGroup>
                        {Array.from(haber.resim).map((file, index) => (
                          <ListGroup.Item key={index} className="small">
                            {file.name}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  )}

                  <Form.Label className="mt-3">Resim Linki</Form.Label>
                  <Form.Control
                    type="text"
                    name="resimLink"
                    value={haber.resimLink}
                    onChange={handleChange}
                    placeholder="Resim URL'sini buraya yapıştırın"
                  />
                  <Form.Text className="text-muted">Harici bir resim URL'si ekleyebilirsiniz.</Form.Text>

                  {/* Yeni seçilen resim linki */}
                  {haber.resimLink && (
                    <div className="mt-2">
                      <Badge bg="info" className="mb-2">
                        Yeni Seçilen Resim Linki
                      </Badge>
                      <ListGroup>
                        <ListGroup.Item className="small">{haber.resimLink}</ListGroup.Item>
                      </ListGroup>
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaVideo className="me-2" />
                    Video Linki (YouTube)
                  </Form.Label>{" "}
                  {/* Label güncellendi */}
                  <Form.Control
                    type="text" // type="file" yerine type="text"
                    name="video"
                    value={haber.video}
                    onChange={handleChange}
                    placeholder="YouTube video linkini buraya yapıştırın" // Placeholder eklendi
                  ></Form.Control>
                  <Form.Text className="text-muted">Sadece bir YouTube video linki ekleyebilirsiniz.</Form.Text>{" "}
                  {/* Yardım metni güncellendi */}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <NewsCategory selectedCategories={haber.kategoriler} setSelectedCategories={handleKategoriChange} />
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Yazar</Form.Label>
                  <Form.Control type="text" name="yazar" value={haber.yazar} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Durum</Form.Label>
                  <div className="d-flex gap-3">
                    <Form.Check
                      type="radio"
                      label="Yayinda"
                      name="durum"
                      value="yayinda"
                      checked={haber.durum === "yayinda"}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="radio"
                      label="Taslak"
                      name="durum"
                      value="taslak"
                      checked={haber.durum === "taslak"}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Yayın Tarihi</Form.Label>
              <Form.Control type="date" name="yayinTarihi" value={haber.yayinTarihi} onChange={handleChange} />
            </Form.Group>

            <div className="text-center">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Yükleniyor...
                  </>
                ) : (
                  "Haberi Kaydet"
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Form>
    </Container>
  )
}

export default NewsCreate
