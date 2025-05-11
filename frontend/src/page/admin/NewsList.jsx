import React, { useEffect, useState } from "react";
import { Table, Button, Container,Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllNews, deleteNewsById,fetchDashboardData } from "../../utils/api";
import "../../style/newsAdmin.css";
import { useNavigate } from "react-router-dom";
import {FaEdit, FaTrash} from "react-icons/fa"

function NewsList() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingAction, setLoadingAction] = useState("")
  const navigate = useNavigate()
  // State for error and success messages
  const [alert, setAlert] = useState({ show: false, variant: "", message: "" })

  const handleEdit = (newsId)=>{
    navigate(`/admin/haber-duzenle
      `,{state:{newsId}})
  }

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

  const fetchNews = async () => {
    try {
      setLoading(true);
      //haberler çekiliyor
      const result = await getAllNews();
      setNewsData(Array.isArray(result) ? result : result ? [result] : []);
      if (newsData) {
        console.log("haber geldi");
      }
      setLoading(false);
    }
    catch (error) {
      setLoading(false);
      console.error("Haberleri alırken hata oluştu");
      setError(error);

    }
  }

  useEffect(() => {
    fetchNews();
    fetchSession();
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("Bu Haberi silmek istedığınızden emin misiniz? ")) {
      setLoadingAction(`delete-${id}`)
      try {
        await deleteNewsById(id)
        fetchNews()
        setAlert({
          show: true,
          variant: 'success',
          message: 'Haber başaryla slindi'
        })
      }
      catch (error) {
        setAlert({
          show: true,
          variant: "danger",
          message: "Kategori silinirken bir hata oluştu.",
        })
      } finally {
        setLoadingAction("")
      }
    }

  }

  // UYarilari 5 saniye sonra temızle
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [alert])

  // Veri yoksa veya yükleniyorsa yükleniyor mesajı göster
  if (loading) {
    return <div className="text-center my-5">Haberler yükleniyor...</div>
  }

  // Hata varsa hata mesajı göster
  if (error) {
    return <div className="text-center my-5 text-danger">Hata: {error}</div>;
  }
  // Veri boşsa mesaj göster
  if (newsData.length === 0) {
    return <div className="text-center my-5">Haberler bulunamadı.</div>
  }

  return (
    <Container className="news-list-container">
      <h2 className="my-4 text-center">📰 Haber Listesi</h2>

      <div className="d-flex justify-content-end mb-3">
        <Link to="/admin/haber-ekle" className="btn btn-success add-news-btn">
          ➕ Haber Ekle
        </Link>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover className="news-table text-center" >
          <thead>
            <tr>
              <th>ID</th>
              <th>Başlık</th>
              <th>Özet</th>
              <th>Haber Metni</th>
              <th>Yayın Tarih</th>
              <th>Durum</th>
              <th>Resim URL</th>
              <th>Video URL</th>
              <th>Kategoriler</th>
              <th>Yazar ID</th>
              <th>Oluşturma</th>
              <th>Güncelleme</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {newsData.map((haber) => (
              <tr key={haber.haber_id}>
                <td>{haber.haber_id}</td>
                <td>{haber.baslik}</td>
                <td>{haber.ozet}</td>
                <td>{haber.haber_metni}</td>
                <td>{haber.haber_tarih}</td>
                <td>{haber.durum}</td>
                <td>
                  <ul>
                    {Array.isArray(haber.resim_links) &&
                      haber.resim_links.map((resim, index) => (
                        <li key={index}>{resim}</li>
                      ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {Array.isArray(haber.video_links) &&
                      haber.video_links.map((video, index) => (
                        <li key={index}>{video}</li>
                      ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {Array.isArray(haber.kategori)
                      ? haber.kategori.map((kategori, index) => <li key={index}>{kategori}</li>)
                      : <li>{haber.kategori}</li>}
                  </ul>
                </td>
                <td>{haber.yazar_id}</td>
                <td>{haber.olusturma_tarihi}</td>
                <td>{haber.guncelleme_tarihi}</td>

                <td className="action-buttons">
                  <Button variant="outline-info" size="sm" onClick={() => handleEdit(haber.haber_id)}  
                  disabled={loadingAction.startsWith("edit-") || loadingAction.startsWith("delete-")}
                    >
                   <FaEdit /> Düzenle</Button>{" "}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(haber.haber_id)}
                    disabled={
                      loadingAction.startsWith("edit-") || loadingAction === `delete-${haber.haber_id}`
                    }
                  >
                    {loadingAction === `delete-${haber.haber_id}` ? (
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    ) : (
                      <>
                        <FaTrash /> Sil
                      </>
                    )}
                  </Button>
                </td>

              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default NewsList;
