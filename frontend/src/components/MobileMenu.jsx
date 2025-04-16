"use client"
import { Button } from "react-bootstrap"
import { FaSearch, FaTimes } from "react-icons/fa"
import logo from "../logo/logo.jpg"

function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null

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
        <input type="text" placeholder="Haber Ara" />
        <button>
          <FaSearch />
        </button>
      </div>

      <ul className="dropdown-menu-list">
        <li>
          <a href="/kategori/tum-mansetler">TÜM MANŞETLER</a>
        </li>
        <li>
          <a href="/son-dakika">SON DAKİKA</a>
        </li>
        <li>
          <a href="/ozel-haber">ÖZEL HABER</a>
        </li>
        <li>
          <a href="/kategori/galeri">GALERİ</a>
        </li>
        <li>
          <a href="/gundem">GÜNDEM</a>
        </li>
        <li>
          <a href="/ekonomi">EKONOMİ</a>
        </li>
        <li>
          <a href="/kategori/yasam">YAŞAM</a>
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

