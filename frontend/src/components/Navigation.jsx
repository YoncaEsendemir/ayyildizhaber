"use client"

import { useState, useEffect, useRef } from "react"
import { Navbar, Nav, Container, Button } from "react-bootstrap"
import { FaSearch, FaBars, FaShareAlt, FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa"
import { FaMosque } from "react-icons/fa"
import logo from "../logo/ayyildizajans.png"
import "../style/navigasyon.css"
import "../style/mobileMenu.css"
import MobileMenu from "../components/MobileMenu"
import { Link } from "react-router-dom"

function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [showLogo, setShowLogo] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [showSharePanel, setShowSharePanel] = useState(false)
  const searchInputRef = useRef(null)
  const [searchText, setSearchText] = useState("")
  const dropdownRef = useRef(null)
  const sharePanelRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
      // Show logo in navbar when header is hidden (after 200px scroll)
      if (window.scrollY > 200) {
        setShowLogo(true)
      } else {
        setShowLogo(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
      if (sharePanelRef.current && !sharePanelRef.current.contains(event.target)) {
        setShowSharePanel(false)
      }

      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowInput(false)
      }

    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
      
    }
  }, [])

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  const toggleSharePanel = () => {
    setShowSharePanel(!showSharePanel)
  }

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  const handlePageSearch = () => {
    setShowInput(!showInput)
  }

  const handleInputChange = (e) => {
    setSearchText(e.target.value)
  }

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      // Open search results in a new tab
      window.open(`/${encodeURIComponent(searchText)}`, "_blank")
      setSearchText("") // Clear the search input
      setShowInput(false) // Hide the search input after search
    }
  }

  return (
    <>
      <Navbar expand="lg" className={`custom-navbar ${scrolled ? "scrolled" : ""}`} sticky="top">
        <Container fluid className="navbar-container">
          <Navbar.Brand href="/">
            {showLogo && <img src={logo || "/placeholder.svg"} alt="Logo" className="navbar-logo" />}
          </Navbar.Brand>
          <Button variant="link" className="nav-icon-btn d-lg-none" onClick={toggleMobileMenu}>
            <FaBars className="nav-icon" />
          </Button>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto compact-nav">
              {/* 
              <Nav.Link href="/video" target="_blank" rel="noopener noreferrer">
                VİDEO
              </Nav.Link>
               */}
              <Nav.Link href="/gundem" target="_blank" rel="noopener noreferrer">
                GÜNDEM
              </Nav.Link>
              <Nav.Link href="/son-dakika" target="_blank" rel="noopener noreferrer">
               SON DAKİKA
              </Nav.Link>
              <Nav.Link href="/ekonomi" target="_blank" rel="noopener noreferrer">
                EKONOMİ
              </Nav.Link>
              <Nav.Link href="/dunya" target="_blank" rel="noopener noreferrer">
                DÜNYA
              </Nav.Link>
              <Nav.Link href="/spor" target="_blank" rel="noopener noreferrer">
                SPOR
              </Nav.Link>
              <Nav.Link href="/ozel-haber" target="_blank" rel="noopener noreferrer">
                ÖZEL HABER
              </Nav.Link>
              <Nav.Link href="/canli-tv" target="_blank" rel="noopener noreferrer">
                CANLI TV
              </Nav.Link>
              <Nav.Link href="/resmi-ilan" target="_blank" rel="noopener noreferrer">
                RESMİ İLAN
              </Nav.Link>
            </Nav>

            <div className="d-flex align-items-center d-none d-lg-flex">
              <div className="position-relative" ref={dropdownRef}>
                <Button variant="link" className="nav-icon-btn" onClick={toggleDropdown}>
                  <FaBars className="nav-icon" />
                </Button>
                {showDropdown && (
                  <div className="nav-dropdown">
                    <ul className="dropdown-menu-list">
                      <li>
                        <Link to="hava-durumu">Hava Durumu</Link>
                      </li>
                      <li>
                        <Link to="son-dakika">Son Dakika</Link>
                      </li>
                      <li>
                        <Link to="/siyaset">Siyaset</Link>
                      </li>
                      <li>
                        <Link to="/yasam">Yasam</Link>
                      </li>
                      <li>
                        <Link to="/teknoloji">Teknoloji</Link>
                      </li>
                      {/*
                      <li>
                        <Link to="/otomobil">Otomobil</Link>
                      </li>*/}
                      <li>
                        <Link to="/saglik">Sağlık</Link>
                      </li>
                      <li>
                        <Link to="/egitim">Eğitim</Link>
                      </li>
                      <li>
                        <Link to="/kultur-sanat">Kültür Sanat</Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <Link to="ezan-vakti" className="nav-icon-btn ms-2">
                <FaMosque className="nav-icon" />
              </Link>
              <div className="position-relative" ref={sharePanelRef}>
                <Button variant="link" className="nav-icon-btn ms-2" onClick={toggleSharePanel}>
                  <FaShareAlt className="nav-icon" />
                </Button>
                {showSharePanel && (
                  <div className="share-panel">
                    <div className="share-panel-title">Sosyal Medyada bağlantıları</div>
                    <div className="social-icons">
                      <a
                        href="https://www.facebook.com/sharer/sharer.php?u=https://yourwebsite.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon facebook"
                      >
                        <FaFacebookF />
                      </a>
                      <a
                        href="https://twitter.com/intent/tweet?url=https://yourwebsite.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon twitter"
                      >
                        <FaTwitter />
                      </a>
                      <a
                        href="https://www.instagram.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon instagram"
                      >
                        <FaInstagram />
                      </a>
                    </div>
                  </div>
                )}

                <Button variant="link" className="nav-icon-btn ms-2" onClick={handlePageSearch}>
                  <FaSearch className="nav-icon" />
                </Button>

                {showInput && (
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      ref={searchInputRef}
                      value={searchText}
                      onChange={handleInputChange}
                      placeholder="Ara..."
                      className="form-control"
                      onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                    />
                    <Button variant="primary" size="sm" className="search-button" onClick={handleSearchSubmit}>
                      Ara
                    </Button>
                  </div>
                )}

              </div>
            </div>

          </Navbar.Collapse>
        </Container>
      </Navbar>

      <MobileMenu isOpen={showMobileMenu} onClose={toggleMobileMenu} />
    </>
  )
}

export default Navigation

