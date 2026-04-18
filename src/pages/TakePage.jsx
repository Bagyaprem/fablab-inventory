import React from 'react';
import TakeComponentsForm from '../components/TakeComponentsForm';

const TakePage = () => (
  <div>
    <div className="page-header container">
      <div className="page-header__eyebrow">📤 Borrow Inventory</div>
      <h1 className="page-header__title">
        Take <span className="gradient-text">Components</span>
      </h1>
      <p className="page-header__sub">
        Fill out the form below to borrow components. The product support team
        will be automatically notified once you submit.
      </p>
    </div>
    <div className="container" style={{ paddingBottom: '80px' }}>
      <TakeComponentsForm />
    </div>
  </div>
);

export default TakePage;
