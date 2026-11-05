import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Menu, PlusCircle, Bell, ExternalLink } from 'lucide-react';

export const DashboardLayout = ({ children, title, subtitle, actions }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }} className="main-content-layout">
        {/* Top bar */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '0.85rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ display: 'none', padding: '6px', color: '#475569' }}
              className="sidebar-mobile-toggle"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', lineHeight: 1.2 }}>
                {title || 'Dashboard'}
              </h1>
              {subtitle && (
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {actions}
            <Link to="/cards/create" className="btn btn-primary btn-sm">
              <PlusCircle size={15} /> <span className="btn-create-text">Create Card</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '1.75rem' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .main-content-layout {
            margin-left: 0 !important;
          }
          .sidebar-mobile-toggle {
            display: block !important;
          }
        }
        @media (max-width: 480px) {
          .btn-create-text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
