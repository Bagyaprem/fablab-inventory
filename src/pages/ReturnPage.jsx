import React from 'react';
import { DownloadCloud, Search } from 'lucide-react'; // Sleek icon replacements
import ReturnForm from "../components/return/ReturnForm";

const ReturnPage = () => (
  <div className="modern-page-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
    {/* Background ambient glow setup */}
    <div className="ambient-glow" style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', zIndex: 0 }}></div>
    <div className="ambient-glow-2" style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(0,0,0,0) 80%)', filter: 'blur(80px)', zIndex: 0 }}></div>
    
    <div className="page-header container" style={{ position: 'relative', zIndex: 1 }}>
      <div className="page-header__eyebrow">
        <DownloadCloud size={14} style={{ marginRight: '8px' }} />
        Return & Tracking Setup
      </div>
      <h1 className="page-header__title">
        Return <span className="gradient-text">Components</span>
      </h1>
      <p className="page-header__sub" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
        Effortlessly track your active borrow requests. Provide your <strong>Email</strong> or <strong>Request ID</strong> to locate and clear your borrowed items securely and smoothly.
      </p>
    </div>

    <div className="form-card-container container" style={{ position: 'relative', zIndex: 1, marginTop: '20px' }}>
      <div className="glass-panel" style={{ background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', padding: '30px' }}>
        <ReturnForm />
      </div>
    </div>
  </div>
);

export default ReturnPage;