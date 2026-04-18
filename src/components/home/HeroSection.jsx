import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero__orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="hero__content">
        {/* Updated Badge with Logo */}
        <div className="hero__badge">
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={{ height: '16px', marginRight: '8px' }} 
          />
          <div className="badge-pulse" />
          FabLab Inventory Agent
        </div>

        <h1 className="hero__title">
          Track. Remind.<br />
          <span className="gradient-text">Never Lose Track Again.</span>
        </h1>

        <p className="hero__sub">
          An intelligent inventory system for the <strong>FabLab</strong> that tracks borrowed components,
          sends automated email reminders, and escalates overdue returns.
        </p>

        <div className="hero__actions">
          <button
            className="btn btn--primary btn--lg"
            onClick={() => navigate('/take')} // Changed to /take to match your routes
          >
            📤 Take Components
          </button>
          <button
            className="btn btn--outline btn--lg"
            onClick={() => navigate('/return')}
          >
            📥 Return Items
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;