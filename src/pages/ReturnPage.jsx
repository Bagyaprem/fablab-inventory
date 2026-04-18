import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ReturnForm from '../components/return/ReturnForm';

const ReturnPage = () => {
  const [searchParams] = useSearchParams();
  const prefillId = searchParams.get('id') || '';

  return (
    <div>
      <div className="page-header container">
        <div className="page-header__eyebrow">📥 Return Inventory</div>
        <h1 className="page-header__title">
          Return <span className="gradient-text">Components</span>
        </h1>
        <p className="page-header__sub">
          Search by your email address or request ID to view your borrowed items
          and mark them as returned.
        </p>
      </div>
      <div className="container" style={{ paddingBottom: '80px' }}>
        <ReturnForm prefillId={prefillId} />
      </div>
    </div>
  );
};

export default ReturnPage;
