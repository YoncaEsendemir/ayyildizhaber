
import { useEffect, useState } from "react"
import { fetchWeatherData, fetchWeatherByCity } from "../utils/api"
import { Container, Row, Col, Form, Spinner, Alert, InputGroup, Button, Nav, Tab } from "react-bootstrap"
import { FaSearchLocation } from "react-icons/fa";

// Weather icons
import cloud from "../weatericon/cloud.png"
import cloudyDay from "../weatericon/cloudyDay.png"
import rainyDay from "../weatericon/rainyDay.png"
import storm from "../weatericon/storm.png"
import sunny from "../weatericon/sunny.png"
import cloudySunnyRain from "../weatericon/cloudySunnyRain.png"


// Custom CSS
import "../style/weatherPrayerTimepage.css"

function WeatherPage() {
  const [weatherData, setWeatherData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [featuredCity, setFeaturedCity] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState(null)

  // Fetch weather data for predefined cities
  useEffect(() => {
    const getWeatherData = async () => {
      try {
        const data = await fetchWeatherData()
        setWeatherData(data)
        setFeaturedCity(data.find((city) => city.name === "Istanbul") || data[0])
      } catch(err) {
        setError("Hava verileri yüklenemedi",err)
      } finally {
        setLoading(false)
      }
    }
    getWeatherData()
  }, [])


  // Search for a city
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    try {
      setSearchLoading(true)
      setSearchError(null)
      const cityData = await fetchWeatherByCity(searchTerm)
      if (!cityData) {
        setSearchError("Şehir bulunamadı. Lütfen başka bir şehir adı deneyin.")
        setSearchTerm("")
      } else {
        setSearchTerm("")
        setFeaturedCity(cityData) // Set the searched city as featured
      }
    } catch (err) {
      console.error("Şehir arama hatası:", err)
      setSearchError("Şehir arama sırasında bir hata oluştu.")
      setSearchTerm("")
    } finally {
      setSearchLoading(false)
    }

  }

  // Get weather icon based on weather code
  const getWeatherIcon = (code) => {
    if (code < 2) return sunny
    if (code < 3) return cloudyDay
    if (code < 4) return cloud
    if (code < 50) return cloudySunnyRain
    if (code < 60) return rainyDay
    return storm
  }

  // Get weather description based on weather code
  const getWeatherDescription = (code) => {
    if (code < 2) return "Güneşli"
    if (code < 3) return "Parçalı Bulutlu"
    if (code < 4) return "Az Bulutlu"
    if (code < 50) return "Hafif Yağmurlu"
    if (code < 60) return "Yağmurlu"
    return "Fırtınalı"
  }

  // Get min/max temperature (simulated for this example)
  const getMinMaxTemp = (temp) => {
    const min = Math.round(temp - Math.random() * 5)
    return `${Math.round(temp)}°/ ${min}°`
  }

  // Get city background image
  const getCityBackground = (cityName) => {
    const cityImages = {
      Istanbul: "https://th.bing.com/th/id/OIP.PGYZdAIEz1q9cbYlE_R0lQHaE7?rs=1&pid=ImgDetMain",
      Ankara: "https://image.arrivalguides.com/x/04/4f4612eca3367db1a784b3fa45b752cc.jpg",
      Izmir: "https://blog.obilet.com/wp-content/uploads/2018/03/saat_kulesi.jpg",
      Antalya: "https://www.istanbulturkeytravel.com/wp-content/uploads/2020/04/Antalya-Wallpaper-1.jpg",
      Bursa: "https://th.bing.com/th/id/OIP.WA5yRp3eeJ9svVMugCOSawHaEK?rs=1&pid=ImgDetMain  ",
      Trabzon: "https://hdwallsbox.com/wallpapers/l/1920x1080/51/mountains-nature-turkey-trabzon-lakes-farm-uzungol-townscape-1920x1080-50060.jpg",
      Konya: "https://www.anatoliatravelservices.com/img/rehber/konya-the-city-of-rumi.jpg",
      Adana: "https://media-cdn.tripadvisor.com/media/photo-c/1280x250/05/06/b4/b6/adana-merkez-camii.jpg",
      Hatay: "https://hatay.ktb.gov.tr/Resim/237230,habibi-neccar-camiijpg.png?0",

    }

    return cityImages[cityName] || `https://st2.depositphotos.com/1162190/6186/i/450/depositphotos_61868743-stock-photo-weather-forecast-concept.jpg/800x400/?${cityName},city`
  }

  // Get current date
  const getCurrentDate = () => {
    const options = { day: "numeric", month: "numeric", year: "numeric" }
    return new Date().toLocaleDateString("tr-TR", options)
  }

  return (
    <Container fluid className="weather-container p-0">
      {/* Search Bar */}
      <div className="search-container">
        <Container>
          <Row className="justify-content-end">
            <Col xs={12} md={4} lg={3}>
              <Form onSubmit={handleSearch}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Şehir ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="primary" type="submit" disabled={searchLoading}>
                    {searchLoading ? <Spinner animation="border" size="sm" /> : <FaSearchLocation />}
                  </Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="text-center">
              <h1 className="weather-title">HAVA DURUMU</h1>
            </div>
          </Col>
        </Row>

        {/* Featured City */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Hava durumu verileri yükleniyor...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          featuredCity && (
            <Row className="mb-4">
              <Col>
                <div
                  className="featured-city-card"
                  style={{ backgroundImage: `url(${getCityBackground(featuredCity.name)})` }}
                >
                  <div className="featured-city-content">
                    <div className="featured-city-name">{featuredCity.name.toUpperCase()}</div>
                    <div className="featured-date">{getCurrentDate()}</div>
                    <div className="featured-temp">
                      {Math.round(featuredCity.temperature)}
                      <span className="degree-symbol">°</span>
                    </div>
                    <div className="featured-minmax">{getMinMaxTemp(featuredCity.temperature)}</div>
                    <div className="featured-weather-desc">{getWeatherDescription(featuredCity.weatherCode)}</div>
                    <div className="featured-weather-icon">
                      <img src={getWeatherIcon(featuredCity.weatherCode) || "/placeholder.svg"} alt="Weather Icon" />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          )
        )}

        {/* Tabs */}
        <Tab.Container id="weather-tabs" defaultActiveKey="turkiye">
          <Row className="mb-3">
            <Col>
              <Nav variant="tabs" className="weather-tabs">
                <Nav.Item>
                  <Nav.Link eventKey="turkiye" onClick={() => setActiveTab("turkiye")}>
                    Türkiye
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="yurtdisi" onClick={() => setActiveTab("yurtdisi")}>
                    Yurtdışı
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>

          <Tab.Content>
            <Tab.Pane eventKey="turkiye">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Hava durumu verileri yükleniyor...</p>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <Row>
                  {weatherData.map((city) => (
                    <Col key={city.name} xs={12} sm={6} md={4} className="mb-4">
                      <div
                        className="city-weather-card"
                        style={{ backgroundImage: `url(${getCityBackground(city.name)})` }}
                        onClick={() => setFeaturedCity(city)}
                      >
                        <div className="city-weather-content">
                          <div className="city-name">{city.name}</div>
                          <div className="city-temp">
                            {Math.round(city.temperature)}
                            <span className="degree-symbol">°</span>
                          </div>
                          <div className="city-minmax">{getMinMaxTemp(city.temperature)}</div>
                          <div className="city-weather-desc">{getWeatherDescription(city.weatherCode)}</div>
                          <div className="city-weather-icon">
                            <img src={getWeatherIcon(city.weatherCode) || "/placeholder.svg"} alt="Weather Icon" />
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </Tab.Pane>
            <Tab.Pane eventKey="yurtdisi">
              <div className="text-center py-5">
                <p>Yurtdışı hava durumu verileri şu anda mevcut değil.</p>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>

        {/* Search Error */}
        {searchError && (
          <Alert variant="danger" className="mt-3">
            {searchError}
          </Alert>
        )}
      </Container>
    </Container>
  )
}

export default WeatherPage

