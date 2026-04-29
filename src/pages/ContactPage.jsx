import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { sendContactMessage } from '../api/inventoryApi'; // Hooking up to your backend

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry', // Default subject
    message: ''
  });
  const [loading, setLoading] = useState(false);

  // ── Handle Input Changes ──────────────────────────────────────────
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ── Handle Form Submission ────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Sending your message...");

    try {
      const response = await sendContactMessage(formData);
      
      if (response.data.status === "success") {
        toast.success("Message sent! We'll get back to you shortly.", { id: toastId });
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' }); // Clear form
      } else {
        throw new Error("Failed to send");
      }
    } catch (error) {
      toast.error("Could not send message. Please try again later.", { id: toastId });
      console.error("Contact Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-page-wrapper">
      <div className="page-header container">
        <div className="page-header__eyebrow">
          <Mail size={14} style={{ marginRight: '8px' }} />
          Get in Touch
        </div>
        <h1 className="page-header__title">
          Contact <span className="gradient-text">Us</span>
        </h1>
        <p className="page-header__sub" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Have questions about the FabLab Inventory system or need technical support? We're here to help! Reach out to us through any of the channels below.
        </p>
      </div>

      <div className="container" style={{ paddingBottom: '80px' }}>
        <div className="contact-grid">
          {/* Main Info Box */}
          <div className="glass-panel contact-card">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem', color: '#f0f4ff', marginBottom: '20px' }}>
              <MapPin size={24} color="#6366f1" />
              Headquarters
            </h2>
            <div style={{ color: 'var(--text-2)', lineHeight: '1.7', fontSize: '15px' }}>
              <strong style={{ color: '#fff', fontSize: '16px', display: 'block', marginBottom: '4px' }}>
                AIC RAISE FabLab
              </strong>
              Rathinam Techzone Campus,<br />
              Pollachi Main Road, Eachanari,<br />
              Coimbatore, Tamil Nadu 641021<br />
              India
            </div>
            
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="contact-item">
                <Phone size={18} color="#8b949e" />
                <span>+91 98765 43210</span>
              </div>
              <div className="contact-item">
                <Mail size={18} color="#8b949e" />
                <span>support@aicraise.com</span>
              </div>
              <div className="contact-item">
                <Clock size={18} color="#8b949e" />
                <span>Mon - Fri, 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>

          {/* Functional Contact Form */}
          <div className="glass-panel contact-form-panel">
            <h2 style={{ fontSize: '1.4rem', color: '#f0f4ff', marginBottom: '20px' }}>
              Send us a Message
            </h2>
            <form className="fancy-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Your Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="input-group">
                <label>Message</label>
                <textarea 
                  name="message" 
                  rows="4" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                  style={{ 
                    width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px', color: '#f0f4ff', fontSize: '14px', resize: 'vertical'
                  }}
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="confirm-btn" 
                disabled={loading}
                style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {loading ? "Sending..." : <>Send Message <Send size={16} /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;