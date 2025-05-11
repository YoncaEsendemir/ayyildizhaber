"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  fetchDashboardData,
} from "../../utils/api";

function NewsCategoryList() {
  const [categoryList, setCategoryList] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState("");
  const [error,setError]= useState(null);
  const [alert, setAlert] = useState({ show: false, variant: "", message: "" });


  useEffect(() => {
    fetchCategories()
    fetchSession()
  }, [])

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

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getAllCategories()
      const data = Array.isArray(response) ? response : Array.isArray(response.data) ? response.data : []

      if (data.length > 0) {
        const formattedData = data.map((item) => ({
          id: item.id,
          name: item.kategori_ad,
          description: item.aciklama,
          createdAt: item.olusturma_tarihi,
        }));
        setCategoryList(formattedData);
      } else {
        setCategoryList([]);
        setAlert({
          show: true,
          variant: "warning",
          message: "Kategori verisi bulunamadı.",
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        variant: "danger",
        message: "Kategoriler yüklenirken hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      setAlert({
        show: true,
        variant: "warning",
        message: "Kategori adı boş olamaz!",
      });
      return;
    }

    setLoadingAction("add");
    try {
      const categoryData = {
        categoryName: newCategory.name,
        description: newCategory.description,
      };
      await addCategory(categoryData);
      setNewCategory({ name: "", description: "" });
      fetchCategories();
      setAlert({
        show: true,
        variant: "success",
        message: "Kategori başarıyla eklendi!",
      });
    } catch {
      setAlert({
        show: true,
        variant: "danger",
        message: "Kategori eklenirken hata oluştu.",
      });
    } finally {
      setLoadingAction("");
    }
  };

  const handleEdit = (id) => setEditingId(id);
  const handleCancelEdit = () => setEditingId(null);

  const handleChange = (e, category) => {
    const { name, value } = e.target;
    const updatedList = categoryList.map((cat) =>
      cat.id === category.id ? { ...cat, [name]: value } : cat
    );
    setCategoryList(updatedList);
  };

  const handleSaveEdit = async (category) => {
    if (!category.name.trim()) {
      setAlert({
        show: true,
        variant: "warning",
        message: "Kategori adı boş olamaz!",
      });
      return;
    }

    setLoadingAction(`edit-${category.id}`);
    try {
      await updateCategory(category.id, {
        categoryName: category.name,
        description: category.description,
      });
      setEditingId(null);
      fetchCategories();
      setAlert({
        show: true,
        variant: "success",
        message: "Kategori başarıyla güncellendi!",
      });
    } catch {
      setAlert({
        show: true,
        variant: "danger",
        message: "Kategori güncellenirken hata oluştu.",
      });
    } finally {
      setLoadingAction("");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) {
      setLoadingAction(`delete-${id}`);
      try {
        await deleteCategory(id);
        fetchCategories();
        setAlert({
          show: true,
          variant: "success",
          message: "Kategori başarıyla silindi!",
        });
      } catch {
        setAlert({
          show: true,
          variant: "danger",
          message: "Kategori silinirken hata oluştu.",
        });
      } finally {
        setLoadingAction("");
      }
    }
  };

  useEffect(() => {

    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);
  



  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        Hata: {error}
      </div>
    )
  }

  return (
    <Container className="my-4">

      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
          {alert.message}
        </Alert>
      )}
  <h4 className="mb-4">Kategori Listesi</h4>

      <Row>
        <Col md={12} lg={4} className="mb-4">
          <Card>
            <Card.Header>Yeni Kategori Ekle</Card.Header>
            <Card.Body>
              <Form onSubmit={handleAddCategory}>
                <Form.Group className="mb-3">
                  <Form.Label>Kategori Adı</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    disabled={loadingAction === "add"}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Açıklama</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, description: e.target.value })
                    }
                    disabled={loadingAction === "add"}
                  />
                </Form.Group>
                <Button type="submit" className="w-100" disabled={loadingAction === "add"}>
                  {loadingAction === "add" ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" /> Ekleniyor...
                    </>
                  ) : (
                    "Kategori Ekle"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12} lg={8}>
          <Card>
            <Card.Header>Kategori Listesi</Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" role="status" />
                  <p className="mt-2">Kategoriler yükleniyor...</p>
                </div>
              ) : categoryList.length === 0 ? (
                <Alert variant="info">Henüz kategori eklenmemiş.</Alert>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Ad</th>
                      <th>Açıklama</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryList.map((category) => (
                      <tr key={category.id}>
                        <td>
                          {editingId === category.id ? (
                            <Form.Control
                              name="name"
                              value={category.name}
                              onChange={(e) => handleChange(e, category)}
                              disabled={loadingAction === `edit-${category.id}`}
                            />
                          ) : (
                            category.name
                          )}
                        </td>
                        <td>
                          {editingId === category.id ? (
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="description"
                              value={category.description}
                              onChange={(e) => handleChange(e, category)}
                              disabled={loadingAction === `edit-${category.id}`}
                            />
                          ) : (
                            category.description
                          )}
                        </td>
                        <td>
                          {editingId === category.id ? (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                className="me-2"
                                onClick={() => handleSaveEdit(category)}
                                disabled={loadingAction === `edit-${category.id}`}
                              >
                                {loadingAction === `edit-${category.id}` ? (
                                  <Spinner as="span" animation="border" size="sm" />
                                ) : (
                                  <>
                                    <FaCheck /> Kaydet
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={handleCancelEdit}
                                disabled={loadingAction === `edit-${category.id}`}
                              >
                                <FaTimes /> İptal
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline-warning"
                                size="sm"
                                className="me-2"
                                onClick={() => handleEdit(category.id)}
                              >
                                <FaEdit /> Düzenle
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(category.id)}
                                disabled={loadingAction === `delete-${category.id}`}
                              >
                                <FaTrash /> Sil
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default NewsCategoryList;
