"use client"

import { useState, useEffect } from "react"
import { Nav } from "react-bootstrap"
import { Link } from "react-router-dom"
import { isAuthenticated } from "../utils/auth"
import { FaHome, FaPlus, FaNewspaper, FaList, FaCog, FaSignOutAlt } from "react-icons/fa"
import "../style/sidebar.css"

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const authAdmin = isAuthenticated()
    setIsAdmin(authAdmin)
  }, [])

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isExpanded ? "<" : ">"}
      </button>

      {isAdmin ? (
        <Nav className="flex-column">
          <Nav.Link as={Link} to="/admin/dashboard">
            <FaHome className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/haberler">
            <FaNewspaper className="nav-icon" />
            <span className="nav-text">Haberler</span>
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/kategoriler">
            <FaList className="nav-icon" />
            <span className="nav-text">Kategoriler</span>
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/haber-ekle">
            <FaPlus className="nav-icon" />
            <span className="nav-text">Haber Ekle</span>
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/ayarlar">
            <FaCog className="nav-icon" />
            <span className="nav-text">Ayarlar</span>
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/cikis">
            <FaSignOutAlt className="nav-icon" />
            <span className="nav-text">Çıkış</span>
          </Nav.Link>
        </Nav>
      ) : (
        <Nav className="flex-column">
          <span className="nav-text">Yetersiz yetki</span>
        </Nav>
      )}
    </div>
  )
}

export default Sidebar