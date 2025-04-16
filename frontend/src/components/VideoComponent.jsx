import { FaPlay } from "react-icons/fa";

const VideoPlayer = ({ title, poster, src }) => (
  <div className="video-player mb-4">
    <video controls width="100%" height="180" poster={poster} style={{ objectFit: "cover" }}>
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <h5 className="mt-2">{title}</h5>
  </div>
);

const VideoNews = () => {
  const defaultTitle = "Minikler afet bilincini tatbikatla öğrendi";
  const defaultPoster = "/placeholder.jpg";
  const defaultSrc = "#";

  return (
    <div className="video-news">
      <h2 className="category-title">VİDEO HABERLER</h2>
      {[...Array(3)].map((_, index) => (
        <VideoPlayer key={index} title={defaultTitle} poster={defaultPoster} src={defaultSrc} />
      ))}
    </div>
  );
};

export default VideoNews;
