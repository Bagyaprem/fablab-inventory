import React, { useState } from 'react';
import './EmailPreview.css';

/* ── Sample data to populate the previews ─────────────────────────── */
const SAMPLE = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  name: 'Priya Sharma',
  email: 'priya.sharma@company.com',
  company: 'TechNova Solutions',
  components: ['Laptop (Dell XPS 15)', 'Oscilloscope', 'Arduino Mega', 'USB Hub'],
  taken_date: '2026-04-18',
  return_date: '2026-04-25',
  days_overdue: 2,
};

const fmtDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

/* ── Shared email shell ────────────────────────────────────────────── */
const EmailShell = ({ headerColor, headerTitle, headerSub, children }) => (
  <div className="email-envelope">
    {/* Header strip - Updated with Logo Image */}
    <div className="email-header" style={{ background: `linear-gradient(135deg, ${headerColor}, ${headerColor}cc)` }}>
      <div className="email-header__icon">
        <img 
          src="/logo.png" 
          alt="FabLab Logo" 
          style={{ height: '50px', width: 'auto', marginBottom: '10px' }} 
        />
      </div>
      <h1 className="email-header__title">{headerTitle}</h1>
      <p className="email-header__sub">{headerSub}</p>
    </div>

    {/* Body */}
    <div className="email-body">{children}</div>

    {/* Footer - Updated name */}
    <div className="email-footer-strip">
      <p>Automated notification — do not reply.</p>
      <p style={{ marginTop: '4px' }}>FabLab Inventory · Management System</p>
    </div>
  </div>
);

