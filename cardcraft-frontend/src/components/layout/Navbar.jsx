import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, PlusCircle, LayoutDashboard, User, LogOut, Menu, X, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/logo.svg" alt="CardCraft" style={{ width: '32px', height: '32px' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Card<span className="gradient-text">Craft</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="nav-desktop">
          <Link to="/templates" style={{ fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>
            Templates
          </Link>
          <a href="/#features" style={{ fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>
            Features
          </a>
          <a href="/#demo" style={{ fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>
            Live Demo
          </a>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
              <Link to="/cards/create" className="btn btn-primary btn-sm">
                <PlusCircle size={15} /> Create Card
              </Link>
              <Link to="/dashboard" className="btn btn-secondary btn-sm">
                <LayoutDashboard size={15} /> Dashboard
              </Link>

              {/* User Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px',
                    borderRadius: '999px',
                    border: '1.5px solid #e2e8f0',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                    }}
                  >
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                </button>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '42px',
                      width: '200px',
                      background: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                      border: '1px solid #e2e8f0',
                      padding: '0.5rem',
                      zIndex: 100,
                    }}
                  >
                    <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>{user?.fullName}</p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#334155', borderRadius: '6px' }}
                    >
                      <User size={15} /> Profile & Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.85rem',
                        color: '#ef4444',
                        borderRadius: '6px',
                      }}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none', padding: '6px' }}
          className="nav-mobile-btn"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
