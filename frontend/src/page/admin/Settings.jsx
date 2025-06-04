// src/pages/Settings.jsx

import { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import "../../style/settings.css";

function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [siteTitle, setSiteTitle] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    // API'den mevcut ayarları çek (simülasyon)
    setSiteTitle("Haberin Merkezi");
    setSiteDescription("En güncel haberler burada!");
    setDarkMode(false);
    setNotificationsEnabled(true);
  }, []);

  const handleSave = () => {
    // API'ye POST ile ayarları kaydet
    console.log({ siteTitle, siteDescription, darkMode, notificationsEnabled });
    alert("Ayarlar başarıyla kaydedildi!");
  };

  return (
    <Container fluid className="settings-page p-4">
      <h2 className="mb-4">Site Ayarları</h2>
      <Form>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="siteTitle">
              <Form.Label>Site Başlığı</Form.Label>
              <Form.Control
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="siteDescription">
              <Form.Label>Site Açıklaması</Form.Label>
              <Form.Control
                type="text"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Check
              type="switch"
              id="darkModeSwitch"
              label="Karanlık Mod"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          </Col>

          <Col md={6}>
            <Form.Check
              type="switch"
              id="notificationSwitch"
              label="Bildirimleri Aç"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            />
          </Col>
        </Row>

        <Button variant="primary" onClick={handleSave}>
          Kaydet
        </Button>
      </Form>
    </Container>
  );
}

export default Settings;
