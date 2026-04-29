import React from 'react';
import { UploadCloud } from 'lucide-react'; // Professional icon replacement
import TakeComponentsForm from '../components/TakeComponentsForm';

const TakePage = () => (
  <div className="modern-page-wrapper">
    <div className="page-header container">
      <div className="page-header__eyebrow">
        <UploadCloud size={14} style={{ marginRight: '8px' }} />
        Borrow Inventory
      </div>
      <h1 className="page-header__title">
        Take <span className="gradient-text">Components</span>
      </h1>
      <p className="page-header__sub">
        Complete the authorization form to secure your components. 
        The support team will be notified instantly upon submission.
      </p>
    </div>
    
    <div className="form-card-container container">
      <div className="glass-panel">
        <TakeComponentsForm />
      </div>
    </div>
  </div>
);

export default TakePage;