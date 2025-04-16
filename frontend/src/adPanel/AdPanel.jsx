import { Card } from "react-bootstrap"
import "../App.css"

function AdPanel({ position, link }) {
  return (
    <Card className={`ad-panel ${position}`}>
      <Card.Body>
        <a href={link} target="_blank"  rel="noopener noreferrer">
          <img src="/ads/ad-banner.jpg" alt="Reklam" className="ad-image"></img>
        </a>
      </Card.Body>
    </Card>
  )
}

export default AdPanel

