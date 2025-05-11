"use client"

// NewsCreate.jsx
import { useState, useRef, useEffect } from "react"
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap"
import "../../style/newsAdmin.css"
import { addNews,fetchDashboardData } from "../../utils/api"
import NewsCategory from "./NewsCategory"

function NewsCreate() {
  const [haber, setHaber] = useState({
    baslik: "",
    ozet: "",
    icerik: "",
    resim: null,
    video: null,
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

    if (editorRef.current) {
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
      if (window.CKEDITOR.instances.icerik) {
        window.CKEDITOR.instances.icerik.destroy()
      }
    }
  }, [])

  const fetchSession = async () => {
    try {
      const data = await fetchDashboardData ()
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
      [name]: files ? Array.from(files) : value, // çoklu dosyalar için
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
      const response = await addNews(haber)

      console.log("Sunucu yanıtı:", response)
      setSuccessMessage("Haber başarıyla eklendi!")

      // Formu sıfırla
      setHaber({
        baslik: "",
        ozet: "",
        icerik: "",
        resim: null,
        video: null,
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
                  <Form.Label>Resim</Form.Label>
                  <Form.Control type="file" name="resim" onChange={handleChange} accept="image/*" multiple />
                  <Form.Text className="text-muted">Birden fazla resim seçebilirsiniz. (Maksimum 5 adet)</Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Video</Form.Label>
                  <Form.Control type="file" name="video" onChange={handleChange} accept="video/*" multiple />
                  <Form.Text className="text-muted">Birden fazla video seçebilirsiniz. (Maksimum 2 adet)</Form.Text>
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
