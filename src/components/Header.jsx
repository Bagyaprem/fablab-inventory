import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { path: '/', label: 'Home',},
  { path: '/take', label: 'Take Components',},
  { path: '/return', label: 'Return Components',  },
];

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        {/* Brand */}
        <div className="navbar__brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <span className="navbar__logo-icon"></span>
          <span className="navbar__logo-text">fab lab inventory</span>
        </div>

        {/* Desktop Nav */}
        {NAV_LINKS.map((link) => (
          <button
            key={link.path}
            className={`navbar__link ${pathname === link.path ? 'navbar__link--active' : ''}`}
            onClick={() => { navigate(link.path); setMenuOpen(false); }}
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
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: 'var(--nav-h)', left: 0, right: 0,
          background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', padding: '12px',
          gap: '4px', zIndex: 99,
        }}>
          {NAV_LINKS.map((link) => (
            <button
              key={link.path}
              className={`navbar__link ${pathname === link.path ? 'navbar__link--active' : ''}`}
              style={{ textAlign: 'left' }}
              onClick={() => { navigate(link.path); setMenuOpen(false); }}
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
