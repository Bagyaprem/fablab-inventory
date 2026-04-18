import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { lookupRequests, returnComponents } from '../../api/inventoryApi';
import StatusBadge, { Spinner } from '../common/StatusBadge';
import './ReturnForm.css';

// --- FIXED: Handles "Invalid Date" errors safely ---
const fmtDate = (d) => {
  if (!d) return '—';
  const dateObj = new Date(d);
  
  // If conversion fails, show the raw text from the sheet
  if (isNaN(dateObj.getTime())) return d; 

  return dateObj.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

const isOverdue = (r) =>
  r.status !== 'Returned' && new Date(r.return_date + 'T00:00:00') < new Date();

const ReturnForm = ({ prefillId = '' }) => {
  const [query,     setQuery]     = useState(prefillId);
  const [searchErr, setSearchErr] = useState('');
  const [searching, setSearching] = useState(false);
  const [results,   setResults]   = useState(null); 
  const [returning, setReturning] = useState({});

  useEffect(() => {
    if (prefillId && prefillId.length >= 3) handleSearch(prefillId);
  }, [prefillId]);

  const handleSearch = async (override) => {
    const q = (override ?? query).trim();
    setSearchErr('');
    if (q.length < 2) { setSearchErr('Enter at least 2 characters.'); return; }

    setSearching(true);
    setResults(null);
    try {
      // Calls the dynamic API we updated (Name, Email, or ID)
      const res = await lookupRequests(q);
      setResults(res.data.data);
    } catch (err) {
      setSearchErr(err.message || 'Search failed. Try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleReturn = async (id) => {
    if (!window.confirm('Mark all items in this request as returned?')) return;
    setReturning((p) => ({ ...p, [id]: true }));
    try {
      await returnComponents(id);
      toast.success('Items marked as returned!');
      setResults((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'Returned' } : r))
      );
    } catch (err) {
      toast.error(err.message || 'Failed to update. Try again.');
    } finally {
      setReturning((p) => ({ ...p, [id]: false }));
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults(null);
    setSearchErr('');
  };

  return (
    <div>
      <div className="return-search-card">
        {/* Updated Title to include "Name" */}
        <div className="return-search-card__title">Search by Name, Email or ID</div>
        <div className="return-search-card__desc">
          Enter the borrower's name, email, or the unique request ID.
        </div>

        <div className="search-bar">
          <svg className="search-bar__icon" width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>

          <input
            className="search-bar__input"
            id="return-search-input"
            type="text"
            placeholder="Search name, email or ID…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSearchErr(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            autoComplete="off"
          />

          <button
            className="btn btn--primary btn--sm"
            style={{ borderRadius: '8px', padding: '8px 20px' }}
            onClick={() => handleSearch()}
            disabled={searching}
          >
            {searching ? <Spinner size={14} /> : '🔍 Search'}
          </button>
        </div>
        <span className="search-error">{searchErr}</span>
      </div>

      {results !== null && (
        <div className="results-wrap">
          <div className="results-header">
            <span>
              {results.length === 0
                ? 'No active requests found.'
                : `Found ${results.length} record(s)`}
            </span>
            <button className="btn btn--ghost btn--sm" onClick={clearSearch}>
              ← New Search
            </button>
          </div>

          {results.length === 0 ? (
            <div className="return-empty">
              <div className="return-empty__icon">🔍</div>
              <div className="return-empty__title">No matches found</div>
              <button className="btn btn--outline" onClick={clearSearch}>Try Again</button>
            </div>
          ) : (
            results.map((r) => (
              <div key={r.id} className="result-card">
                <div className="result-card__header">
                  <div>
                    <div className="result-card__id">ID: {r.id}</div>
                    <div className="result-card__name">{r.name}</div>
                    <div className="result-card__meta">{r.email} · {r.company}</div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>

                <div className="result-card__comps">
                  {(r.components || []).map((c, i) => (
                    <span key={i} className="result-comp-tag">🔧 {c}</span>
                  ))}
                </div>

                <div className="result-card__dates">
                  <span>📅 Taken: <strong>{fmtDate(r.taken_date)}</strong></span>
                  <span className={isOverdue(r) ? 'result-card__dates--overdue' : ''}>
                    ⏰ Return: <strong>{fmtDate(r.return_date)}</strong>
                    {isOverdue(r) && ' ⚠️ Overdue'}
                  </span>
                </div>

                <div className="result-card__actions">
                  {r.status !== 'Returned' && (
                    <button
                      className="btn btn--success"
                      onClick={() => handleReturn(r.id)}
                      disabled={returning[r.id]}
                    >
                      {returning[r.id]
                        ? <><Spinner size={14} color="#10b981" />&nbsp;Updating…</>
                        : '✅ Mark as Returned'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ReturnForm;