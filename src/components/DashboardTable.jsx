import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getRequests, returnComponents, getRequestById } from '../api/inventoryApi';
import StatusBadge from './StatusBadge';
import { Spinner } from './StatusBadge';

// --- FIXED: Handles "Invalid Date" errors ---
const formatDate = (d) => {
  if (!d) return '—';
  const dateObj = new Date(d);
  
  // If conversion fails, show raw data instead of "Invalid Date"
  if (isNaN(dateObj.getTime())) return d; 

  return dateObj.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

const isOverdue = (r) =>
  r.status !== 'Returned' && new Date(r.return_date + 'T00:00:00') < new Date();

// ── Detail Modal ─────────────────────────────────────────────────────────────
const DetailModal = ({ record, onClose, onReturn }) => {
  if (!record) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">
          📋 Request Details&ensp;
          <StatusBadge status={record.status} />
        </div>
        <div className="modal-detail-grid">
          {[
            ['Request ID', <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>{record.id}</span>],
            ['Name', record.name],
            ['Email', record.email],
            ['Company', record.company],
            ['Taken Date', formatDate(record.taken_date)],
            ['Return Date', formatDate(record.return_date)],
            ['Reminder', record.reminder_sent ? '✅ Sent' : '⏳ Pending'],
            ['Escalation', record.escalation_sent ? '🚨 Sent' : '—'],
          ].map(([k, v]) => (
            <div key={k} className="modal-detail-row">
              <span className="modal-detail-key">{k}</span>
              <span className="modal-detail-val">{v}</span>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', marginBottom: '10px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Components
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(record.components || []).map((c, i) => (
              <span key={i} className="result-comp-tag">🔧 {c}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {record.status !== 'Returned' && (
            <button className="btn btn--success" onClick={() => { onReturn(record.id); onClose(); }}>
              ✅ Mark as Returned
            </button>
          )}
          <button className="btn btn--outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// ── Filter buttons ────────────────────────────────────────────────────────────
const FILTERS = [
  { key: '', label: 'All', cls: '' },
  { key: 'Taken', label: 'Taken', cls: 'stat-card--taken' },
  { key: 'Returned', label: 'Returned', cls: 'stat-card--returned' },
  { key: 'Overdue', label: 'Overdue', cls: 'stat-card--overdue' },
];

// ── Main Dashboard Table Component ────────────────────────────────────────────
const DashboardTable = () => {
  const [data, setData] = useState([]);
  const [counts, setCounts] = useState({ Total: 0, Taken: 0, Returned: 0, Overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [returning, setReturning] = useState({});
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getRequests();
      setData(res.data.data || []);
      setCounts(res.data.counts || {});
    } catch (err) {
      toast.error('Failed to load records. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleReturn = async (id) => {
    if (!window.confirm('Mark all items as returned?')) return;
    setReturning((p) => ({ ...p, [id]: true }));
    try {
      await returnComponents(id);
      toast.success('Marked as returned!');
      fetchData(); // Refresh data to update the table
    } catch (err) {
      toast.error(err.message || 'Failed to return.');
    } finally {
      setReturning((p) => ({ ...p, [id]: false }));
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await getRequestById(id);
      setSelectedRecord(res.data.data);
    } catch {
      toast.error('Failed to load record details.');
    }
  };

  // ── FIXED: Client-side filter + search (Dynamic Name Search) ──
  const filtered = data.filter((r) => {
    const matchStatus = !filter || r.status === filter;
    
    // Convert both user search and data to lowercase for dynamic matching
    const s = search.toLowerCase().trim();
    
    const matchSearch = !s || 
      (r.name && r.name.toLowerCase().includes(s)) || // Priority: Search by Name
      (r.email && r.email.toLowerCase().includes(s)) || 
      (r.id && r.id.toLowerCase().includes(s));
      
    return matchStatus && matchSearch;
  });

  return (
    <div>
      {/* Stats row */}
      <div className="stats-row">
        {FILTERS.map(({ key, label, cls }) => (
          <div
            key={key}
            className={`stat-card ${cls} ${filter === key ? 'stat-card--active' : ''}`}
            onClick={() => setFilter(key)}
          >
            <div className="stat-card__num">
              {key === '' ? counts.Total : (counts[key] ?? 0)}
            </div>
            <div className="stat-card__label">{key === '' ? 'All Requests' : label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="admin-controls">
        <div className="admin-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="admin-search__input"
            type="text"
            placeholder="Search by name, email or ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="btn btn--ghost btn--sm" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
        <button className="btn btn--outline btn--sm" onClick={fetchData} disabled={loading}>
          {loading ? <Spinner size={14} color="#818cf8" /> : '↻ Refresh'}
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-3)' }}>
          <Spinner size={28} color="#818cf8" />
          <p style={{ marginTop: '16px', color: 'var(--text-2)' }}>Loading records…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="table-empty">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>No records found</div>
          <div>Try searching for a different name or checking your filters.</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="inv-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Requester</th>
                <th>Company</th>
                <th>Components</th>
                <th>Taken Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const overdue = isOverdue(r);
                const comps = r.components || [];
                return (
                  <tr key={r.id}>
                    <td><span className="td-id">{r.id?.split('-')[0]}</span></td>
                    <td>
                      <div className="td-name">{r.name}</div>
                      <div className="td-meta">{r.email}</div>
                    </td>
                    <td style={{ color: 'var(--text-2)', fontSize: '13px' }}>{r.company}</td>
                    <td>
                      <div className="comp-chips">
                        {comps.slice(0, 3).map((c, i) => (
                          <span key={i} className="comp-chip">{c}</span>
                        ))}
                        {comps.length > 3 && (
                          <span style={{ fontSize: '10px', color: 'var(--text-3)', padding: '2px 4px' }}>
                            +{comps.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="td-date">{formatDate(r.taken_date)}</td>
                    <td className={`td-date ${overdue ? 'td-date--overdue' : ''}`}>
                      {formatDate(r.return_date)}
                    </td>
                    <td><StatusBadge status={r.status} /></td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn--ghost btn--sm" onClick={() => handleViewDetail(r.id)}>👁</button>
                        {r.status !== 'Returned' && (
                          <button className="btn btn--success btn--sm" onClick={() => handleReturn(r.id)} disabled={returning[r.id]}>
                            {returning[r.id] ? <Spinner size={12} color="#10b981" /> : '✅'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedRecord && (
        <DetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onReturn={(id) => { handleReturn(id); setSelectedRecord(null); }}
        />
      )}
    </div>
  );
};

export default DashboardTable;