"use client"

import { useState, useEffect } from "react"
import { Form, Alert, Spinner } from "react-bootstrap"
import { getAllCategories } from "../../utils/api"

function NewsCategory({ selectedCategories, setSelectedCategories }) {
  const [categoryList, setCategoryList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await getAllCategories()

      // Veri yapısını kontrol et ve düzenle
      const data = Array.isArray(response) ? response : Array.isArray(response.data) ? response.data : []

      if (data.length > 0) {
        const formattedData = data.map((item) => ({
          id: item.id,
          name: item.kategori_ad,
          description: item.aciklama,
          createdAt: item.olusturma_tarihi,
        }))
        setCategoryList(formattedData)
      } else {
        setCategoryList([])
        setError("Henüz kategori bulunmamaktadır.")
      }
    } catch (error) {
      console.error("Kategori getirme hatası:", error)
      setCategoryList([])
      setError("Kategorileri getirirken bir hata oluştu. Lütfen sayfayı yenileyin.")
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (e) => {
    const id = Number.parseInt(e.target.value)
    const categoryName = categoryList.find((cat) => cat.id === id)?.name || ""

    if (e.target.checked) {
      // Kategori seçildi, listeye ekle
      setSelectedCategories([...selectedCategories, { id, name: categoryName }])
    } else {
      // Kategori seçimi kaldırıldı, listeden çıkar
      setSelectedCategories(selectedCategories.filter((cat) => cat.id !== id))
    }
  }

  // Seçili kategorileri konsola yazdır (debug için)
  useEffect(() => {
    console.log("Seçili kategoriler:", selectedCategories)
  }, [selectedCategories])

  return (
    <Form.Group className="mb-3">
      <Form.Label>Kategoriler</Form.Label>

      {loading ? (
        <div className="text-center py-3">
          <Spinner animation="border" size="sm" className="me-2" />
          <span>Kategoriler yükleniyor...</span>
        </div>
      ) : error ? (
        <Alert variant="warning" className="py-2">
          {error}
          <div className="mt-2">
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={fetchCategories}>
              Yeniden Dene
            </button>
          </div>
        </Alert>
      ) : categoryList.length === 0 ? (
        <Alert variant="info" className="py-2">
          Henüz kategori bulunmamaktadır.
        </Alert>
      ) : (
        <div className="d-flex flex-column gap-2 border rounded p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
          {categoryList.map((category) => (
            <Form.Check
              key={category.id}
              type="checkbox"
              id={`category-${category.id}`}
              label={category.name}
              value={category.id}
              onChange={handleCategoryChange}
              checked={selectedCategories.some((cat) => cat.id === category.id || cat.name === category.name)}
            />
          ))}
        </div>
      )}

      {selectedCategories.length > 0 && (
        <div className="mt-2">
          <div className="small text-muted mb-1">{selectedCategories.length} kategori seçildi</div>
          <div className="d-flex flex-wrap gap-1">
            {selectedCategories.map((cat, index) => (
              <span key={index} className="badge bg-primary">
                {cat.name || `Kategori ${cat.id}`}
              </span>
            ))}
          </div>
        </div>
      )}
    </Form.Group>
  )
}

export default NewsCategory
