import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const NAV_LINKS = [
  { path: '/',       label: 'Home',         },
  { path: '/borrow', label: 'Take Components',  },
  { path: '/return', label: 'Return Components',  },
];

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        {/* Brand */}
       
        <div className="navbar__brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img 
              src="/logo.png" 
              alt="FabLab Logo" 
              style={{ height: '32px', width: 'auto', marginRight: '10px' }} 
            />
           <span className="navbar__logo-text">FabLab Inventory</span> {/* Changed name */}
        </div>
        {/* Desktop links */}
        {NAV_LINKS.map((link) => (
          <button
            key={link.path}
            className={`navbar__link ${pathname === link.path ? 'navbar__link--active' : ''}`}
            onClick={() => handleNav(link.path)}
          >
            {link.label}
          </button>
        ))}

        {/* Hamburger */}
        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle navigation"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          {NAV_LINKS.map((link) => (
            <button
              key={link.path}
              className={`navbar__link ${pathname === link.path ? 'navbar__link--active' : ''}`}
              onClick={() => handleNav(link.path)}
            >
              {link.icon} {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Header;
