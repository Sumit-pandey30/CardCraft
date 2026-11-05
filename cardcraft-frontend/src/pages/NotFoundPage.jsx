import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Home, LayoutDashboard, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar />

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div
          className="card-box"
          style={{
            maxWidth: '500px',
            width: '100%',
            padding: '3rem 2rem',
            textAlign: 'center',
            borderRadius: '1.5rem',
          }}
        >
          <div
            style={{
              fontSize: '5rem',
              fontWeight: '900',
              lineHeight: 1,
              marginBottom: '1rem',
            }}
            className="gradient-text"
          >
            404
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
            Page Not Found
          </h2>

          <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
            The digital business card or page you are looking for does not exist, has been unpublished, or was moved.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-secondary">
              <Home size={16} /> Home
            </Link>

            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
