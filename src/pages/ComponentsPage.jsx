import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInventory } from '../api/inventoryApi';
import './ComponentsPage.css';

import { Cpu, Activity, Monitor, Settings, Wrench } from 'lucide-react';

const CATEGORY_ICONS = {
  'Microcontrollers': Cpu,
  'Sensors':          Activity,
  'Display':          Monitor,
  'Actuators':        Settings,
  'Default':          Wrench,
};

const ComponentsPage = () => {
  const [inventory, setInventory] = useState([]);
  const [activeTab, setActiveTab] = useState('All Components');
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const navigate = useNavigate();

  // ── Sync Logic: Fetches data directly from Google Sheets ─────────────
 const syncInventory = async () => {
    console.log("🚀 Sync started...");
    setLoading(true);
    setError(null);

    try {
      const res = await getInventory();
      
      const rawData = res.data?.data || res.data || [];

      // 2. PRECISE MAPPER: Maps exactly to your Sheet's headers
      const cleanData = rawData.map(item => {
        // Create a normalized version with lowercase keys
        const normalized = {};
        Object.keys(item).forEach(k => {
          normalized[k.toLowerCase().trim()] = item[k];
        });

        return {
          // Looking for exactly "component name"
          name: normalized['component name'] || "Unnamed Item",
          // Looking for exactly "quantity"
          qty: normalized['quantity'] || 0,
          // Looking for exactly "category"
          category: normalized['category'] || "General",
          // You don't have a description column, so let's use your Status column!
          description: `Current Status: ${normalized['status'] || 'Available'}` 
        };
      }).filter(i => i.name !== "Unnamed Item"); // Hides blank rows

      console.log("✅ Final Processed Data:", cleanData);
      setInventory(cleanData);
    } catch (err) {
      console.error("❌ Sync Error:", err);
      setError('Sync failed. Please check your browser console for details.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    syncInventory();
  }, []);

  const tabs = ['All Components', 'Microcontrollers', 'Sensors', 'Display', 'Actuators'];
  
  // Filtering logic: Added .toLowerCase() to make it more flexible
  const filtered = inventory.filter(i => {
    if (activeTab === 'All Components') return true;
    return i.category?.toString().trim().toLowerCase() === activeTab.toLowerCase();
  });

  if (loading) return (
    <div className="lib-loader">
      <div className="lib-spinner" />
      <p style={{ marginTop: '16px', color: '#6366f1', fontSize: '14px', fontWeight: '600' }}>
        Synchronizing with FabLab Inventory…
      </p>
    </div>
  );

  if (error) return (
    <div className="lib-loader">
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
      <p style={{ color: '#f87171', fontWeight: '600' }}>{error}</p>
      <button 
        onClick={syncInventory} 
        style={{ marginTop: '20px', padding: '10px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }}
      >
        Retry Connection
      </button>
    </div>
  );

  return (
    <div className="lib-page">
      <div className="lib-page-header">
        <h1 className="lib-page-title">Components <span className="lib-accent">Library</span></h1>
        <p className="lib-page-sub">Live inventory from the Rathinam Techzone FabLab.</p>
      </div>

      <div className="lib-tabs">
        {tabs.map(t => (
          <button
            key={t}
            className={`lib-tab-btn ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="lib-empty">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <div style={{ fontWeight: 700, fontSize: '18px', color: '#e6edf3', marginBottom: '8px' }}>
            No components found
          </div>
          <div style={{ color: '#8b949e', fontSize: '14px' }}>
            {inventory.length === 0 
              ? "The inventory list is currently empty in the Google Sheet." 
              : `No items found matching the "${activeTab}" category.`}
          </div>
          <button onClick={syncInventory} className="lib-tab-btn" style={{marginTop: '20px', fontSize: '12px'}}>
             Force Refresh
          </button>
        </div>
      ) : (
        <div className="lib-grid">
          {filtered.map((item, i) => {
            const qty = parseInt(item.qty) || 0;
            const available = qty > 0;
            const IconComponent = CATEGORY_ICONS[item.category?.trim()] || CATEGORY_ICONS.Default;

            return (
              <div
                key={i}
                className={`lib-card ${!available ? 'lib-card--out' : ''}`}
                onClick={() => available && navigate('/borrow', { state: { selectedItem: item.name } })}
              >
                <div className="lib-card-img">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <IconComponent size={28} color="#8b9cb8" strokeWidth={1.5} />
                    <span style={{ fontSize: '10px', color: '#4a5874', textTransform: 'uppercase' }}>{item.category || 'General'}</span>
                  </div>
                </div>

                <div className="lib-card-info">
                  <h3 className="lib-card-name">{item.name}</h3>
                  <p className="lib-card-cat">{item.description || 'Verified Lab Hardware'}</p>

                  <div className="lib-card-footer">
                    <span className="lib-stock">
                       Stock: <strong style={{ color: available ? '#10b981' : '#ef4444' }}>{qty}</strong>
                    </span>
                    <span className={`lib-status ${available ? 'avail' : 'out'}`}>
                       {available ? 'AVAILABLE' : 'OUT OF STOCK'}
                    </span>
                  </div>

                  {available && <div className="lib-borrow-hint">Click to borrow →</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ComponentsPage;