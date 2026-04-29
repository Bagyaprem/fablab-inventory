import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LogIn, Package } from 'lucide-react';
import './HomePage.css';

// Fallback quotes
const QUOTES = [
  "Innovation distinguishes between a leader and a follower.",
  "The best way to predict the future is to create it.",
  "Engineering is the art of directing the great sources of power in nature for the use and convenience of man.",
  "Science is about knowing; engineering is about doing.",
  "The engineer has been, and is, a maker of history.",
];

const getRandomQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)];

const HomePage = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="hero-eyebrow">
          <Package size={16} />
          <span>AIC RAISE FabLab</span>
        </div>

        <h1 className="hero-title">Welcome to FabLab Inventory</h1>

        <div className="quote-box">
          <p className="inspirational-quote">"{quote}"</p>
        </div>

        <p className="hero-subtitle">
          Empowering your engineering journey with precision components.
        </p>

        <div className="dashboard-actions">
          <button className="action-btn take-btn" onClick={() => navigate('/borrow')}>
            <LogOut size={20} />
            Take Components
          </button>
          <button className="action-btn return-btn" onClick={() => navigate('/return')}>
            <LogIn size={20} />
            Return Components
          </button>
        </div>


      </header>
    </div>
  );
};

export default HomePage;