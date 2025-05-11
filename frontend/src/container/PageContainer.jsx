import { useLocation } from "react-router-dom"
import Footer from "../components/Footer"
import { Container } from 'react-bootstrap';
import Navbar from "../components/Navigation"
import Header from "../components/Header"
import AdPanel from "../adPanel/AdPanel"
import Sidebar from "../components/Sidebar"
import "../style/PageContainer.css"

function PageContainer({ children }) {
  const location = useLocation()
  const pathsWithSidebar = [
    "/admin/dashboard",
    "/admin/kategoriler",
    "/admin/haberler",
    "/admin/haber-ekle",
    "/admin/haber-duzenle",
    "/admin/profile",
    "/admin/ayarlar",
  ]

  const isAdminPage = location.pathname.startsWith("/admin/")
  const shouldShowSidebar = pathsWithSidebar.includes(location.pathname)

  // Admin sayfalarında sadece sidebar ve içerik göster
  if (isAdminPage) {
    return (
      <div className="page-container" style={{position:"fixed"}}>
         <Header />
        <div className="content-wrapper">
        {shouldShowSidebar && <Sidebar />}
        <main className={`main-content ${shouldShowSidebar ? 'with-sidebar' : ''}`}>
          <Container fluid>
            {children}
          </Container>
        </main>
        </div>
        <Footer />
      </div>
    )
  }

  // Normal sayfalar için tam sayfa yapısı
  return (
    <div className="page-container">
      <Header />
      <Navbar />
      <div className="content-with-ads">
        <div className="ad-container left">
          <AdPanel position="left" link="https://www.google.com" />
        </div>
        <main>{children}</main>
        <div className="ad-container right">
          <AdPanel position="right" link="https://www.google.com" />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PageContainer
