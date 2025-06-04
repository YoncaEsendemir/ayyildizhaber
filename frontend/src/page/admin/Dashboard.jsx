"use client"

import { useState, useEffect } from "react"
import { Row, Col, Card, Button } from "react-bootstrap"
import { FaUser, FaTrash, FaEdit } from "react-icons/fa"

import {
  PieChart,
  LineChart,
  Pie,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Newspaper, Eye, TrendingUp, Calendar } from "lucide-react"
import "../../style/dashboard.css"
import { getTotalCategoryNews, getTotalNews, deleteNewsById, getLastFiveNews,fetchDashboardData ,getCategoriesCout} from "../../utils/api"
import { useNavigate } from "react-router-dom"


function Dashboard() {
  const [adminData, setAdminData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalNews, setTotalNews] = useState(0)
  const [totalCategories, setTotalCategories] = useState(0)
  const [newsData, setNewsData] = useState([])
  const navigate = useNavigate()
  const [alert, setAlert] = useState({ show: false, variant: "", message: "" })
  const [loadingAction, setLoadingAction] = useState("")
  const [categoryData, setCategoryData] = useState([])
  const [stats, setStats] = useState({
    totalViews: 0,
    totalUsers: 0,
  })

  // Örnek veri - gerçek uygulamada API'den gelecek
  const viewsData = [
    { name: "Pazartesi", views: 4000 },
    { name: "Salı", views: 3000 },
    { name: "Çarşamba", views: 5000 },
    { name: "Perşembe", views: 2780 },
    { name: "Cuma", views: 1890 },
    { name: "Cumartesi", views: 2390 },
    { name: "Pazar", views: 3490 },
  ]
/*
  const categoryData = [
    { name: "Gündem", value: 400 },
    { name: "Ekonomi", value: 300 },
    { name: "Spor", value: 300 },
    { name: "Dünya", value: 200 },
    { name: "Teknoloji", value: 100 },
  ]*/

    const fetchCategorisCountHaber= async()=>{
      try{
        const response = await getCategoriesCout()
        if(response && response.data){
          setCategoryData(response.data)
        }
      }
        catch(err){
          console.error("Kategoriler çekilirken hata oluştu:", err)
          setError(err.message || "Kategoriler çekilemedi")
        }
    }
  const fetchTotalNewsCategory = async () => {
    try {
      const response = await getTotalNews()
      const response2 = await getTotalCategoryNews()

      if (response && response2) {
        setTotalNews(response.data)
        setTotalCategories(response2.data)
      }
    } catch (error) {
      console.error("Veri çekerken hata oluştu:", error)
      setError(error.message || "Veri çekilemedi")
    }
  }

  const handleEdit = (newsId)=>{
    navigate(`/admin/haber-duzenle
      `,{state:{newsId}})
  }

  const fetchLastFiveNews = async () => {
    try {
      const result = await getLastFiveNews()
      if (result && result.data) {
        setNewsData(Array.isArray(result.data) ? result.data : [result.data])
        console.log("Haberler yüklendi:", result.data)
      } else {
        setNewsData([])
      }
    } catch (error) {
      console.error("Haber çekerken hata oluştu:", error)
      setError(error.message || "Haberler çekilemedi")
    }
  }

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const data = await fetchDashboardData();
        setAdminData(data);

        // Örnek istatistik verileri - gerçek uygulamada API'den gelecek
        setStats({
          totalViews: 25600,
        })

        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }
    fetchCategorisCountHaber();
    fetchTotalNewsCategory();
    fetchLastFiveNews();
    fetchAdminData()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("Bu Haberi silmek istedığınızden emin misiniz? ")) {
      setLoadingAction(`delete-${id}`)
      try {
        await deleteNewsById(id)
        fetchNews()
        setAlert({
          show: true,
          variant: "success",
          message: "Haber başaryla slindi",
        })
      } catch (error) {
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        Hata: {error}
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <h4 className="mb-4">Dashboard</h4>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="profile-header">
                <h2 className="mb-4"></h2>
                <div className="profile-image-placeholder">
                  <FaUser />
                </div>

                <div className="profi-contant">
                  <h3>
                    Id:{adminData.id} Ad: {adminData.name}
                  </h3>
                  <span>{adminData.email} </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card dashboard-card">
            <div className="card-body d-flex align-items-center">
              <div className="stats-icon bg-primary bg-opacity-10">
                <Newspaper size={24} className="text-primary" />
              </div>
              <div>
                <h6 className="card-subtitle mb-1 text-muted">Toplam Haber</h6>
                <h4 className="card-title mb-0">{totalNews}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card dashboard-card">
            <div className="card-body d-flex align-items-center">
              <div className="stats-icon bg-success bg-opacity-10">
                <TrendingUp size={24} className="text-success" />
              </div>
              <div>
                <h6 className="card-subtitle mb-1 text-muted">Kategoriler</h6>
                <h4 className="card-title mb-0">{totalCategories}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card dashboard-card">
            <div className="card-body d-flex align-items-center">
              <div className="stats-icon bg-info bg-opacity-10">
                <Eye size={24} className="text-info" />
              </div>
              <div>
                <h6 className="card-subtitle mb-1 text-muted">Görüntülenme</h6>
                <h4 className="card-title mb-0">{stats.totalViews}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row mb-4">
        <div className="col-md-8 mb-3">
          <div className="card dashboard-card">
            <div className="card-body">
              <h5 className="card-title">Haftalık Görüntülenme</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card dashboard-card">
            <div className="card-body">
              <h5 className="card-title">Kategori Dağılımı</h5>
              <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={categoryData} // Artık dinamik olarak güncellenen state'i kullanıyor
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {categoryData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"][index % 5]}
          />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Recent News Table */}
      <div className="card dashboard-card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title">Son Eklenen Haberler</h5>
            <a href="/admin/haberler" className="btn btn-sm btn-primary">
              Tümünü Gör
            </a>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Başlık</th>
                  <th>Kategori</th>
                  <th>Tarih</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {newsData && newsData.length > 0 ? (
                  newsData.map((news) => (
                    <tr key={news.haber_id}>
                      <td>{news.haber_id}</td>
                      <td>{news.baslik}</td>
                      <td>
                        <span className="badge bg-primary">{news.kategoriler}</span>
                      </td>
                      <td>{news.haber_tarih}</td>
                      <td>
                        <div className="btn-group">
                          <a href={`/admin/haber-duzenle`} className="btn btn-sm btn-outline-primary"  onClick={()=>handleEdit(news.haber_id)}>
                            <FaEdit /> Düzenle
                          </a>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(news.haber_id)}
                            disabled={loadingAction === `delete-${news.haber_id}`}
                          >
                            {loadingAction === `delete-${news.haber_id}` ? (
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                            ) : (
                              <>
                                <FaTrash /> Sil
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      {loading ? "Haberler yükleniyor..." : "Henüz haber bulunmamaktadır."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card dashboard-card">
            <div className="card-body">
              <h5 className="card-title">Hızlı İşlemler</h5>
              <div className="d-grid gap-2">
                <a href="/admin/haber-ekle" className="btn btn-primary">
                  Yeni Haber Ekle
                </a>
                <a href="/admin/kategoriler" className="btn btn-outline-secondary">
                  Yeni Kategori Ekle
                </a>
                <a href="/admin/one-cikan-ekle" className="btn btn-outline-secondary">
                  Öne Çıkan Ekle
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card dashboard-card">
            <div className="card-body">
              <h5 className="card-title">Takvim</h5>
              <div className="d-flex align-items-center justify-content-center" style={{ height: "150px" }}>
                <Calendar size={48} className="text-muted" />
                <div className="ms-3">
                  <h3 className="mb-0">{new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}</h3>
                  <p className="text-muted mb-0">
                    {new Date().toLocaleDateString("tr-TR", { weekday: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
