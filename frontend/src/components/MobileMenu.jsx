"use client"
import { Button } from "react-bootstrap"
import { FaSearch, FaTimes } from "react-icons/fa"
import logo from "../logo/logo.jpg"
import { useState, useRef } from "react"
function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null
  const searchInputRef = useRef(null)
  const [searchText, setSearchText] = useState("")

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      // Open search results in a new tab
      window.open(`/${encodeURIComponent(searchText)}`, "_blank")
      setSearchText("") // Clear the search input
      setShowInput(false) // Hide the search input after search
    }
  }

  const handleInputChange = (e) => {
    setSearchText(e.target.value)
  }

  return (
    <div className="mobile-menu-overlay">
      <div className="mobile-dropdown-header">
        <div className="mobile-logo">
          <img src={logo || "/placeholder.svg"} alt="Logo" />
        </div>
        <Button variant="link" className="mobile-close-btn" onClick={onClose}>
          <FaTimes />
        </Button>
      </div>

      <div className="mobile-search">
        <input type="text"
          ref={searchInputRef}
          value={searchText}
          onChange={handleInputChange}
          placeholder="Ara..."
          className="form-control"
          onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()} />
        <button >
          <FaSearch />
        </button>
      </div>

      <ul className="dropdown-menu-list">
        <li>
          <a href="/manset">TÜM MANŞETLER</a>
        </li>
        <li>
          <a href="/son-dakika">SON DAKİKA</a>
        </li>
        <li>
          <a href="/ozel-haber">ÖZEL HABER</a>
        </li>
        <li>
          <a href="/gundem">GÜNDEM</a>
        </li>
        <li>
          <a href="/ekonomi">EKONOMİ</a>
        </li>
        <li>
          <a href="/yasam">YAŞAM</a>
        </li>
        <li>
          <a href="/dunya">DÜNYA</a>
        </li>
        <li>
          <a href="/spor">SPOR</a>
        </li>
        <li>
          <a href="/yasam">MAGAZİN</a>
        </li>
        <li>
          <a href="/kategori/viral">VİRAL</a>
        </li>

        <li>
          <a href="/kultur-sanat">YAZARLAR</a>
        </li>
        <li>
          <a href="/canli-tv">CANLI TV</a>
        </li>
      </ul>
    </div>
  )
}

export default MobileMenu

