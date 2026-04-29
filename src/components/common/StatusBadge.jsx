import React from 'react';
import './Common.css';

/* ── StatusBadge ─────────────────────────────────────────────────── */
const STATUS_CONFIG = {
  Taken:    { icon: '📤', label: 'Taken' },
  Returned: { icon: '✅', label: 'Returned' },
  Overdue:  { icon: '⚠️', label: 'Overdue' },
  Waitlist: { icon: '🕐', label: 'Waitlist' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { icon: '❓', label: status || 'Unknown' };
  return (
    <span className={`badge badge--${status}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

/* ── Spinner ─────────────────────────────────────────────────────── */
export const Spinner = ({ size = 16, color = '#fff' }) => (
  <div
    className="spinner"
    style={{
      width: size,
      height: size,
      borderWidth: Math.max(2, Math.round(size / 8)),
      borderTopColor: color,
    }}
  />
);

/* ── AlertBox ────────────────────────────────────────────────────── */
export const AlertBox = ({ type = 'info', icon, title, message, onDismiss }) => (
  <div className={`alert alert--${type}`}>
    {icon && <span className="alert__icon">{icon}</span>}
    <div className="alert__body">
      {title   && <div className="alert__title">{title}</div>}
      {message && <div className="alert__msg">{message}</div>}
    </div>
    {onDismiss && (
      <button className="alert__dismiss" onClick={onDismiss}>✕</button>
    )}
  </div>
);

export default StatusBadge;