/* ── Detail table helper ─────────────────────────────────────────── */
const DetailTable = ({ rows }) => (
  <table className="email-table">
    <tbody>
      {rows.map(([key, val], i) => (
        <tr key={i}>
          <td className="email-table__key">{key}</td>
          <td className="email-table__val">{val}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

/* ── Component list helper ───────────────────────────────────────── */
const CompList = ({ items, danger = false }) => (
  <ul className={`email-comp-list ${danger ? 'email-comp-list--danger' : ''}`}>
    {items.map((c, i) => <li key={i}>{c}</li>)}
  </ul>
);

/* ════════════════════════════════════════════════════════════════════
   1. NEW REQUEST EMAIL  (→ Support Team)
   ════════════════════════════════════════════════════════════════════ */
const NewRequestEmail = () => (
  <EmailShell
    headerColor="#3b82f6"
    headerTitle="New Inventory Request"
    headerSub="FabLab Inventory · Management System"
  >
    <div className="email-banner email-banner--blue">
      <p className="email-banner__label email-banner__label--blue">📋 New request received</p>
      <p className="email-banner__sub email-banner__sub--blue">
        ID: <strong>{SAMPLE.id.slice(0, 18)}…</strong>
      </p>
    </div>

    <h3 className="email-section-title">👤 Requester Details</h3>
    <DetailTable rows={[
      ['Name',       SAMPLE.name],
      ['Email',      SAMPLE.email],
      ['Company',    SAMPLE.company],
      ['Taken Date', fmtDate(SAMPLE.taken_date)],
      ['Return Due', fmtDate(SAMPLE.return_date)],
    ]} />

    <h3 className="email-section-title">🔧 Components Borrowed</h3>
    <CompList items={SAMPLE.components} />

    <div className="email-note email-note--yellow">
      ⚠️ Items due back by <strong>{fmtDate(SAMPLE.return_date)}</strong>.
      Please ensure inventory records are updated.
    </div>
  </EmailShell>
);

/* ════════════════════════════════════════════════════════════════════
   2. REMINDER EMAIL  (→ User on return date)
   ════════════════════════════════════════════════════════════════════ */
const ReminderEmail = () => (
  <EmailShell
    headerColor="#f59e0b"
    headerTitle="Return Reminder — Action Required"
    headerSub="FabLab Inventory · Management System"
  >
    <p style={{ color: '#334155', fontSize: '15px', marginBottom: '16px' }}>
      Hi <strong>{SAMPLE.name}</strong>,
    </p>
    <p style={{ color: '#334155', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
      Your borrowed inventory items are <strong>due for return today</strong>.
      Please return them to avoid escalation to the support team.
    </p>

    <div className="email-banner email-banner--warn">
      <p className="email-banner__label email-banner__label--warn">
        📅 Due Today: {fmtDate(SAMPLE.return_date)}
      </p>
      <p className="email-banner__sub email-banner__sub--warn">
        Request ID: {SAMPLE.id.slice(0, 18)}…
      </p>
    </div>

    <h3 className="email-section-title"> Items to Return</h3>
    <CompList items={SAMPLE.components} />

    <div className="email-cta-wrap">
      <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '12px' }}>
        Click the button below to mark items as returned:
      </p>
      <span className="email-cta">✅ Mark as Returned</span>
    </div>

    <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '12px' }}>
      If you've already returned the items, please ignore this message.
    </p>
  </EmailShell>
);

/* ════════════════════════════════════════════════════════════════════
   3. ESCALATION EMAIL  (→ Support Team when overdue)
   ════════════════════════════════════════════════════════════════════ */
const EscalationEmail = () => (
  <EmailShell
    headerColor="#ef4444"
    headerTitle="🚨 Escalation — Overdue Return"
    headerSub="FabLab Inventory · Management System"
  >
    <div className="email-banner email-banner--danger">
      <p className="email-banner__label email-banner__label--danger">
        🚨 ESCALATION: Items overdue by {SAMPLE.days_overdue} day(s)
      </p>
      <p className="email-banner__sub email-banner__sub--danger">
        Immediate follow-up required.
      </p>
    </div>

    <h3 className="email-section-title"> Borrower Details</h3>
    <DetailTable rows={[
      ['Name',         SAMPLE.name],
      ['Email',        SAMPLE.email],
      ['Company',      SAMPLE.company],
      ['Request ID',   SAMPLE.id.slice(0, 18) + '…'],
      ['Was Due',      fmtDate(SAMPLE.return_date)],
      ['Days Overdue', `${SAMPLE.days_overdue} day(s)`],
    ]} />

    <h3 className="email-section-title">🔧 Overdue Items</h3>
    <CompList items={SAMPLE.components} danger />

    <div className="email-note email-note--orange">
      ⚡ <strong>Recommended Action:</strong> Please contact{' '}
      <strong>{SAMPLE.name}</strong> at{' '}
      <strong>{SAMPLE.email}</strong> immediately to arrange return.
    </div>
  </EmailShell>
);

/* ════════════════════════════════════════════════════════════════════
   Main EmailPreview component
   ════════════════════════════════════════════════════════════════════ */
const TABS = [
  {
    key: 'new',
    label: 'New Request',
    icon: '📋',
    activeClass: 'email-tab--active--blue',
    badgeClass: 'email-type-badge--new',
    sentTo: 'Product Support Team',
    desc: 'Sent immediately when a user submits a borrow request.',
    Component: NewRequestEmail,
  },
  {
    key: 'reminder',
    label: 'Reminder',
    icon: '⏰',
    activeClass: 'email-tab--active--warn',
    badgeClass: 'email-type-badge--reminder',
    sentTo: 'Borrower (User)',
    desc: 'Sent automatically on the return date if items are not yet returned.',
    Component: ReminderEmail,
  },
  {
    key: 'escalation',
    label: 'Escalation',
    icon: '🚨',
    activeClass: 'email-tab--active--danger',
    badgeClass: 'email-type-badge--escalation',
    sentTo: 'Product Support Team',
    desc: 'Sent when items are overdue (past return date) and still not returned.',
    Component: EscalationEmail,
  },
];

const EmailPreview = () => {
  const [active, setActive] = useState('new');
  const tab = TABS.find((t) => t.key === active);
  const { Component } = tab;

  return (
    <div className="email-page">
      {/* Tab switcher */}
      <div className="email-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`email-tab ${active === t.key ? t.activeClass : ''}`}
            onClick={() => setActive(t.key)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Meta info */}
      <div style={{ marginBottom: '20px' }}>
        <div className={`email-type-badge ${tab.badgeClass}`}>
          {tab.icon} {tab.label} Email
        </div>
        <div className="email-intro-text">{tab.desc}</div>
        <div className="email-sent-to">
          <span>📬 Sent to:</span>
          <strong>{tab.sentTo}</strong>
        </div>
      </div>

      {/* Rendered email */}
      <div className="email-frame-wrap">
        <Component />
      </div>
    </div>
  );
};

export default EmailPreview;