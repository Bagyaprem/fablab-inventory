import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Common
import { Spinner } from './components/common/StatusBadge';

// Global base styles only
import './index.css';

// ── Lazy-loaded pages ────────────────────────────────────────────────
const HomePage   = lazy(() => import('./pages/HomePage'));
const BorrowPage = lazy(() => import('./pages/BorrowPage'));
const ReturnPage = lazy(() => import('./pages/ReturnPage'));

// ── Page loading fallback ────────────────────────────────────────────
const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '60vh', gap: '12px', color: 'var(--text-2)',
  }}>
    <Spinner size={24} color="#818cf8" />
    <span style={{ fontSize: '14px' }}>Loading…</span>
  </div>
);

// ── 404 page ─────────────────────────────────────────────────────────
const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '100px 24px' }}>
    <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
    <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>Page Not Found</h1>
    <p style={{ color: 'var(--text-2)', marginBottom: '28px' }}>
      The page you're looking for doesn't exist.
    </p>
    <a href="/" className="btn btn--primary">← Go Home</a>
  </div>
);

// ══════════════════════════════════════════════════════════════════════
function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Global nav */}
        <Header />

        {/* Page content below fixed nav */}
        <main style={{ flex: 1, paddingTop: 'var(--nav-h)' }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"       element={<HomePage />}   />
              <Route path="/borrow" element={<BorrowPage />} />
              <Route path="/take" element={<ReturnPage />} />
              <Route path="*"       element={<NotFound />}   />
            </Routes>
          </Suspense>
        </main>

        {/* Global footer */}
        <Footer />
      </div>

      {/* Toast notifications */}
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
          success: { iconTheme: { primary: '#10b981', secondary: '#1a2236' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#1a2236' } },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
