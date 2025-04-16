"use client"

import { useRef, useState, useEffect } from "react"
import { FaChevronRight, FaChevronLeft } from "react-icons/fa"
import "../style/slider.css"
import { useNavigate } from "react-router-dom"

export default function SliderGroup({ items }) {
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleNewsClick = (news)=>{
    navigate(`/haber-icerik`, { state: { news } });
    
  }
  const scrollAmount = 300

  const handleScroll = () => {
    if (!sliderRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scroll = (direction) => {
    if (!sliderRef.current) return

    const { scrollLeft } = sliderRef.current
    const newScrollLeft = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount

    sliderRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    })
  }

  // Check arrows visibility on mount and window resize
  useEffect(() => {
    handleScroll()
    window.addEventListener("resize", handleScroll)
    return () => window.removeEventListener("resize", handleScroll)
  }, [])

  return (
    <div className="slider-container">
      {showLeftArrow && (
        <button className="slider-nav prev" onClick={() => scroll("left")} aria-label="Previous items">
          <FaChevronLeft />
        </button>
      )}

      <div className="group-slider" ref={sliderRef} onScroll={handleScroll}>
        {items.map((news) => (
          <div className="group-slider-item" key={news.haber_id}>
            <a onClick={()=>handleNewsClick(news)} style={{ cursor: "pointer" }}  role="button" className="group-slider-link position-relative">
              <div className="group-slider-image">
                <img
                  src={news.resim_link || "/placeholder.svg?height=150&width=220"}
                  alt={news.baslik}
                  width={220}
                  height={150}
                />
              </div>
              <h5 className="group-slider-title fs-6">{news.baslik}</h5>
            </a>
          </div>
        ))}
      </div>

      {showRightArrow && (
        <button className="slider-nav next" onClick={() => scroll("right")} aria-label="Next items">
          <FaChevronRight />
        </button>
      )}
    </div>
  )
}

