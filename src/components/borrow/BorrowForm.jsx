import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { takeComponents } from '../../api/inventoryApi';
import { Spinner } from '../common/StatusBadge';
import './BorrowForm.css';

const SUGGESTIONS = [
  'Laptop', 'Monitor', 'Keyboard', 'Mouse', 'Headset', 'Webcam',
  'USB Hub', 'HDMI Cable', 'Power Adapter', 'Docking Station',
  'Tablet', 'Oscilloscope', 'Multimeter', 'Arduino', 'Raspberry Pi',
  'Hard Drive', 'SSD', 'RAM Module', 'Projector', 'Extension Cord',
  'Soldering Iron', 'Ethernet Cable', 'Router', 'GPU', 'CPU',
];

const today = () => new Date().toISOString().split('T')[0];

const EMPTY_FORM = { name: '', email: '', company: '', return_date: today() };

const BorrowForm = () => {
  const navigate = useNavigate();
  const [form, setForm]           = useState(EMPTY_FORM);
  const [components, setComponents] = useState(['']);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(null);

  /* ── Field handlers ─────────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const updateComp = useCallback((idx, val) => {
    setComponents((p) => p.map((c, i) => (i === idx ? val : c)));
    if (errors.components) setErrors((p) => ({ ...p, components: '' }));
  }, [errors.components]);

  const addComp    = () => setComponents((p) => [...p, '']);
  const removeComp = (idx) => {
    if (components.length === 1) return;
    setComponents((p) => p.filter((_, i) => i !== idx));
  };

  /* ── Validation ─────────────────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = 'Name must be at least 2 characters.';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address.';
    if (!form.company.trim() || form.company.trim().length < 2)
      e.company = 'Company name is required.';
    if (!form.return_date)
      e.return_date = 'Return date is required.';
    else if (form.return_date < today())
      e.return_date = 'Return date must not be in the past.';
    if (!components.some((c) => c.trim()))
      e.components = 'Add at least one component.';
    return e;
  };

  /* ── Submit ─────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const cleanComps = components.map((c) => c.trim()).filter(Boolean);
      const res = await takeComponents({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        company: form.company.trim(),
        return_date: form.return_date,
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
    setForm(EMPTY_FORM);
    setComponents(['']);
    setErrors({});
    setSuccess(null);
  };

  /* ── Success screen ─────────────────────────────────────────────── */
  if (success) {
    return (
      <div className="borrow-card">
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
          </div>
        </div>
      </div>
    );
  }

  /* ── Form ────────────────────────────────────────────────────────── */
  return (
    <form className="borrow-card" onSubmit={handleSubmit} noValidate>

      {/* Personal Info */}
      <div className="form-section">Personal Information</div>

      <div className="form-row">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="b-name">
            Full Name <span className="req">*</span>
          </label>
          <input
            id="b-name" name="name" type="text"
            className={`form-input ${errors.name ? 'form-input--error' : ''}`}
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
          />
          <span className="form-error">{errors.name}</span>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="b-email">
            Email Address <span className="req">*</span>
          </label>
          <input
            id="b-email" name="email" type="email"
            className={`form-input ${errors.email ? 'form-input--error' : ''}`}
            placeholder="john@company.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
          <span className="form-error">{errors.email}</span>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="b-company">
            Company Name <span className="req">*</span>
          </label>
          <input
            id="b-company" name="company" type="text"
            className={`form-input ${errors.company ? 'form-input--error' : ''}`}
            placeholder="Acme Corp"
            value={form.company}
            onChange={handleChange}
            autoComplete="organization"
          />
          <span className="form-error">{errors.company}</span>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="b-return-date">
            Return Date <span className="req">*</span>
          </label>
          <input
            id="b-return-date" name="return_date" type="date"
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
              list="borrow-suggestions"
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

        {/* HTML5 datalist autocomplete */}
        <datalist id="borrow-suggestions">
          {SUGGESTIONS.map((s) => <option key={s} value={s} />)}
        </datalist>
      </div>

      <span className="form-error">{errors.components}</span>
      <span className="form-hint">💡 Start typing to see suggestions</span>

      {/* Actions */}
      <div className="form-actions">
        <button type="button" className="btn btn--outline" onClick={handleReset}>
          Clear
        </button>
        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? <><Spinner />&nbsp;Submitting…</> : '📤 Submit Request'}
        </button>
      </div>
    </form>
  );
};

export default BorrowForm;
