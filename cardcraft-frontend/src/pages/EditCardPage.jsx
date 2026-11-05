import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import LivePreview from '../components/card/LivePreview';
import api from '../services/api';
import {
  Save,
  Palette,
  Plus,
  Trash2,
  AlertCircle,
  Upload,
  CheckCircle2,
  ExternalLink,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const EditCardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('BASIC');
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [slugAvailable, setSlugAvailable] = useState(true);

  const [formData, setFormData] = useState({
    templateCode: 'PROFESSIONAL',
    themeId: null,
    slug: '',
    title: '',
    fullName: '',
    professionalTitle: '',
    companyOrInstitution: '',
    email: '',
    phone: '',
    location: '',
    shortBio: '',
    skills: '',
    avatarUrl: '',
    websiteUrl: '',
    primaryColor: '#7c3aed',
    secondaryColor: '#6366f1',
    backgroundColor: '#ffffff',
    textColor: '#0f172a',
    fontFamily: 'Inter, sans-serif',
    published: true,
    active: true,
    socialLinks: [],
  });

  useEffect(() => {
    loadCardAndThemes();
  }, [id]);

  const loadCardAndThemes = async () => {
    try {
      setLoading(true);
      const [cRes, thRes] = await Promise.all([
        api.get(`/cards/${id}`),
        api.get('/themes'),
      ]);

      const c = cRes.data.data;
      setFormData({
        templateCode: c.template?.code || 'PROFESSIONAL',
        themeId: c.theme?.id || null,
        slug: c.slug,
        title: c.title,
        fullName: c.fullName,
        professionalTitle: c.professionalTitle || '',
        companyOrInstitution: c.companyOrInstitution || '',
        email: c.email || '',
        phone: c.phone || '',
        location: c.location || '',
        shortBio: c.shortBio || '',
        skills: c.skills || '',
        avatarUrl: c.avatarUrl || '',
        websiteUrl: c.websiteUrl || '',
        primaryColor: c.primaryColor || '#7c3aed',
        secondaryColor: c.secondaryColor || '#6366f1',
        backgroundColor: c.backgroundColor || '#ffffff',
        textColor: c.textColor || '#0f172a',
        fontFamily: c.fontFamily || 'Inter, sans-serif',
        published: c.published,
        active: c.active,
        socialLinks: c.socialLinks || [],
      });
      setThemes(thRes.data.data || []);
    } catch (e) {
      setError('Failed to load business card');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyTheme = (theme) => {
    setFormData((prev) => ({
      ...prev,
      themeId: theme.id,
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      backgroundColor: theme.backgroundColor,
      textColor: theme.textColor,
      fontFamily: theme.fontFamily,
    }));
  };

  const handleAddSocialLink = () => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { platform: 'CUSTOM', url: '', label: 'Portfolio', displayOrder: prev.socialLinks.length },
      ],
    }));
  };

  const handleRemoveSocialLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSocialLinkChange = (index, field, value) => {
    const updated = [...formData.socialLinks];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, socialLinks: updated }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('avatarUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.fullName.trim() || !formData.title.trim()) {
      setError('Full name and card title are required');
      return;
    }

    setSaving(true);
    try {
      await api.put(`/cards/${id}`, formData);
      setSuccess('Card updated successfully!');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update business card');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Edit Business Card">
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          Loading card details...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`Edit: ${formData.title}`}
      subtitle={`URL: /c/${formData.slug}`}
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <a
            href={`/c/${formData.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <Eye size={14} /> View Live
          </a>
          <button onClick={handleSubmit} disabled={saving} className="btn btn-primary btn-sm">
            <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      }
    >
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.85rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#dc2626', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.85rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', color: '#065f46', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Two-Panel Builder */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'flex-start' }} className="builder-grid">
        {/* Left: Form */}
        <div className="card-box" style={{ padding: '1.75rem' }}>
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '0.75rem',
              marginBottom: '1.5rem',
              overflowX: 'auto',
            }}
          >
            {[
              { id: 'BASIC', label: '1. Profile Info' },
              { id: 'DESIGN', label: '2. Template & Colors' },
              { id: 'CONTACT', label: '3. Contact Endpoints' },
              { id: 'SKILLS', label: '4. Skills & Bio' },
              { id: 'SOCIAL', label: '5. Social Handles' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  fontWeight: '600',
                  background: activeTab === tab.id ? '#ede9fe' : 'transparent',
                  color: activeTab === tab.id ? '#7c3aed' : '#64748b',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === 'BASIC' && (
              <div>
                <div className="form-group">
                  <label className="form-label">Card Nickname / Title *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Unique Public Slug *</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ padding: '0.75rem 0.85rem', background: '#f1f5f9', border: '1.5px solid #e2e8f0', borderRight: 'none', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px', fontSize: '0.85rem', color: '#64748b' }}>
                      cardcraft.io/c/
                    </span>
                    <input
                      type="text"
                      required
                      className="form-control"
                      style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Professional Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.professionalTitle}
                      onChange={(e) => handleInputChange('professionalTitle', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company / Institution</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.companyOrInstitution}
                      onChange={(e) => handleInputChange('companyOrInstitution', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Profile Photo (Upload or URL)</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                    <label
                      className="btn btn-secondary btn-sm"
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Upload size={14} /> Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://..."
                    value={formData.avatarUrl}
                    onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'DESIGN' && (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" style={{ marginBottom: '0.75rem' }}>Template</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                    {['PROFESSIONAL', 'DEVELOPER', 'STUDENT', 'FREELANCER', 'BUSINESS'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleInputChange('templateCode', t)}
                        style={{
                          padding: '12px 8px',
                          borderRadius: '10px',
                          border: `2px solid ${formData.templateCode === t ? '#7c3aed' : '#e2e8f0'}`,
                          background: formData.templateCode === t ? '#f5f3ff' : '#ffffff',
                          color: formData.templateCode === t ? '#7c3aed' : '#334155',
                          fontWeight: '700',
                          fontSize: '0.85rem',
                          textAlign: 'center',
                        }}
                      >
                        {t.charAt(0) + t.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" style={{ marginBottom: '0.75rem' }}>Presets</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                    {themes.map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => handleApplyTheme(th)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          background: '#ffffff',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: th.primaryColor }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{th.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Primary Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        style={{ width: '42px', height: '42px', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 0 }}
                      />
                      <input
                        type="text"
                        className="form-control"
                        value={formData.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Background Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={formData.backgroundColor}
                        onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                        style={{ width: '42px', height: '42px', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 0 }}
                      />
                      <input
                        type="text"
                        className="form-control"
                        value={formData.backgroundColor}
                        onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'CONTACT' && (
              <div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input
                    type="url"
                    className="form-control"
                    value={formData.websiteUrl}
                    onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'SKILLS' && (
              <div>
                <div className="form-group">
                  <label className="form-label">Short Bio</label>
                  <textarea
                    rows="4"
                    className="form-control"
                    value={formData.shortBio}
                    onChange={(e) => handleInputChange('shortBio', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Skills (Comma separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'SOCIAL' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Social Links</label>
                  <button
                    type="button"
                    onClick={handleAddSocialLink}
                    className="btn btn-secondary btn-sm"
                  >
                    <Plus size={14} /> Add Social Link
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {formData.socialLinks.map((link, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        background: '#f8fafc',
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <select
                        value={link.platform}
                        onChange={(e) => handleSocialLinkChange(idx, 'platform', e.target.value)}
                        className="form-control"
                        style={{ width: '130px', padding: '0.5rem', fontSize: '0.8rem' }}
                      >
                        <option value="LINKEDIN">LinkedIn</option>
                        <option value="GITHUB">GitHub</option>
                        <option value="TWITTER">Twitter/X</option>
                        <option value="INSTAGRAM">Instagram</option>
                        <option value="YOUTUBE">YouTube</option>
                        <option value="WEBSITE">Website</option>
                        <option value="DISCORD">Discord</option>
                        <option value="CUSTOM">Custom Link</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Label"
                        value={link.label}
                        onChange={(e) => handleSocialLinkChange(idx, 'label', e.target.value)}
                        className="form-control"
                        style={{ width: '110px', padding: '0.5rem', fontSize: '0.8rem' }}
                      />

                      <input
                        type="url"
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) => handleSocialLinkChange(idx, 'url', e.target.value)}
                        className="form-control"
                        style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveSocialLink(idx)}
                        style={{ color: '#ef4444', padding: '6px' }}
                        title="Remove Link"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => handleInputChange('published', e.target.checked)}
                />
                <label htmlFor="published" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155', cursor: 'pointer' }}>
                  Card Published (Live)
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
              >
                <Save size={16} /> {saving ? 'Saving...' : 'Save Updates'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Preview */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <LivePreview cardData={formData} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditCardPage;
