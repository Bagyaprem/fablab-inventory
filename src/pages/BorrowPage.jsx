import React from 'react';
import { UploadCloud } from 'lucide-react';
import BorrowForm from '../components/borrow/BorrowForm';

const BorrowPage = () => (
  <div className="modern-page-wrapper">
    <div className="page-header container">
      <div className="page-header__eyebrow">
        <UploadCloud size={14} style={{ marginRight: '8px' }} />
        Borrow Items
      </div>
      <h1 className="page-header__title">
        Take <span className="gradient-text">Components</span>
      </h1>
      <p className="page-header__sub">
        Request the components you need for your project. Fill out the form below.
      </p>
    </div>

    <div className="form-card-container container">
      <div className="glass-panel">
        <BorrowForm />
      </div>
    </div>
  </div>
);

export default BorrowPage;