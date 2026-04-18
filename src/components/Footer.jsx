import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>📦</span>
          <span className="footer__copy">
            © {year} InvenTrack — Intelligent Inventory Management
          </span>
        </div>
        <div className="footer__links">
          <button className="footer__link" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => navigate('/take')}>
            Take Components
          </button>
          <button className="footer__link" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => navigate('/return')}>
            Return Items
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
