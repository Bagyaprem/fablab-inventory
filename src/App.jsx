import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// ─── 1. Layout & Global Components ────────────────────────────────
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ChatWidget from './components/common/ChatWidget';
import { Spinner } from './components/common/StatusBadge';

// Global styles
import './index.css';

// ─── 2. Lazy Loaded Pages ─────────────────────────────────────────
// This improves performance by only loading pages when needed
const HomePage = lazy(() => import('./pages/HomePage'));
const ComponentsPage = lazy(() => import('./pages/ComponentsPage'));
const BorrowPage = lazy(() => import('./pages/BorrowPage'));
const ReturnPage = lazy(() => import('./pages/ReturnPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

// ─── 3. Fallback & Helper Components ──────────────────────────────
const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '60vh', gap: '12px', color: 'var(--text-2)',
  }}>
    <Spinner size={24} color="#818cf8" />
    <span style={{ fontSize: '14px', fontWeight: 500 }}>Synchronizing assets...</span>
  </div>
);

const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '100px 24px' }}>
    <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
    <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px', color: 'white' }}>
      Page Not Found
    </h1>
    <p style={{ color: 'var(--text-2)', marginBottom: '28px' }}>
      The asset or page you're looking for doesn't exist.
    </p>
    <a href="/" className="btn btn--primary" style={{ textDecoration: 'none', background: '#6366f1', padding: '12px 24px', borderRadius: '8px', color: 'white' }}>
      ← Back to Dashboard
    </a>
  </div>
);

// ─── 4. Main Application ──────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Navigation Bar */}
        <Header />

        {/* Content Area */}
        <main style={{ flex: 1, paddingTop: 'var(--nav-h, 70px)' }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Home/Dashboard */}
              <Route path="/" element={<HomePage />} />

              {/* Inventory Library */}
              <Route path="/components" element={<ComponentsPage />} />

              {/* Transactions */}
              <Route path="/borrow" element={<BorrowPage />} />
              <Route path="/return" element={<ReturnPage />} />

              {/* Contact Us */}
              <Route path="/contact" element={<ContactPage />} />

              {/* 404 Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        {/* Floating Support Assistant */}
        <ChatWidget />

        {/* Global Footer */}
        <Footer />
      </div>

      {/* Global Notifications System */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a2236',
            color: '#f0f4ff',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#1a2236' }
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#1a2236' }
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;