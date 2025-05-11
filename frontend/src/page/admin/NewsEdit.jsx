"use client"

import { useState, useRef, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Form, Button, Container, Row, Col, Card, Badge, ListGroup, Alert } from "react-bootstrap"
import { editNews, getNewsById,fetchDashboardData } from "../../utils/api"
import "../../style/newsAdmin.css"
import NewsCategory from "./NewsCategory"
import { FaImage, FaVideo, FaTrash, FaSave, FaArrowLeft, FaEye } from "react-icons/fa"

function EditNews() {
  const [haber, setHaber] = useState({
    baslik: "",
    ozet: "",
    icerik: "",
    resim: [],
    video: [],
    kategoriler: [],
    yazar: "",
    durum: "aktif",
    yayinTarihi: "",
  })

  // Mevcut medya dosyalarını takip etmek için state'ler
  const [mevcutResimler, setMevcutResimler] = useState([])
  const [mevcutVideolar, setMevcutVideolar] = useState([])
  const [silinecekResimler, setSilinecekResimler] = useState([])
  const [silinecekVideolar, setSilinecekVideolar] = useState([])
  const [activePreview, setActivePreview] = useState(null)

  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const newsId = location.state?.newsId

  const editorRef = useRef(null)

  const fetchSession = async () => {
    try {
      const data = await fetchDashboardData()
      if (!data) {
        setError("Oturum yok")
      }
    } catch (err) {
      setError("Giriş token'ı bulunamadı. Lütfen tekrar giriş yapın.")
      setLoading(false)
    }
  }


const fetchNewsById =async(newsId)=> {
    setLoading(true)
    try {
      const result = await getNewsById(newsId)
      if (result && result.length > 0) {
        const newsData = result[0]
        console.log("Gelen haber verisi:", newsData)

        // Kategorileri işle
        let kategoriler = []
        if (typeof newsData.kategoriler === "string") {
          // Eğer kategoriler string ise virgülle ayırıp dizi haline getir
          kategoriler = newsData.kategoriler.split(",").map((kat) => ({
            id: null,
            name: kat.trim(),
          }))
        } else if (Array.isArray(newsData.kategoriler)) {
          kategoriler = newsData.kategoriler.map((kat) => {
            if (typeof kat === "string") {
              return { id: null, name: kat.trim() }
            }
            return kat
          })
        }

        // Resim ve video linklerini işle
        let resimLinkleri = []
        if (Array.isArray(newsData.resim_link)) {
          resimLinkleri = newsData.resim_link.filter((link) => link !== null && link !== undefined)
        } else if (typeof newsData.resim_link === "string") {
          resimLinkleri = [newsData.resim_link]
        }

        let videoLinkleri = []
        if (Array.isArray(newsData.video_link)) {
          videoLinkleri = newsData.video_link.filter((link) => link !== null && link !== undefined)
        } else if (typeof newsData.video_link === "string") {
          videoLinkleri = [newsData.video_link]
        }

        console.log("İşlenmiş resim linkleri:", resimLinkleri)
        console.log("İşlenmiş video linkleri:", videoLinkleri)

        setMevcutResimler(resimLinkleri)
        setMevcutVideolar(videoLinkleri)

        setHaber({
          baslik: newsData.baslik || "",
          ozet: newsData.ozet || "",
          icerik: newsData.haber_metni || "",
          resim: [], // Yeni resimler için boş dizi
          video: [], // Yeni videolar için boş dizi
          kategoriler: kategoriler,
          yazar: newsData.yazar_id || "",
          durum: newsData.durum || "aktif",
          yayinTarihi: newsData.haber_tarih ? new Date(newsData.haber_tarih).toISOString().split("T")[0] : "",
        })

        // CKEditor içeriğini güncelle
        setTimeout(() => {
          if (window.CKEDITOR && window.CKEDITOR.instances.icerik) {
            window.CKEDITOR.instances.icerik.setData(newsData.haber_metni || "")
          }
        }, 500) // CKEditor'ün yüklenmesi için biraz bekle
      } else {
        setErrorMessage("Haber bulunamadı")
      }
    } catch (error) {
      console.error("Haber getirme hatası:", error)
      setErrorMessage("Haber yüklenirken bir hata oluştu: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (newsId) {
      fetchNewsById(newsId)
      fetchDashboardData()
    }
  }, [newsId])

  useEffect(() => {
    // CKEditor'ü başlat
    if (editorRef.current && window.CKEDITOR) {
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
        window.CKEDITOR.instances.icerik.destroy()
      }
    }
  }, [])

  // Haber verisi geldiğinde CKEditor içeriğini güncelle
  useEffect(() => {
    if (haber.icerik && window.CKEDITOR && window.CKEDITOR.instances.icerik) {
      window.CKEDITOR.instances.icerik.setData(haber.icerik)
    }
  }, [haber.icerik])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setHaber((prev) => ({
      ...prev,
      [name]: files ? Array.from(files) : value,
    }))
  }

  const handleKategoriChange = (newCategories) => {
    setHaber((prev) => ({ ...prev, kategoriler: newCategories }))
  }

  const handleResimSil = (index) => {
    const silinecekResim = mevcutResimler[index]
    setSilinecekResimler([...silinecekResimler, silinecekResim])
    setMevcutResimler(mevcutResimler.filter((_, i) => i !== index))
  }

  const handleVideoSil = (index) => {
    const silinecekVideo = mevcutVideolar[index]
    setSilinecekVideolar([...silinecekVideolar, silinecekVideo])
    setMevcutVideolar(mevcutVideolar.filter((_, i) => i !== index))
  }

  const getFileNameFromUrl = (url) => {
    if (!url) return "Dosya"
    const parts = url.split("/")
    return parts[parts.length - 1]
  }

  // URL'yi tam formata çeviren yardımcı fonksiyon
  const getFullUrl = (url) => {
    if (!url) return "/placeholder.svg?height=200&width=350"
    if (url.startsWith("http://") || url.startsWith("https://")) return url
    if (url.startsWith("/uploads/")) return `http://localhost:5000${url}`
    return url
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage("")
    setErrorMessage("")

    try {
      // CKEditor'den içeriği al
      const editorContent = window.CKEDITOR.instances.icerik ? window.CKEDITOR.instances.icerik.getData() : haber.icerik

      // Form verilerini hazırla
      const formData = new FormData()

      // Temel bilgileri ekle
      formData.append("title", haber.baslik)
      formData.append("abstract", haber.ozet ? haber.ozet.substring(0, 300) : "")
      formData.append("contents", editorContent)
      formData.append("broadcasting_date", haber.yayinTarihi)
      formData.append("state", haber.durum)

      // Kategorileri ekle
      if (haber.kategoriler && haber.kategoriler.length > 0) {
        haber.kategoriler.forEach((kategori) => {
          if (kategori.id) {
            formData.append("categoryId", kategori.id)
          } else if (kategori.name) {
            formData.append("categoryNames", kategori.name)
          }
        })
      }

      // Mevcut resimleri ekle - ÖNEMLİ: Bunlar her zaman gönderilmeli
      if (mevcutResimler && mevcutResimler.length > 0) {
        mevcutResimler.forEach((resim) => {
          formData.append("existingImages", resim)
        })
      } else {
        // Eğer mevcut resim yoksa, boş bir değer gönder ki backend null olarak algılamasın
        formData.append("existingImages", "")
      }

      // Mevcut videoları ekle - ÖNEMLİ: Bunlar her zaman gönderilmeli
      if (mevcutVideolar && mevcutVideolar.length > 0) {
        mevcutVideolar.forEach((video) => {
          formData.append("existingVideos", video)
        })
      } else {
        // Eğer mevcut video yoksa, boş bir değer gönder ki backend null olarak algılamasın
        formData.append("existingVideos", "")
      }

      // Silinecek resimleri ekle
      if (silinecekResimler && silinecekResimler.length > 0) {
        silinecekResimler.forEach((resim) => {
          formData.append("deleteImages", resim)
        })
      }

      // Silinecek videoları ekle
      if (silinecekVideolar && silinecekVideolar.length > 0) {
        silinecekVideolar.forEach((video) => {
          formData.append("deleteVideos", video)
        })
      }

      // Yeni resimleri ekle
      if (haber.resim && haber.resim.length > 0) {
        for (let i = 0; i < haber.resim.length; i++) {
          formData.append("images", haber.resim[i])
        }
      }

      // Yeni videoları ekle
      if (haber.video && haber.video.length > 0) {
        for (let i = 0; i < haber.video.length; i++) {
          formData.append("videos", haber.video[i])
        }
      }

      console.log("Düzenlenen Haber Verileri:")
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`)
      }

      // Backend'e gönder
      const response = await editNews(formData, newsId)

      console.log("Sunucu yanıtı:", response)
      setSuccessMessage("Haber başarıyla güncellendi!")

      // Başarılı güncelleme sonrası haberler sayfasına yönlendir
      setTimeout(() => {
        navigate("/admin/haberler")
      }, 2000)
    } catch (error) {
      console.error("Haber düzenleme hatası:", error)
      setErrorMessage("Haber düzenlenirken bir hata oluştu: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Medya önizleme modalını açan fonksiyon
  const openPreview = (type, url) => {
    setActivePreview({ type, url: getFullUrl(url) })
  }

  // Medya önizleme modalını kapatan fonksiyon
  const closePreview = () => {
    setActivePreview(null)
  }

  return (
    <Container className="news-creation-page">
      <h1 className="text-center mb-4">📰 Haber Düzenle</h1>

      {successMessage && (
        <Alert variant="success" className="mb-3">
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="danger" className="mb-3">
          {errorMessage}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Body>
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

                  {/* Mevcut resimler */}
                  {mevcutResimler.length > 0 && (
                    <Card className="mb-3">
                      <Card.Header className="bg-light">Mevcut Resimler</Card.Header>
                      <Card.Body>
                        <Row xs={1} md={2} className="g-3">
                          {mevcutResimler.map((resim, index) => (
                            <Col key={index}>
                              <Card>
                                <div style={{ height: "150px", overflow: "hidden", position: "relative" }}>
                                  <img
                                    src={getFullUrl(resim) || "/placeholder.svg"}
                                    alt={`Resim ${index + 1}`}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    onClick={() => openPreview("image", resim)}
                                    className="cursor-pointer"
                                  />
                                  <Badge
                                    bg="primary"
                                    className="position-absolute"
                                    style={{ top: "5px", right: "5px" }}
                                  >
                                    Resim {index + 1}
                                  </Badge>
                                </div>
                                <Card.Body className="p-2">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <small className="text-truncate me-2">{getFileNameFromUrl(resim)}</small>
                                    <div>
                                      <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-1"
                                        onClick={() => openPreview("image", resim)}
                                      >
                                        <FaEye />
                                      </Button>
                                      <Button variant="outline-danger" size="sm" onClick={() => handleResimSil(index)}>
                                        <FaTrash />
                                      </Button>
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </Card.Body>
                    </Card>
                  )}

                  {/* Yeni resim yükleme */}
                  <Form.Control type="file" name="resim" onChange={handleChange} accept="image/*" multiple />
                  <Form.Text className="text-muted">Birden fazla resim seçebilirsiniz. (Maksimum 2 adet)</Form.Text>

                  {/* Yeni seçilen resimler */}
                  {haber.resim.length > 0 && (
                    <div className="mt-2">
                      <Badge bg="info" className="mb-2">
                        Yeni Seçilen Resimler: {haber.resim.length}
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
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaVideo className="me-2" />
                    Videolar
                  </Form.Label>

                  {/* Mevcut videolar */}
                  {mevcutVideolar.length > 0 && (
                    <Card className="mb-3">
                      <Card.Header className="bg-light">Mevcut Videolar</Card.Header>
                      <Card.Body>
                        <Row xs={1} className="g-3">
                          {mevcutVideolar.map((video, index) => (
                            <Col key={index}>
                              <Card>
                                <Card.Body className="p-2">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div className="d-flex align-items-center">
                                      <FaVideo className="me-2 text-primary" />
                                      <span className="text-truncate">{getFileNameFromUrl(video)}</span>
                                      <Badge bg="info" className="ms-2">
                                        Video {index + 1}
                                      </Badge>
                                    </div>
                                    <div>
                                      <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-1"
                                        onClick={() => openPreview("video", video)}
                                      >
                                        <FaEye />
                                      </Button>
                                      <Button variant="outline-danger" size="sm" onClick={() => handleVideoSil(index)}>
                                        <FaTrash />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="video-preview-container">
                                    <video
                                      controls
                                      width="100%"
                                      height="120"
                                      src={getFullUrl(video)}
                                      className="border rounded"
                                    >
                                      Tarayıcınız video etiketini desteklemiyor.
                                    </video>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </Card.Body>
                    </Card>
                  )}

                  {/* Yeni video yükleme */}
                  <Form.Control type="file" name="video" onChange={handleChange} accept="video/*" multiple />
                  <Form.Text className="text-muted">Birden fazla video seçebilirsiniz. (Maksimum 1 adet)</Form.Text>

                  {/* Yeni seçilen videolar */}
                  {haber.video.length > 0 && (
                    <div className="mt-2">
                      <Badge bg="info" className="mb-2">
                        Yeni Seçilen Videolar: {haber.video.length}
                      </Badge>
                      <ListGroup>
                        {Array.from(haber.video).map((file, index) => (
                          <ListGroup.Item key={index} className="small">
                            {file.name}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  )}
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
              <Button variant="primary" type="submit" disabled={loading} className="px-4">
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" /> Haberi Güncelle
                  </>
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Form>

      <div>
        <Button variant="primary" className="back-btn my-4 mt-3" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-2" /> Geri Dön
        </Button>
      </div>

      {/* Medya Önizleme Modalı */}
      {activePreview && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1050 }}
          onClick={closePreview}
        >
          <div
            className="position-relative"
            style={{ maxWidth: "90%", maxHeight: "90%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="light"
              className="position-absolute top-0 end-0 m-2 rounded-circle"
              style={{ width: "30px", height: "30px", padding: "0" }}
              onClick={closePreview}
            >
              &times;
            </Button>
            {activePreview.type === "image" ? (
              <img
                src={activePreview.url || "/placeholder.svg"}
                alt="Resim Önizleme"
                style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain" }}
              />
            ) : (
              <video controls autoPlay style={{ maxWidth: "100%", maxHeight: "80vh" }} src={activePreview.url}>
                Tarayıcınız video etiketini desteklemiyor.
              </video>
            )}
          </div>
        </div>
      )}

      {/* Özel CSS */}
      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .video-preview-container {
          background-color: #f8f9fa;
          border-radius: 4px;
        }
      `}</style>
    </Container>
  )
}

export default EditNews
