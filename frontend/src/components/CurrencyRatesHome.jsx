"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { fetchCurrencyGold, fetchCurrencyCrypto, fetchCurrencyMoney, fetchCurrencyHistory } from "../utils/api"
import { Container, Row, Col, Nav } from "react-bootstrap"
import {  FaChevronRight, FaDollarSign, FaEuroSign, FaPoundSign, FaCoins, FaBitcoin} from "react-icons/fa"
import "../App.css"

function CurrencyRatesHome() {
  const [currenciesMoney, setCurrenciesMoney] = useState({})
  const [currenciesGold, setCurrenciesGold] = useState({})
  const [currenciesCrypto, setCurrenciesCrypto] = useState({})
  const [currencyHistory, setCurrencyHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tooltipData, setTooltipData] = useState(null)
  const tooltipRef = useRef(null)
  const [activeTab, setActiveTab] = useState("USD")

  // Her para birimi için ayrı canvas ref
  const canvasRefs = {
    USD: useRef(null),
    EUR: useRef(null),
    GRA: useRef(null),
    BTC: useRef(null),
  }

  const drawSparkline = useCallback((canvasRef, data, color) => {
    if (!canvasRef.current || !data || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height
    const padding = 2
    const effectiveWidth = width - 2 * padding
    const effectiveHeight = height - 2 * padding

    ctx.clearRect(0, 0, width, height)

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1

    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 1.5

    data.forEach((value, index) => {
      const x = padding + (index / (data.length - 1)) * effectiveWidth
      const y = height - padding - ((value - min) / range) * effectiveHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()
  }, [])

  useEffect(() => {
    const getCurrencies = async () => {
      try {
        setLoading(true)
        const moneyData = await fetchCurrencyMoney()
        const goldData = await fetchCurrencyGold()
        const cryptoData = await fetchCurrencyCrypto()
        const historyData = await fetchCurrencyHistory()

        setCurrenciesMoney(moneyData)
        setCurrenciesGold(goldData)
        setCurrenciesCrypto(cryptoData)
        setCurrencyHistory(historyData)
        setError(null)
      } catch (err) {
        console.error("Döviz verileri yüklenirken hata oluştu:", err)
        setError("Döviz verileri yüklenemedi")
      } finally {
        setLoading(false)
      }
    }

    getCurrencies()
    const intervalId = setInterval(getCurrencies, 2 * 60 * 60 * 1000) // 2 saatte bir güncelle
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
  const getSparklineData = (currencyKey) => {
    if (!currencyHistory || currencyHistory.length === 0) {
      return []
    }

    const data = []

    currencyHistory.forEach((item) => {
      let value = null

      if (currencyKey === "USD" || currencyKey === "EUR" || currencyKey === "GBP") {
        value = item.money?.[currencyKey]?.buying
      } else if (currencyKey === "GRA") {
        value = item.gold?.[currencyKey]?.buying
      } else if (currencyKey === "BTC") {
        value = item.crypto?.[currencyKey]?.buying
      }

      if (value) {
        data.push(Number.parseFloat(value))
      }
    })

    return data
  }

  useEffect(() => {
    const currencies = [
      { key: "USD", trend: Number(currenciesMoney.USD_Change) >= 0 ? "up" : "down" },
      { key: "EUR", trend: Number(currenciesMoney.EUR_Change) >= 0 ? "up" : "down" },
      { key: "GRA", trend: Number(currenciesGold.GRA_Change) >= 0 ? "up" : "down" },
      { key: "BTC", trend: Number(currenciesCrypto.BTC_Change) >= 0 ? "up" : "down" },
    ]

    currencies.forEach(({ key, trend }) => {
      const data = getSparklineData(key)
      const color = trend === "up" ? "#f44336" : "#4caf50"
      drawSparkline(canvasRefs[key], data, color)
    })
  }, [currencyHistory, currenciesMoney, currenciesGold, currenciesCrypto, drawSparkline])

  const showTooltip = (e, currency, value, timestamp) => {
    if (!tooltipRef.current) return

    setTooltipData({ currency, value, timestamp, x: e.clientX, y: e.clientY })
    tooltipRef.current.style.display = "block"
    tooltipRef.current.style.left = `${e.pageX}px`
    tooltipRef.current.style.top = `${e.pageY - 70}px`
  }

  const hideTooltip = () => {
    if (!tooltipRef.current) return
    tooltipRef.current.style.display = "none"
    setTooltipData(null)
  }

  const renderCurrencyCard = (key, label, type, trend, value, change) => {
    return (
      <div className="currency-card" key={key}>
        <div className="currency-title">{label}</div>
        <div className="currency-value-container">
          <div className={`currency-value ${trend}`}>
            {trend === "up" ? "▲" : "▼"} {value}
          </div>
          <div className={`currency-change ${trend}`}>{change}%</div>
        </div>
        <div
          className="sparkline-container"
          onMouseMove={(e) => showTooltip(e, label, value, new Date().toLocaleString())}
          onMouseLeave={hideTooltip}
        >
          <canvas ref={canvasRefs[key]} width="120" height="40" className="sparkline" />
        </div>
      </div>
    )
  }

  return (
    <Container fluid className="currency-container">
      <Row className="currency-row">
        {loading ? (
          <div className="loading">Yükleniyor...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            {renderCurrencyCard(
              "USD",
              "DOLAR",
              "money",
              Number(currenciesMoney.USD_Change) >= 0 ? "up" : "down",
              currenciesMoney.USD_Buying,
              Math.abs(Number(currenciesMoney.USD_Change)).toFixed(2),
            )}
            {renderCurrencyCard(
              "EUR",
              "EURO",
              "money",
              Number(currenciesMoney.EUR_Change) >= 0 ? "up" : "down",
              currenciesMoney.EUR_Buying,
              Math.abs(Number(currenciesMoney.EUR_Change)).toFixed(2),
            )}
            {renderCurrencyCard(
              "GRA",
              "ALTIN(gr)",
              "gold",
              Number(currenciesGold.GRA_Change) >= 0 ? "up" : "down",
              currenciesGold.GRA_Buying,
              Math.abs(Number(currenciesGold.GRA_Change)).toFixed(2),
            )}
            {renderCurrencyCard(
              "BTC",
              "BİST 100",
              "crypto",
              Number(currenciesCrypto.BTC_Change) >= 0 ? "up" : "down",
              currenciesCrypto.BTC_Buying,
              Math.abs(Number(currenciesCrypto.BTC_Change)).toFixed(2),
            )}
          </>
        )}
      </Row>

      <div ref={tooltipRef} className="currency-tooltip" style={{ display: "none" }}>
        {tooltipData && (
          <>
            <div className="tooltip-time">{tooltipData.timestamp}</div>
            <div className="tooltip-value">{tooltipData.value}</div>
            <div className="tooltip-currency">{tooltipData.currency}</div>
          </>
        )}
      </div>

      <Row className="links-row">
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

                const trend = changeRate > 0 ? "up" : "down"

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
                      {buyingRate} / {sellingRate}
                    </span>
                    <span className={`ms-2 ${trend}`}>
                      {trend === "up" ? "▲" : "▼"} {Math.abs(changeRate).toFixed(2)}%
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </Col>


        <Col xs={12} className="text-end d-flex justify-content-end">
          <Nav.Link href="/hava-durumu" target="_blank" className="manset-link d-flex align-items-center mx-3">
            <span>Hava Durumu</span>
            <FaChevronRight className="ms-2" />
          </Nav.Link>
          <Nav.Link href="/manset" target="_blank" className="manset-link d-flex align-items-center">
            <span>Manşet Haberleri</span>
            <FaChevronRight className="ms-2" />
          </Nav.Link>
        </Col>
      </Row>
    </Container>
  )
}

export default CurrencyRatesHome
