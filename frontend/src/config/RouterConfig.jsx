import { Routes, Route } from "react-router-dom"
import Home from "../page/Home"
import VideoCategory from "../categories/VideoCategory"
import WorldCategory from "../categories/WorldCategory"
import SportCategory from "../categories/SportCategory"
import SpecialNewsCategory from "../categories/SpecialNewsCategory"
import OfficialAnnouncementCategory from "../categories/OfficialAnnouncementCategory"
import LiveTvCategory from "../categories/LiveTvCategory"
import LastMinuteCategory from "../categories/LastMinutCategory" // Düzeltildi
import EconomyCategory from "../categories/EconomyCategory"
import AgendaCategory from "../categories/AgendaCategory"
import NewsContent2 from "../newsContent/NewsContent2"
import WeatherPage from "../page/WeatherPage"
import MansetNews from "../page/MansetNews"
import PrayerTime from "../page/PrayerTime"
import Education from "../page/Education"
import CultureArt from "../page/CultureArt"
import Yasam from "../page/Yasam"
import Politic from "../page/Politic"
import Technology from "../page/Technology"
import Health from "../page/Health"
import Carpage from "../page/CarPage"

function RouterConfig() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/video" element={<VideoCategory />} />
      <Route path="/gundem" element={<AgendaCategory />} />
      <Route path="/ekonomi" element={<EconomyCategory />} />
      <Route path="/dunya" element={<WorldCategory />} />
      <Route path="/spor" element={<SportCategory />} />
      <Route path="/son-dakika" element={<LastMinuteCategory />} /> {/* Tekrarı kaldırıldı */}
      <Route path="/canli-tv" element={<LiveTvCategory />} />
      <Route path="/ozel-haber" element={<SpecialNewsCategory />} />
      <Route path="/resmi-ilan" element={<OfficialAnnouncementCategory />} />
      <Route path="ezan-vakti" element={<PrayerTime />} />
      <Route path="haber-icerik" element={<NewsContent2 />} />
      <Route path="/egitim" element={<Education />} />
      <Route path="/siyaset" element={<Politic />} />
      <Route path="/hava-durumu" element={<WeatherPage />} />
      <Route path="/yasam" element={<Yasam />} />
      <Route path="/teknoloji" element={<Technology />} />
      <Route path="/saglik" element={<Health />} />
      <Route path="/kultur-sanat" element={<CultureArt />} />
      <Route path="/search" element={<Home />} /> {/* Temporary using Home as search results page */}
      <Route path="/manset" element={<MansetNews/>} />
      <Route path="/otomobil" element={<Carpage/>} />

    </Routes>
  )
}

export default RouterConfig

