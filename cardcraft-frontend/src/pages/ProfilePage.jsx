import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  Shield,
  Calendar,
  LogOut
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUserProfile, logout } = useAuth();

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/me');
      const u = res.data.data;
      setProfileData({
        fullName: u.fullName || '',
        phone: u.phone || '',
        bio: u.bio || '',
        avatarUrl: u.avatarUrl || '',
      });
      updateUserProfile(u);
    } catch (e) {
      console.error('Failed to fetch user profile', e);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!profileData.fullName.trim()) {
      setProfileError('Full name is required');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await api.put('/users/me', profileData);
      updateUserProfile(res.data.data);
      setProfileSuccess('Profile details saved successfully');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setSavingPassword(true);
    try {
      await api.put('/users/me/password', passwordData);
      setPasswordSuccess('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <DashboardLayout
      title="User Profile & Account Settings"
      subtitle="Manage your personal credentials, contact info, security, and account preferences."
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', alignItems: 'flex-start' }} className="profile-grid">
        {/* Left: Edit Profile Form */}
        <div>
          <div className="card-box" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
              Personal Profile
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Update your display name, contact phone, and public bio.
            </p>

            {profileSuccess && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', color: '#065f46', fontSize: '0.825rem', marginBottom: '1.25rem' }}>
                <CheckCircle2 size={16} />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '0.825rem', marginBottom: '1.25rem' }}>
                <AlertCircle size={16} />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  />
                  <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Registered)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    disabled
                    className="form-control"
                    style={{ paddingLeft: '2.5rem', background: '#f1f5f9', cursor: 'not-allowed' }}
                    value={user?.email || ''}
                  />
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                  Email address is linked to your account authentication and cannot be edited directly.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="+1 (555) 000-0000"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                  <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Short Bio</label>
                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Tell people about yourself..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Avatar Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://..."
                  value={profileData.avatarUrl}
                  onChange={(e) => setProfileData({ ...profileData, avatarUrl: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="btn btn-primary"
                style={{ marginTop: '0.5rem' }}
              >
                <Save size={16} /> {savingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="card-box" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
              Security & Password
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Update your account password with BCrypt encryption.
            </p>

            {passwordSuccess && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', color: '#065f46', fontSize: '0.825rem', marginBottom: '1.25rem' }}>
                <CheckCircle2 size={16} />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '0.825rem', marginBottom: '1.25rem' }}>
                <AlertCircle size={16} />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label className="form-label">Current Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    required
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                  <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">New Password *</label>
                  <input
                    type="password"
                    required
                    className="form-control"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    className="form-control"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="btn btn-secondary"
                style={{ marginTop: '0.5rem' }}
              >
                <Lock size={16} /> {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Account Summary */}
        <div>
          <div className="card-box" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>
              Account Summary
            </h4>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '1.35rem',
                }}
              >
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>
                  {user?.fullName}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {user?.email}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Role</span>
                <span className="badge badge-purple">{user?.role || 'ROLE_USER'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Status</span>
                <span className="badge badge-green">Active Account</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Session Security</span>
                <span style={{ color: '#059669', fontWeight: '600' }}>JWT Active</span>
              </div>
            </div>
          </div>

          <div className="card-box" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              Session Management
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1rem' }}>
              Logged in from current browser session. Signing out revokes refresh token rotations.
            </p>
            <button
              onClick={logout}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', color: '#ef4444' }}
            >
              <LogOut size={14} /> End Active Session
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ProfilePage;
