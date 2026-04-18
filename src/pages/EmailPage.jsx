import React from 'react';
import EmailPreview from '../components/email/EmailPreview';

const EmailPage = () => (
  <div>
    <div className="page-header container">
      <div className="page-header__eyebrow">📧 Email System</div>
      <h1 className="page-header__title">
        Email <span className="gradient-text">Templates</span>
      </h1>
      <p className="page-header__sub">
        Preview all automated email notifications sent by InvenTrack —
        new requests, return reminders, and overdue escalations.
      </p>
    </div>
    <div className="container" style={{ paddingBottom: '80px' }}>
      <EmailPreview />
    </div>
  </div>
);

export default EmailPage;
