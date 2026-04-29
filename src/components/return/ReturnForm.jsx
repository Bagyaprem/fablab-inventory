import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RotateCcw, CheckCircle, Package, Calendar, User, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { lookupRequests, returnComponents } from '../../api/inventoryApi';
import './ReturnForm.css';

const ReturnForm = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (query.trim().length < 3) return toast.error("Enter at least 3 characters");
    
    setLoading(true);
    try {
      const res = await lookupRequests(query);
      // Fallback safely just in case the Google Script structure changes slightly
      const data = res.data?.data?.data || res.data?.data || [];
      setResults(data); 
      
      if (data.length === 0) toast("No active requests found.", { icon: '📦' });
    } catch { 
      toast.error("Search failed. Please check your connection."); 
    } finally { 
      setLoading(false); 
    }
  };

  const processReturn = async (id) => {
    if (!window.confirm("Confirm return of all items?")) return;
    const tId = toast.loading("Updating Inventory...");
    try {
      await returnComponents(id);
      setResults(prev => prev.map(r => r.id === id ? { ...r, status: 'Returned' } : r));
      toast.success("Items Successfully Restocked!", { id: tId });
    } catch { 
      toast.error("Update failed", { id: tId }); 
    }
  };

  return (
    <div className="form-container">
      
      <div className="borrow-header-area">
        <div className="header-icon return-icon"><RotateCcw size={28} /></div>
        <h1 className="form-title">Return <span className="text-accent">Components</span></h1>
        <p className="form-subtitle">Locate and clear your borrowed items securely.</p>
      </div>

      <div className="form-card">
        <div className="card-accent return-accent"></div>
        
        {/* Search Section */}
        <div className="search-section">
          <label className="section-label">Retrieve Borrow Logs</label>
          <form onSubmit={handleSearch} className="search-bar-integrated">
            <Search size={18} className="search-icon-dim" />
            <input 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              placeholder="Enter Name, Email, or Request ID..." 
            />
            <button type="submit" className="pill-search-btn" disabled={loading}>
              {loading ? "Searching..." : "Find"}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {results && (
          <div className="results-container">
            {results.length === 0 ? (
              <div className="empty-state">
                <Package size={40} color="#475569" /> 
                <p>No active logs found for "{query}".</p>
              </div>
            ) : (
              <div className="results-list">
                {results.map(r => (
                  <div key={r.id} className={`log-card-glass ${r.status === 'Returned' ? 'is-returned' : ''}`}>
                    <div className="log-header">
                      <div className="log-id-group">
                        <span className="req-id-tag">{r.id}</span>
                        <span className={`status-pill ${r.status.toLowerCase()}`}>{r.status}</span>
                      </div>
                    </div>
                    
                    <div className="log-user-info">
                      <User size={14} />
                      <strong>{r.name}</strong> 
                      <span className="user-email">({r.email})</span>
                    </div>

                    <div className="log-items-wrapper">
                      <span className="items-label">Borrowed Items:</span>
                      <div className="log-items-tags">
                        {r.components.map((c, i) => (
                          <span key={i} className="item-tag">{c}</span>
                        ))}
                      </div>
                    </div>

                    <div className="log-footer">
                      <div className="due-date">
                        <Calendar size={14} /> 
                        Due: {new Date(r.return_date).toLocaleDateString()}
                      </div>
                      
                      {r.status !== 'Returned' ? (
                        <button onClick={() => processReturn(r.id)} className="return-action-btn">
                          <CheckCircle size={16}/> Mark Returned
                        </button>
                      ) : (
                        <span className="returned-badge"><CheckCircle size={16}/> Cleared</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button className="reset-search-btn" onClick={() => {setResults(null); setQuery("");}}>
              <ArrowLeft size={16}/> Back to Search
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ReturnForm;