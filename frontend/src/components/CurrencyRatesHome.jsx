"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { fetchCurrencyGold, fetchCurrencyCrypto, fetchCurrencyMoney, fetchCurrencyHistory } from "../utils/api"
import { Container, Row } from "react-bootstrap"
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

    ctx.beginPath() //yeni bir çizim yolunun başlangıcını işaretler.
    ctx.strokeStyle = color // ile çizgi rengi ayarlanır.
    ctx.lineWidth = 1.5 // çizgi kalınlığı ayarlanır.

    data.forEach((value, index) => {
      const x = padding + (index / (data.length - 1)) * effectiveWidth
      const y = height - padding - ((value - min) / range) * effectiveHeight

      if (index === 0) {
        ctx.moveTo(x, y) //çizim yolunun başlangıcını belirler.
      } else {
        ctx.lineTo(x, y) //  mevcut noktadan bir sonraki noktaya bir çizgi çizilir.
      }
    })

    ctx.stroke() // çizim işlemi tamamlanır ve çizgi canvas üzerinde görüntülenir.
  }, [])

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
      } catch (err) {
        console.error("Döviz verileri yüklenirken hata oluştu:", err)
        setError("Döviz verileri yüklenemedi")
      } finally {
        setLoading(false)
      }
    }

    getCurrencies()
    // 5 dakikada bir kontrol et (cache varsa API'ye istek atmaz)
    const intervalId = setInterval(getCurrencies, 8 * 60 * 1000)
    return () => clearInterval(intervalId)
  }, [])

  const getSparklineData = (currencyKey) => {
    if (!currencyHistory || currencyHistory.length === 0) {
      return []
    } 

    return currencyHistory
      .map((item) => {
        let value
        if (["USD", "EUR", "GBP"].includes(currencyKey)) {
          value = item?.money?.[currencyKey]?.buying
        } else if (currencyKey === "GRA") {
          value = item?.gold?.[currencyKey]?.buying
        } else if (currencyKey === "BTC") {
          value = item?.crypto?.[currencyKey]?.buying
        }
        return value ? Number.parseFloat(value) : null
      })
      .filter((v) => v !== null)
  }

  useEffect(() => {
    const currencies = [
      { key: "USD", trend: Number(currenciesMoney?.USD_Change) >= 0 ? "up" : "down" },
      { key: "EUR", trend: Number(currenciesMoney?.EUR_Change) >= 0 ? "up" : "down" },
      { key: "GRA", trend: Number(currenciesGold?.GRA_Change) >= 0 ? "up" : "down" },
      { key: "BTC", trend: Number(currenciesCrypto?.BTC_Change) >= 0 ? "up" : "down" },
    ]

    currencies.forEach(({ key, trend }) => {
      const data = getSparklineData(key)
      const color = trend === "up" ? "#10b981" : "#ef4444"
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

  const renderCurrencyCard = (key, label, type, trend, value, change) => (
    <div className="currency-card" key={key}>
      <div className="currency-title">{label}</div>
      <div className="currency-value-container">
        <div className={`currency-value ${trend}`}>
          {trend === "up" ? "▲" : trend === "down" ? "▼" : "="} {value || "N/A"}
        </div>
        <div className={`currency-change ${trend}`}>{change}%</div>
      </div>
      <div
        className="sparkline-container"
        onMouseMove={(e) => showTooltip(e, label, value, new Date().toLocaleString("tr-TR"))}
        onMouseLeave={hideTooltip}
      >
        <canvas ref={canvasRefs[key]} width="120" height="40" className="sparkline" />
      </div>
    </div>
  )

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
              Number(currenciesMoney?.USD_Change) >= 0
                ? "up"
                : Number(currenciesMoney?.USD_Change) < 0
                  ? "down"
                  : "neutral",
              currenciesMoney?.USD_Buying ?? "N/A",
              Math.abs(Number(currenciesMoney?.USD_Change ?? 0)).toFixed(2),
            )}
            {renderCurrencyCard(
              "EUR",
              "EURO",
              "money",
              Number(currenciesMoney?.EUR_Change) >= 0
                ? "up"
                : Number(currenciesMoney?.EUR_Change) < 0
                  ? "down"
                  : "neutral",
              currenciesMoney?.EUR_Buying ?? "N/A",
              Math.abs(Number(currenciesMoney?.EUR_Change ?? 0)).toFixed(2),
            )}
            {renderCurrencyCard(
              "GRA",
              "ALTIN(gr)",
              "gold",
              Number(currenciesGold?.GRA_Change) >= 0
                ? "up"
                : Number(currenciesGold?.GRA_Change) < 0
                  ? "down"
                  : "neutral",
              currenciesGold?.GRA_Buying ?? "N/A",
              Math.abs(Number(currenciesGold?.GRA_Change ?? 0)).toFixed(2),
            )}
            {renderCurrencyCard(
              "BTC",
              "BITCOIN",
              "crypto",
              Number(currenciesCrypto?.BTC_Change) >= 0
                ? "up"
                : Number(currenciesCrypto?.BTC_Change) < 0
                  ? "down"
                  : "neutral",
              currenciesCrypto?.BTC_Buying ?? "N/A",
              Math.abs(Number(currenciesCrypto?.BTC_Change ?? 0)).toFixed(2),
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
    </Container>
  )
}

export default CurrencyRatesHome
