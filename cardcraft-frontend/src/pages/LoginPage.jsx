import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';
  const queryParams = new URLSearchParams(location.search);
  const registeredSuccess = queryParams.get('registered') === 'true';
  const sessionExpired = queryParams.get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        padding: '1.5rem',
      }}
    >
      <div
        className="card-box"
        style={{
          maxWidth: '440px',
          width: '100%',
          padding: '2.25rem',
          borderRadius: '1.25rem',
          boxShadow: '0 20px 35px -10px rgba(0,0,0,0.08)',
        }}
      >
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <img src="/logo.svg" alt="CardCraft" style={{ width: '36px', height: '36px' }} />
            <span style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#0f172a' }}>
              Card<span className="gradient-text">Craft</span>
            </span>
          </Link>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>Welcome back</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
            Sign in to manage your digital business cards
          </p>
        </div>

        {registeredSuccess && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', color: '#065f46', fontSize: '0.825rem', marginBottom: '1.25rem' }}>
            <CheckCircle2 size={16} />
            <span>Account created successfully! Please sign in.</span>
          </div>
        )}

        {sessionExpired && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', color: '#92400e', fontSize: '0.825rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={16} />
            <span>Your session has expired. Please log in again.</span>
          </div>
        )}

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '0.825rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail
                size={17}
                color="#94a3b8"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock
                size={17}
                color="#94a3b8"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: '#7c3aed', fontWeight: '700' }}>
            Sign up free
          </Link>
        </div>

        {/* Demo Admin Tip */}
        <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b' }}>
          <strong>Default Admin:</strong> admin@cardcraft.io / Admin@CardCraft2025!
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
