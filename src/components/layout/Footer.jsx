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
            style={{ height: '32px', width: 'auto', marginRight: '10px' }} 
          />
          <span className="footer__copy">
             © {year} FabLab Inventory — Intelligent Lab Management
            </span>
        </div>
        <nav className="footer__links">
          <button className="footer__link" onClick={() => navigate('/borrow')}>Take Components</button>
          <button className="footer__link" onClick={() => navigate('/return')}>Return Items</button>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
