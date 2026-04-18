import React from 'react';

const STATUS_MAP = {
  Taken:    { dot: '#f59e0b', label: 'Taken',    icon: '📤' },
  Returned: { dot: '#10b981', label: 'Returned', icon: '✅' },
  Overdue:  { dot: '#ef4444', label: 'Overdue',  icon: '⚠️' },
};

/**
 * StatusBadge — displays coloured pill for inventory status
 */
const StatusBadge = ({ status }) => {
  const cfg = STATUS_MAP[status] || { dot: '#94a3b8', label: status, icon: '❓' };
  return (
    <span className={`badge badge--${status}`} title={`Status: ${cfg.label}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

/**
 * AlertBox — displays an info/success/warning/error message banner
 */
export const AlertBox = ({ type = 'info', icon, title, message, onDismiss }) => (
  <div className={`alert alert--${type}`} style={{ position: 'relative' }}>
    {icon && <span style={{ fontSize: '18px', flexShrink: 0 }}>{icon}</span>}
    <div style={{ flex: 1 }}>
      {title && <div style={{ fontWeight: 700, marginBottom: '3px' }}>{title}</div>}
      {message && <div style={{ fontSize: '13px', opacity: .9 }}>{message}</div>}
    </div>
    {onDismiss && (
      <button
        onClick={onDismiss}
        style={{
          background: 'none', border: 'none', color: 'inherit',
          cursor: 'pointer', opacity: .7, fontSize: '16px',
          flexShrink: 0, padding: '0 4px',
        }}
      >
        ✕
      </button>
    )}
  </div>
);

/**
 * Spinner — loading indicator
 */
export const Spinner = ({ size = 16, color = '#fff' }) => (
  <div
    className="spinner"
    style={{ width: size, height: size, borderTopColor: color }}
  />
);

export default StatusBadge;
