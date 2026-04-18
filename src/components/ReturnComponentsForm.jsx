import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { lookupRequests, returnComponents } from '../api/inventoryApi';
import StatusBadge from './StatusBadge';
import { Spinner } from './StatusBadge';

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

const isOverdue = (r) =>
  r.status !== 'Returned' && new Date(r.return_date) < new Date();

const ReturnComponentsForm = ({ prefillId = '' }) => {
  const [query, setQuery] = useState(prefillId);
  const [searchErr, setSearchErr] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [returning, setReturning] = useState({});

  // Auto-search if prefillId is provided
  useEffect(() => {
    if (prefillId && prefillId.length >= 3) {
      handleSearch(prefillId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillId]);

  const handleSearch = async (overrideQuery) => {
    const q = (overrideQuery ?? query).trim();
    setSearchErr('');

    if (q.length < 3) {
      setSearchErr('Enter at least 3 characters (email or request ID).');
      return;
    }

    setSearching(true);
    setResults(null);
    try {
      const res = await lookupRequests(q);
      setResults(res.data.data);
    } catch (err) {
      setSearchErr(err.message || 'Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleReturn = async (id) => {
    if (!window.confirm('Mark all items in this request as returned?')) return;
    setReturning((p) => ({ ...p, [id]: true }));
    try {
      await returnComponents(id);
      toast.success('Items marked as returned! Reminders stopped.');
      // Update local state
      setResults((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'Returned' } : r))
      );
    } catch (err) {
      toast.error(err.message || 'Failed to update status. Try again.');
    } finally {
      setReturning((p) => ({ ...p, [id]: false }));
    }
  };

  return (
    <div>
      {/* Search card */}
      <div className="search-card">
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
            Search by Email or Request ID
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '16px' }}>
            Enter your email address or the request ID you received when borrowing items.
          </div>
        </div>

        <div className="search-bar" style={{ marginBottom: '6px' }}>
          <svg className="search-bar__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="search-bar__input"
            type="text"
            id="return-search"
            placeholder="email@company.com or request-id…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSearchErr(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            autoComplete="off"
          />
          <button
            className="btn btn--primary btn--sm"
            style={{ borderRadius: '8px', padding: '8px 18px' }}
            onClick={() => handleSearch()}
            disabled={searching}
          >
            {searching ? <Spinner size={14} /> : '🔍 Search'}
          </button>
        </div>

        {searchErr && (
          <span style={{ fontSize: '12px', color: 'var(--danger)', display: 'block', marginTop: '4px' }}>
            {searchErr}
          </span>
        )}
      </div>

      {/* Results */}
      {results !== null && (
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '16px', fontSize: '14px', color: 'var(--text-2)',
          }}>
            <span>
              {results.length === 0
                ? 'No active requests found.'
                : `Found ${results.length} active request(s)`}
            </span>
            <button className="btn btn--ghost btn--sm" onClick={() => {
              setResults(null); setQuery(''); setSearchErr('');
            }}>
              ← New Search
            </button>
          </div>

          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>
                No active requests found
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-2)' }}>
                No unreturned items match your search. Try a different email or ID.
              </div>
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

                {/* Components */}
                <div className="result-card__comps">
                  {(r.components || []).map((c, i) => (
                    <span key={i} className="result-comp-tag">🔧 {c}</span>
                  ))}
                </div>

                {/* Dates */}
                <div className="result-card__dates">
                  <span>📅 Taken: <strong>{formatDate(r.taken_date)}</strong></span>
                  <span style={isOverdue(r) ? { color: 'var(--danger)', fontWeight: 600 } : {}}>
                    ⏰ Return: <strong>{formatDate(r.return_date)}</strong>
                    {isOverdue(r) && ' ⚠️ Overdue'}
                  </span>
                </div>

                {/* Actions */}
                <div className="result-card__actions">
                  {r.status !== 'Returned' && (
                    <button
                      className="btn btn--success"
                      onClick={() => handleReturn(r.id)}
                      disabled={returning[r.id]}
                    >
                      {returning[r.id] ? <><Spinner size={14} />&nbsp;Marking…</> : '✅ Mark as Returned'}
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

export default ReturnComponentsForm;
