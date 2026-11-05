import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CreditCard,
  PlusCircle,
  LayoutTemplate,
  BarChart3,
  User,
  LogOut,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Cards', path: '/cards', icon: CreditCard },
    { name: 'Create Card', path: '/cards/create', icon: PlusCircle, highlight: true },
    { name: 'Templates', path: '/templates', icon: LayoutTemplate },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Profile & Settings', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            zIndex: 40,
            backdropFilter: 'blur(2px)',
          }}
          className="sidebar-backdrop"
        />
      )}

      <aside
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 50,
          transition: 'transform 0.3s ease',
        }}
        className={`sidebar ${isOpen ? 'open' : ''}`}
      >
        <div>
          {/* Brand Header */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <NavLink to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/logo.svg" alt="CardCraft" style={{ width: '32px', height: '32px' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#0f172a' }}>
                Card<span className="gradient-text">Craft</span>
              </span>
            </NavLink>
          </div>

          {/* Navigation Links */}
          <div style={{ padding: '1rem 0.75rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', padding: '0 0.75rem 0.5rem' }}>
              Main Navigation
            </p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/dashboard'}
                    onClick={() => { if (onClose) onClose(); }}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '0.625rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? '600' : '500',
                      color: isActive ? '#7c3aed' : item.highlight ? '#6d28d9' : '#475569',
                      backgroundColor: isActive ? '#ede9fe' : item.highlight ? '#f5f3ff' : 'transparent',
                      transition: 'all 0.15s ease',
                    })}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                    {item.highlight && (
                      <span style={{ marginLeft: 'auto', background: '#7c3aed', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '999px', fontWeight: '700' }}>
                        NEW
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Card & Logout Footer */}
        <div style={{ padding: '1rem', borderTop: '1px solid #f1f5f9' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0.75rem',
              borderRadius: '10px',
              backgroundColor: '#f8fafc',
              marginBottom: '0.5rem',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.9rem',
                flexShrink: 0,
              }}
            >
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.825rem', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.fullName || 'User'}
              </p>
              <p style={{ fontSize: '0.72rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '0.6rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.825rem',
              fontWeight: '600',
              color: '#ef4444',
              background: '#fef2f2',
              transition: 'background 0.15s ease',
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
