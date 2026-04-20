import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { takeComponents } from '../api/inventoryApi';
import { Spinner } from './StatusBadge';

const COMMON_COMPONENTS = [
  'Monitor', 'Keyboard', 'Mouse', 'Webcam',
  'USB Hub', 'HDMI Cable', 'Power Adapter', 
  'Oscilloscope', 'Multimeter', 'Arduino', 'Raspberry Pi',
  'Soldering Kit', 
];

const today = () => new Date().toISOString().split('T')[0];

const INITIAL_FORM = {
  name: '', email: '', company: '', return_date: today(),
};

const TakeComponentsForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [components, setComponents] = useState(['']);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  // ── Field change ──────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  // ── Components array ──────────────────────────────────────────────
  const updateComp = useCallback((idx, value) => {
    setComponents((prev) => prev.map((c, i) => (i === idx ? value : c)));
    if (errors.components) setErrors((p) => ({ ...p, components: '' }));
  }, [errors.components]);

  const addComp = () => setComponents((p) => [...p, '']);

  const removeComp = (idx) => {
    if (components.length === 1) return;
    setComponents((p) => p.filter((_, i) => i !== idx));
  };

  // ── Validation ────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Please enter a valid email address.';
    if (!form.company.trim() || form.company.trim().length < 2)
      e.company = 'Company name is required.';
    if (!form.return_date) e.return_date = 'Return date is required.';
    else if (form.return_date < today()) e.return_date = 'Return date must not be in the past.';
    const cleanComps = components.filter((c) => c.trim());
    if (cleanComps.length === 0) e.components = 'At least one component is required.';
    return e;
  };

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const cleanComps = components.map((c) => c.trim()).filter(Boolean);
      const res = await takeComponents({
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        company: form.company.trim(),
        components: cleanComps,
      });
      setSuccess(res.data.data);
      toast.success('Request submitted! Support team notified.');
    } catch (err) {
      toast.error(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setComponents(['']);
    setErrors({});
    setSuccess(null);
  };

  // ── Success screen ────────────────────────────────────────────────
  if (success) {
    return (
      <div className="form-card">
        <div className="success-screen">
          <div className="success-screen__icon">🎉</div>
          <div className="success-screen__title">Request Submitted!</div>
          <div className="success-screen__msg">
            Your inventory request has been recorded and the product support team has been notified via email.
          </div>
          <div className="success-screen__id">Request ID: {success.id}</div>
          <div className="success-screen__actions">
            <button className="btn btn--primary" onClick={handleReset}>New Request</button>
            <button className="btn btn--outline" onClick={() => navigate('/return')}>Return Items</button>
            <button className="btn btn--ghost" onClick={() => navigate('/admin')}>View Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────
  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      {/* Personal Details */}
      <div className="form-section">Personal Information</div>

      <div className="form-row" style={{ marginBottom: '22px' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="take-name">
            Full Name <span className="req">*</span>
          </label>
          <input
            id="take-name"
            name="name"
            type="text"
            className={`form-input ${errors.name ? 'form-input--error' : ''}`}
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
          />
          <span className="form-error">{errors.name}</span>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="take-email">
            Email Address <span className="req">*</span>
          </label>
          <input
            id="take-email"
            name="email"
            type="email"
            className={`form-input ${errors.email ? 'form-input--error' : ''}`}
            placeholder="john@company.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
          <span className="form-error">{errors.email}</span>
        </div>
      </div>

      <div className="form-row" style={{ marginBottom: '22px' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="take-company">
            Company Name <span className="req">*</span>
          </label>
          <input
            id="take-company"
            name="company"
            type="text"
            className={`form-input ${errors.company ? 'form-input--error' : ''}`}
            placeholder="Acme Corp"
            value={form.company}
            onChange={handleChange}
            autoComplete="organization"
          />
          <span className="form-error">{errors.company}</span>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="take-return-date">
            Return Date <span className="req">*</span>
          </label>
          <input
            id="take-return-date"
            name="return_date"
            type="date"
            className={`form-input ${errors.return_date ? 'form-input--error' : ''}`}
            min={today()}
            value={form.return_date}
            onChange={handleChange}
          />
          <span className="form-error">{errors.return_date}</span>
        </div>
      </div>

      <div className="form-divider" />

      {/* Components */}
      <div className="form-section">Components</div>

      <div className="comp-builder" style={{ marginBottom: '6px' }}>
        <div className="comp-builder__header">
          <span className="comp-builder__label">Component List</span>
          <button type="button" className="btn btn--ghost btn--sm" onClick={addComp}>
            ＋ Add Item
          </button>
        </div>

        {components.map((comp, idx) => (
          <div key={idx} className="comp-row">
            <input
              type="text"
              className="comp-row__input"
              placeholder="e.g. Laptop, Oscilloscope, Arduino…"
              value={comp}
              onChange={(e) => updateComp(idx, e.target.value)}
              list="comp-suggestions"
            />
            <button
              type="button"
              className="comp-row__remove"
              onClick={() => removeComp(idx)}
              title="Remove"
            >
              ✕
            </button>
          </div>
        ))}

        {/* HTML5 datalist for autocomplete */}
        <datalist id="comp-suggestions">
          {COMMON_COMPONENTS.map((c) => <option key={c} value={c} />)}
        </datalist>
      </div>
      <span className="form-error">{errors.components}</span>
      <span className="form-hint" style={{ marginBottom: '8px', display: 'block' }}>
        💡 Tip: Start typing to see suggestions
      </span>

      {/* Actions */}
      <div className="form-actions">
        <button type="button" className="btn btn--outline" onClick={handleReset}>
          Clear
        </button>
        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? <><Spinner />&nbsp;Submitting…</> : ' Submit Request'}
        </button>
      </div>
    </form>
  );
};

export default TakeComponentsForm;
