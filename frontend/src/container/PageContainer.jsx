import Footer from "../components/Footer"
import Navbar from "../components/Navigation"
import Header from "../components/Header"
import AdPanel from "../adPanel/AdPanel"

function PageContainer({ children }) {
  return (
    <div className="page-container">
      <Header />
      <Navbar />
      <div className="content-with-ads">
        {/* Sol Reklam Paneli */}
        <div className="ad-container left">
          <AdPanel position="left" link="https://www.google.com" />
        </div>

        {/* Ana İçerik */}
        <main>{children}</main>

        {/* Sağ Reklam Paneli */}
        <div className="ad-container right">
          <AdPanel position="right" link="https://www.google.com" />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PageContainer

