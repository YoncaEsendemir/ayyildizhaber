"use client"

import { useEffect, useState } from "react"
import { fetchCurrencyGold, fetchCurrencyCrypto, fetchCurrencyMoney, fetchCurrencyHistory } from "../utils/api"
import { Container, Row, Col, Nav } from "react-bootstrap"
import { FaChevronRight, FaDollarSign, FaEuroSign, FaPoundSign, FaCoins, FaBitcoin } from "react-icons/fa"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import "../App.css"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

function CurrencyRates() {
  const [currenciesMoney, setCurrenciesMoney] = useState({})
  const [currenciesGold, setCurrenciesGold] = useState({})
  const [currenciesCrypto, setCurrenciesCrypto] = useState({})
  const [currencyHistory, setCurrencyHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("USD")
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    const getCurrencies = async () => {
      try {
        setLoading(true)
        setError(null)

        const [moneyData, goldData, cryptoData, historyData] = await Promise.all([
          fetchCurrencyMoney(),
          fetchCurrencyGold(),
          fetchCurrencyCrypto(),
          fetchCurrencyHistory(),
        ])

        setCurrenciesMoney(moneyData)
        setCurrenciesGold(goldData)
        setCurrenciesCrypto(cryptoData)
        setCurrencyHistory(historyData)
        setLastUpdate(new Date().toLocaleString("tr-TR"))
      } catch (err) {
        console.error("Döviz verileri yüklenirken hata oluştu:", err)
        setError("Döviz verileri yüklenemedi")
      } finally {
        setLoading(false)
      }
    }

    getCurrencies()
    // 5 dakikada bir kontrol et (cache varsa API'ye istek atmaz)
    const intervalId = setInterval(getCurrencies, 5 * 60 * 1000)
    return () => clearInterval(intervalId)
  }, [])

  // Tüm para birimleri için etiketler ve ikonlar
  const currencyLabels = [
    { key: "USD", label: "DOLAR", type: "money", icon: <FaDollarSign className="currency-icon" /> },
    { key: "EUR", label: "EURO", type: "money", icon: <FaEuroSign className="currency-icon" /> },
    { key: "GBP", label: "STERLİN", type: "money", icon: <FaPoundSign className="currency-icon" /> },
    { key: "GRA", label: "GRAM ALTIN", type: "gold", icon: <FaCoins className="currency-icon" /> },
    { key: "BTC", label: "BITCOIN", type: "crypto", icon: <FaBitcoin className="currency-icon" /> },
  ]

  const getChartData = (currencyKey) => {
    if (!currencyHistory || currencyHistory.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: "Alış",
            data: [],
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
          {
            label: "Satış",
            data: [],
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      }
    }

    const labels = currencyHistory.map((item) => {
      const date = new Date(item.timestamp)
      return date.toLocaleDateString("tr-TR") + " " + date.toLocaleTimeString("tr-TR")
    })

    const buyingData = []
    const sellingData = []

    currencyHistory.forEach((item) => {
      let currencyData

      if (currencyKey === "USD" || currencyKey === "EUR" || currencyKey === "GBP") {
        currencyData = item.money[currencyKey]
      } else if (currencyKey === "GRA") {
        currencyData = item.gold[currencyKey]
      } else if (currencyKey === "BTC") {
        currencyData = item.crypto[currencyKey]
      }

      if (currencyData) {
        buyingData.push(Number.parseFloat(currencyData.buying))
        sellingData.push(Number.parseFloat(currencyData.selling))
      }
    })

    return {
      labels,
      datasets: [
        {
          label: "Alış",
          data: buyingData,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
        {
          label: "Satış",
          data: sellingData,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    }
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Son 10 Veri Grafiği",
      },
    },
  }

  return (
    <Container fluid>
      {/* Başlık */}
      <Row className="mb-3">
        <Col xs={12}>
          <div className="d-flex justify-content-between align-items-center">
            <h4>Döviz Kurları</h4>
            {lastUpdate && <small className="text-muted">Son güncelleme: {lastUpdate}</small>}
          </div>
        </Col>
      </Row>

      <Row className="align-items-center py-2">
        <Col xs={12} md={9}>
          <div className="currency-scroll d-flex overflow-auto">
            {loading ? (
              <div className="currency-item">Yükleniyor...</div>
            ) : error ? (
              <div className="currency-item text-danger">{error}</div>
            ) : (
              currencyLabels.map(({ key, label, type, icon }) => {
                let buyingRate, sellingRate, changeRate

                if (type === "crypto") {
                  buyingRate = currenciesCrypto[`${key}_Buying`]
                  sellingRate = currenciesCrypto[`${key}_Selling`]
                  changeRate = Number.parseFloat(currenciesCrypto[`${key}_Change`]) || 0
                } else if (type === "gold") {
                  buyingRate = currenciesGold[`${key}_Buying`]
                  sellingRate = currenciesGold[`${key}_Selling`]
                  changeRate = Number.parseFloat(currenciesGold[`${key}_Change`]) || 0
                } else if (type === "money") {
                  buyingRate = currenciesMoney[`${key}_Buying`]
                  sellingRate = currenciesMoney[`${key}_Selling`]
                  changeRate = Number.parseFloat(currenciesMoney[`${key}_Change`]) || 0
                }

                const trend = changeRate > 0 ? "up" : changeRate < 0 ? "down" : "neutral"

                return (
                  <div
                    key={key}
                    className={`currency-item px-3 d-flex align-items-center ${activeTab === key ? "active" : ""}`}
                    onClick={() => setActiveTab(key)}
                    style={{ cursor: "pointer" }}
                  >
                    {icon}
                    <span className="fw-bold ms-1">{label}</span>
                    <span className="ms-2">
                      {buyingRate || "N/A"} / {sellingRate || "N/A"}
                    </span>
                    {changeRate !== 0 && (
                      <span className={`ms-2 ${trend}`}>
                        {trend === "up" ? "▲" : trend === "down" ? "▼" : "="} {Math.abs(changeRate).toFixed(2)}%
                      </span>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </Col>
        <Col xs={12} md={3} className="text-end d-flex align-items-center mr-3">
          <Nav.Link
            href="/hava-durumu"
            target="_blank"
            rel="noopener noreferrer"
            className="manset-link d-flex align-items-center mx-3"
          >
            <span>Hava Durumu</span>
            <FaChevronRight className="ms-2" />
          </Nav.Link>

          <Nav.Link
            href="/manset"
            target="_blank"
            rel="noopener noreferrer"
            className="manset-link d-flex align-items-center"
          >
            <span>Manşet Haberleri</span>
            <FaChevronRight className="ms-2" />
          </Nav.Link>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <div className="chart-container" style={{ height: "400px" }}>
            <h4 className="text-center mb-3">
              {currencyLabels.find((c) => c.key === activeTab)?.label} Değişim Grafiği
            </h4>
            <Line options={chartOptions} data={getChartData(activeTab)} />
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default CurrencyRates
