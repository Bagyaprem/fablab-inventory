import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Cpu, Mail, Menu, X } from 'lucide-react';
import './Header.css';

const NAV_LINKS = [
  { path: '/',          label: 'Home',               icon: <Home size={20} /> },
  { path: '/components',label: 'Components Library', icon: <Cpu size={20} /> },
  { path: '/contact',     label: 'Contact us',    icon: <Mail size={20} /> },
];

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Brand */}
        <div className="navbar__brand" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="Logo" style={{ height: '32px' }} />
          <span className="navbar__logo-text">FabLab Inventory</span>
        </div>

        {/* Desktop links */}
        <div className="navbar__desktop-links">
          {NAV_LINKS.map((link) => (
            <button
              key={link.path}
              className={`nav-item ${pathname === link.path ? 'active' : ''}`}
              onClick={() => navigate(link.path)}
            >
              <div className="icon-box">{link.icon}</div>
              <span className="nav-label">{link.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button className="navbar__hamburger" onClick={() => setMobileOpen(o => !o)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="navbar__mobile-menu">
          {NAV_LINKS.map((link) => (
            <button
              key={link.path}
              className={`mobile-nav-item ${pathname === link.path ? 'active' : ''}`}
              onClick={() => navigate(link.path)}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Header;