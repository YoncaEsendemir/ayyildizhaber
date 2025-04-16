import { FaPlay } from "react-icons/fa"; 

function LiveTv() {
  return (
    <div className="live-tv-section">
      <h2 className="category-title">CANLI YAYIN</h2>
      <div className="live-tv-container">
        <div className="live-tv-player">
          <video
            controls
            width="100%"
            height="200"
            poster="/placeholder.svg?height=200&width=350"
            style={{ objectFit: "cover" }}
          >
            <source src="https://www.example.com/live-stream.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="live-tv-overlay">
            <FaPlay className="play-icon-large" />
          </div>
        </div>
        <div className="live-tv-info">
          <div className="program-time">
            <span className="current-time">21:00</span>
            <span className="program-name">İlke Gündem</span>
            <span className="next-time">00:00</span>
          </div>
          <div className="program-schedule"></div>
        </div>
      </div>
    </div>
  );
}

export default LiveTv;
