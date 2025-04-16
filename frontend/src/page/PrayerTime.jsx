"use client"

import { useEffect, useState } from "react"
import { Container, Row, Col, Form, Spinner, Alert, Card } from "react-bootstrap"
import { ChevronDown } from "lucide-react"
import { fetchAllPrayerTimes, fetchPrayerTimesByCity, fetchTurkeyRegions } from "../utils/api"
import "../style/weatherPrayerTimepage.css"

function PrayerTime() {
  const [allPrayerTimeData, setAllPrayerTimeData] = useState([])
  const [singleCityData, setSingleCityData] = useState(null)
  const [regions, setRegions] = useState([])
  const [selectedCity, setSelectedCity] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentDate, setCurrentDate] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const [viewMode, setViewMode] = useState("all") // "all" or "single"

  // Update date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        weekday: "long",
      }
      const dateStr = now.toLocaleDateString("tr-TR", options).replace(/\./g, "")
      const timeStr = now.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })

      setCurrentDate(dateStr)
      setCurrentTime(timeStr)
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  // Fetch prayer times data and regions
  useEffect(() => {
    const getPrayerTimeDataAndRegions = async () => {
      try {
        const data = await fetchAllPrayerTimes()
        const data2 = await fetchTurkeyRegions()
        setAllPrayerTimeData(data)
        setRegions(data2)
      } catch (err) {
        setError("Ezan vakti yüklenemedi")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getPrayerTimeDataAndRegions()
  }, [])

  // Handle city selection from dropdown
  const handleCitySelect = async (e) => {
    const city = e.target.value
    if (city && city !== "İL SEÇİNİZ") {
      setSelectedCity(city)
      await fetchCityData(city)
    } else {
      setSelectedCity("")
      setSingleCityData(null)
      setViewMode("all")
    }
  }

  // Handle city selection from list
  const handleCityClick = async (city) => {
    setSelectedCity(city)
    await fetchCityData(city)
  }

  // Fetch data for a specific city
  const fetchCityData = async (city) => {
    try {
      setSearchLoading(true)
      setSearchError(null)
      const cityData = await fetchPrayerTimesByCity(city)
      if (cityData) {
        setSingleCityData(cityData)
        setViewMode("single")
      } else {
        setSearchError(`${city} için namaz vakti bulunamadı!`)
        setSingleCityData(null)
        setViewMode("all")
      }
    } catch (err) {
      console.error("Şehir namaz vakti yükleme hatası:", err)
      setSearchError("Şehir namaz vakti yüklenemedi")
      setSingleCityData(null)
      setViewMode("all")
    } finally {
      setSearchLoading(false)
    }
  }

  // Handle city search
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    try {
      setSearchLoading(true)
      setSearchError(null)
      const cityData = await fetchPrayerTimesByCity(searchTerm)
      if (!cityData) {
        setSearchError("Şehire göre ezan vakti bulunamadı!")
        setSingleCityData(null)
        setViewMode("all")
      } else {
       // console.log(cityData)
        setSingleCityData(cityData)
        setSelectedCity(cityData.place?.name || searchTerm)
        setViewMode("single")
      }
    } catch (err) {
      console.error("Şehir arama hatası:", err)
      setSearchError("Şehir arama sırasında bir hata oluştu.")
      setSingleCityData(null)
      setViewMode("all")
    } finally {
      setSearchLoading(false)
      setSearchTerm("")
    }
  }

  // Get today's date in the format expected by the API
  const getTodayFormattedDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Render single city prayer times
  const renderSingleCityPrayerTimes = () => {
    if (!singleCityData) return null

    const formattedDate = getTodayFormattedDate()
    const times = singleCityData.times && singleCityData.times[formattedDate]
    const cityName = singleCityData.place?.name || selectedCity

    return (
      <Col sm={12} md={8} className="mx-auto">
        <Card className="prayer-city-card">
          <Card.Header className="prayer-city-header">{cityName}</Card.Header>
          <Card.Body className="prayer-times-body">
            <div className="prayer-row">
              <div className="prayer-label">İmsak:</div>
              <div className="prayer-time">{times && times[0] ? times[0] : "Bilinmiyor"}</div>
            </div>
            <div className="prayer-row">
              <div className="prayer-label">Güneş:</div>
              <div className="prayer-time">{times && times[1] ? times[1] : "Bilinmiyor"}</div>
            </div>
            <div className="prayer-row">
              <div className="prayer-label">Öğle:</div>
              <div className="prayer-time">{times && times[2] ? times[2] : "Bilinmiyor"}</div>
            </div>
            <div className="prayer-row">
              <div className="prayer-label">İkindi:</div>
              <div className="prayer-time">{times && times[3] ? times[3] : "Bilinmiyor"}</div>
            </div>
            <div className="prayer-row">
              <div className="prayer-label">Akşam:</div>
              <div className="prayer-time">{times && times[4] ? times[4] : "Bilinmiyor"}</div>
            </div>
            <div className="prayer-row">
              <div className="prayer-label">Yatsı:</div>
              <div className="prayer-time">{times && times[5] ? times[5] : "Bilinmiyor"}</div>
            </div>
          </Card.Body>
          <Card.Footer className="prayer-city-footer">* Diyanet İşleri Başkanlığı</Card.Footer>
        </Card>
        <div className="text-center mt-3">
          <button className="btn btn-outline-primary" onClick={() => setViewMode("all")}>
            Tüm Şehirleri Göster
          </button>
        </div>
      </Col>
    )
  }

  // Group cities into pairs for display
  const getCityPairs = () => {
    if (!Array.isArray(allPrayerTimeData)) return []

    const pairs = []
    for (let i = 0; i < allPrayerTimeData.length; i += 2) {
      if (i + 1 < allPrayerTimeData.length) {
        pairs.push([allPrayerTimeData[i], allPrayerTimeData[i + 1]])
      } else {
        pairs.push([allPrayerTimeData[i]])
      }
    }
    return pairs
  }

  // Render all cities prayer times grid
  const renderAllCitiesPrayerTimes = () => {
    return (
      <>
        <Col lg={8} md={7} sm={12}>
          <div className="prayer-times-grid">
            {getCityPairs().map((pair, pairIndex) => (
              <Row key={pairIndex} className="mb-4">
                {pair.map((cityData, cityIndex) => {
                  // Get today's formatted date
                  const formattedDate = getTodayFormattedDate()

                  // Get prayer times for today
                  const times = cityData.data && cityData.data.times ? cityData.data.times[formattedDate] : null

                  return (
                    <Col sm={12} md={6} key={cityIndex}>
                      <Card className="prayer-city-card">
                        <Card.Header className="prayer-city-header">{cityData.city}</Card.Header>
                        <Card.Body className="prayer-times-body">
                          <div className="prayer-row">
                            <div className="prayer-label">İmsak:</div>
                            <div className="prayer-time">{times && times[0] ? times[0] : "Bilinmiyor"}</div>
                          </div>
                          <div className="prayer-row">
                            <div className="prayer-label">Güneş:</div>
                            <div className="prayer-time">{times && times[1] ? times[1] : "Bilinmiyor"}</div>
                          </div>
                          <div className="prayer-row">
                            <div className="prayer-label">Öğle:</div>
                            <div className="prayer-time">{times && times[2] ? times[2] : "Bilinmiyor"}</div>
                          </div>
                          <div className="prayer-row">
                            <div className="prayer-label">İkindi:</div>
                            <div className="prayer-time">{times && times[3] ? times[3] : "Bilinmiyor"}</div>
                          </div>
                          <div className="prayer-row">
                            <div className="prayer-label">Akşam:</div>
                            <div className="prayer-time">{times && times[4] ? times[4] : "Bilinmiyor"}</div>
                          </div>
                          <div className="prayer-row">
                            <div className="prayer-label">Yatsı:</div>
                            <div className="prayer-time">{times && times[5] ? times[5] : "Bilinmiyor"}</div>
                          </div>
                        </Card.Body>
                        <Card.Footer className="prayer-city-footer">* Diyanet İşleri Başkanlığı</Card.Footer>
                      </Card>
                    </Col>
                  )
                })}
              </Row>
            ))}
          </div>
        </Col>

        <Col lg={4} md={5} sm={12}>
          <div className="cities-list">
            <h3>Tüm Şehirler</h3>
            <div className="cities-container">
              <Row>
                <Col xs={6} className="cities-column">
                  {regions.slice(0, Math.ceil(regions.length / 2)).map((city, index) => (
                    <div
                      className={`city-item ${selectedCity === city ? "active" : ""}`}
                      key={index}
                      onClick={() => handleCityClick(city)}
                    >
                      {city}
                    </div>
                  ))}
                </Col>
                <Col xs={6} className="cities-column">
                  {regions.slice(Math.ceil(regions.length / 2)).map((city, index) => (
                    <div
                      className={`city-item ${selectedCity === city ? "active" : ""}`}
                      key={index}
                      onClick={() => handleCityClick(city)}
                    >
                      {city}
                    </div>
                  ))}
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </>
    )
  }

  return (
    <Container fluid className="prayer-time-container p-0">
      {/* Search Bar */}
      <div className="search-container">
        <Container>
          <Row className="justify-content-end">
            <Col xs={12} md={4} lg={3}>
              <div className="location-selector">
                <span>Türkiye</span>
                <div className="dropdown">
                  <Form.Select value={selectedCity} onChange={handleCitySelect} className="city-select">
                    <option value="">İL SEÇİNİZ</option>
                    {regions.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                  </Form.Select>
                  <ChevronDown className="dropdown-icon" />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {/* Title and Location Selector */}
        <div className="prayer-header">
          <h2 className="prayer-title">NAMAZ VAKİTLERİ</h2>

          <div className="date-time">
            <div className="date">{currentDate}</div>
            <div className="time">{currentTime}</div>
          </div>
        </div>

        {/* Search Form */}
        <Row className="mb-4">
          <Col md={6} className="mx-auto">
            <Form onSubmit={handleSearch}>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Şehir ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={searchLoading}
                />
                <button type="submit" className="btn btn-primary ms-2" disabled={searchLoading || !searchTerm.trim()}>
                  {searchLoading ? <Spinner animation="border" size="sm" /> : "Ara"}
                </button>
              </div>
              {searchError && (
                <Alert variant="danger" className="mt-2">
                  {searchError}
                </Alert>
              )}
            </Form>
          </Col>
        </Row>

        {/* Prayer Times Content */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="dark" />
            <p className="mt-2">Namaz vakitleri yükleniyor...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Row>{viewMode === "single" ? renderSingleCityPrayerTimes() : renderAllCitiesPrayerTimes()}</Row>
        )}
      </Container>
    </Container>
  )
}

export default PrayerTime
