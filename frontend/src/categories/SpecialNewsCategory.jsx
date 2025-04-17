"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col } from "react-bootstrap"
import { FaChevronRight, FaChevronLeft } from "react-icons/fa"
import "../style/home.css"

import CarouselHome from "../components/CarouselHome"
import BreakingNews from "../components/BreakingNews"
import VideoComponent from "../components/VideoComponent"
import CardGridLayout from "../components/CardGridLayout"
import FirstGroup from "../components/FirstGroup"
import SecondGroup from "../components/SecondGroup"
import SliderGroup from "../components/SliderGroup"
import LiveTv from "../components/LiveTv"

import { fetchNews2, getManuelHaber } from "../utils/api"
import { sortNewsData } from "../utils/sortNews"

function SpecialNewsCategory() {
  const [newsData, setNewsData] = useState([])
  const [categorizedNews, setCategorizedNews] = useState({})
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        const [trtNews, manuelNews] = await Promise.all([
          fetchNews2("gundem"),
          getManuelHaber(),
        ])

        const trtArray = Array.isArray(trtNews) ? trtNews : trtNews ? [trtNews] : []
        const manuelArray = Array.isArray(manuelNews) ? manuelNews : manuelNews ? [manuelNews] : []

        const sorted = sortNewsData([...trtArray, ...manuelArray])

        if (sorted.length === 0) {
          throw new Error("Hiç haber bulunamadı.")
        }

        // Kategorilere ayır
        const grouped = {}
        const categoryList = []

        sorted.forEach((item) => {
          const category = item.kategori || "Diğer"
          if (!grouped[category]) {
            grouped[category] = []
            categoryList.push(category)
          }
          grouped[category].push(item)
        })

        setNewsData(sorted)
        setCategorizedNews(grouped)
        setCategories(categoryList)
        setError(null)
      } catch (err) {
        console.error("Haber yüklenemedi:", err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) return <div className="text-center my-5">Haberler yükleniyor...</div>
  if (error) return <div className="text-center my-5 text-danger">Hata: {error}</div>
  if (newsData.length === 0) return <div className="text-center my-5">Haber bulunamadı.</div>

  return (
    <Container>
      {/* Breaking News */}
      <div className="breaking-news">
        <BreakingNews items={newsData.slice(0, 6)} />
      </div>

      {/* Carousel */}
      <section className="main-carousel">
        <CarouselHome items={newsData.slice(6, 12)} cardItems={newsData.slice(12, 18)} />
      </section>

      {/* Grid */}
      <CardGridLayout items={newsData.slice(18, 24)} />

      {/* Kategorilere göre içerik */}
      <section className="news-categories">
        <Container fluid>
          <Row>
            <Col lg={8} md={7}>
              {categories.map((category, index) => {
                const items = categorizedNews[category]
                if (!items || items.length === 0) return null

                let GroupComponent = FirstGroup
                if (index % 3 === 1) GroupComponent = SecondGroup
                if (index % 3 === 2) GroupComponent = SliderGroup

                return (
                  <div key={category} className="category-section mb-5">
                    <h2 className="category-title border-bottom pb-2 mb-3">
                      {category.toUpperCase()}
                    </h2>
                    <GroupComponent items={items.slice(0, 6)} />
                  </div>
                )
              })}
            </Col>

            {/* Sidebar */}
            <Col lg={4} md={5}>
              <VideoComponent />
              <LiveTv />
            </Col>

            {/* YAZARLAR */}
            <Col lg={12}>
              <div className="columnist-section mt-5">
                <h2 className="category-title">YAZARLARIMIZ</h2>
                <div className="columnist-carousel">
                  <button className="columnist-nav prev">
                    <FaChevronLeft />
                  </button>
                  <div className="columnist-container">
                    <Row>
                      {[
                        { name: "Bülent Erandaç", title: "Yolun açık olsun Türkiye" },
                        { name: "Ekrem Kızıltaş", title: "Olacak olan oluyor..." },
                        { name: "Nihat Hatipoğlu", title: "Cennetin kapıları açıldı" },
                        { name: "Melih Altınok", title: "Vahşi Batı ve şemsiye" },
                        { name: "Erhan Afyoncu", title: "Osmanlı'da iftar, ilk üç gün aile..." },
                        { name: "Haşmet Babaoğlu", title: "Kalabalık içinde yalnızlık meselesi" },
                      ].map((columnist, index) => (
                        <Col xs={4} sm={4} md={2} key={index}>
                          <div className="columnist-item text-center">
                            <img
                              src={`/placeholder.svg?height=80&width=80`}
                              alt={columnist.name}
                              className="rounded-circle mb-2"
                              width={80}
                              height={80}
                            />
                            <h4 className="columnist-name">{columnist.name}</h4>
                            <p className="columnist-title">{columnist.title}</p>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                  <button className="columnist-nav next">
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Container>
  )
}

export default SpecialNewsCategory
