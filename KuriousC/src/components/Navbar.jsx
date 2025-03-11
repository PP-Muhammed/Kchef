import React, { useState } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom"; // For navigation

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu
  const navigate = useNavigate(); // React Router navigation

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path) => {
    setIsMenuOpen(false); // Close menu after navigation
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="menu-icon" onClick={toggleMenu}>
        ☰
      </div>
      {isMenuOpen && (
        <div className="side-menu">
          <button className="close-btn" onClick={toggleMenu}>
            ×
          </button>
          <ul>
            <li onClick={() => handleNavigation("/")}>Home</li>
            <li onClick={() => handleNavigation("/saved")}>Saved</li>
            <li onClick={() => handleNavigation("/foodscanner")}>Scan</li>
            <li onClick={() => handleNavigation("/search")}>Search</li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
