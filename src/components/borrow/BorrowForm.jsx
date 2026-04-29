import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, User, Building, Mail, Package, Calendar, Plus, X, CheckCircle, PackageOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { takeComponents } from '../../api/inventoryApi';
import './BorrowForm.css';

const BorrowForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [genId, setGenId] = useState("");
  const [currItem, setCurrItem] = useState("");
  const [form, setForm] = useState({ name: '', email: '', company: '', components: [], return_date: '' });

  useEffect(() => {
    if (location.state?.selectedItem) {
      setForm(p => ({ ...p, components: [...new Set([...p.components, location.state.selectedItem])] }));
    }
  }, [location.state]);

  const addComp = () => {
    if (!currItem.trim() || form.components.includes(currItem.trim())) return;
    setForm({ ...form, components: [...form.components, currItem.trim()] });
    setCurrItem("");
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    if (form.components.length === 0) return toast.error("Add at least one component");

    const tId = toast.loading("Syncing with FabLab...");
    try {
      const res = await takeComponents(form);
      setGenId(res.data.id);
      setSubmitted(true);
      toast.success("Request logged as 'Waitlist'", { id: tId });
    } catch (err) {
      toast.error("Sync failed", { id: tId });
    }
  };

  if (submitted) return (
    <div className="form-container">
      <div className="form-card success-card">
        <div className="success-icon-wrapper">
          <CheckCircle size={70} color="#10b981" />
        </div>
        <h2>Request Finalized!</h2>
        <div className="success-id-box">
          <span className="id-label">Request ID</span>
          <span className="id-value">{genId}</span>
        </div>
        <p className="success-subtext">
          Status: <strong>Waitlist</strong><br/>
          Eve has sent a confirmation to your email.
        </p>
        <button onClick={() => navigate('/')} className="confirm-btn">Return Home</button>
      </div>
    </div>
  );

  return (
    <div className="form-container">
      <div className="borrow-header-area">
      </div>

      <div className="form-card">
        <div className="card-accent"></div>
        <form onSubmit={handleSumbit} className="fancy-form">
          <div className="input-row">
            <div className="input-group">
              <label><User size={14}/> Name</label>
              <input type="text" required onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="input-group">
              <label><Building size={14}/> Company</label>
              <input type="text" required onChange={e => setForm({...form, company: e.target.value})} />
            </div>
          </div>

          <div className="input-group">
            <label><Mail size={14}/> Email</label>
            <input type="email"  required onChange={e => setForm({...form, email: e.target.value})} />
          </div>

          <div className="input-group">
            <label><Package size={14}/> Components</label>
            <div className="add-item-control">
              <input 
                value={currItem} 
                onChange={e => setCurrItem(e.target.value)} 
                placeholder="Type component and press Add..." 
                onKeyDown={e => e.key === 'Enter' ? (e.preventDefault(), addComp()) : null}
              />
              <button type="button" onClick={addComp} className="glow-add-btn">
                <Plus size={20} />
              </button>
            </div>
            
            <div className="tags-wrapper">
              {form.components.length === 0 && <span className="empty-tags">No items added yet.</span>}
              {form.components.map((c, i) => (
                <span key={i} className="comp-tag">
                  {c} 
                  <button type="button" className="tag-remove" onClick={() => setForm({...form, components: form.components.filter(x => x !== c)})}>
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label><Calendar size={14}/> Return Date</label>
            <input type="date" required onChange={e => setForm({...form, return_date: e.target.value})} />
          </div>

          <button type="submit" className="confirm-btn">
            Confirm Request <Send size={16}/>
          </button>
        </form>
      </div>
    </div>
  );
};

export default BorrowForm;