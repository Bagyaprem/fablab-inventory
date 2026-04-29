import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img
            src="/logo.png"
            alt="FabLab Logo"
            style={{ height: '28px', width: 'auto' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
          <span className="footer__copy">
            © {year} FabLab Inventory — Intelligent Lab Management
          </span>
        </div>
        <nav className="footer__links">
          <button className="footer__link" onClick={() => navigate('/')}>Home</button>
          <button className="footer__link" onClick={() => navigate('/components')}>Components</button>
          <button className="footer__link" onClick={() => navigate('/borrow')}>Take Components</button>
          <button className="footer__link" onClick={() => navigate('/return')}>Return Items</button>

        </nav>
      </div>
    </footer>
  );
};

export default Footer;