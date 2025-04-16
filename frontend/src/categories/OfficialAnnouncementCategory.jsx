"use client"

import { Container, Form } from "react-bootstrap"
import { useState } from "react"
import "../style/officialAnnouncement.css"

function OfficialAnnouncementCategory() {
  const [selectedDate, setSelectedDate] = useState("17.04.2025")

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
  }

  return (
    <Container>
      <section className="official-announcement-section">
        <div className="announcement-header">
          <h2 className="announcement-title">RESMİ İLANLAR</h2>
        </div>

        <div className="date-filter">
          <label htmlFor="date-filter">Tarih'e göre sırala:</label>
          <Form.Control
            type="text"
            id="date-filter"
            className="date-input"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>

        <div className="announcement-divider"></div>

        <div className="announcement-message">
          Bu tarih için girilmiş ilan bulunamadı. Diğer tarihlerdeki ilanlar için tarih filtresini kullanabilirsiniz.
        </div>
      </section>
    </Container>
  )
}

export default OfficialAnnouncementCategory
