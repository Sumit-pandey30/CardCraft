import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import LivePreview from '../components/card/LivePreview';
import api from '../services/api';
import {
  Save,
  Palette,
  User,
  Share2,
  Sparkles,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Upload
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CreateCardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Selected template from templates gallery query param
  const queryParams = new URLSearchParams(location.search);
  const initialTemplate = queryParams.get('template') || 'PROFESSIONAL';

  const [activeTab, setActiveTab] = useState('BASIC'); // 'BASIC' | 'CONTACT' | 'DESIGN' | 'SKILLS' | 'SOCIAL'
  const [templates, setTemplates] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(true);

  const [formData, setFormData] = useState({
    templateCode: initialTemplate,
    themeId: null,
    slug: `card-${Math.floor(1000 + Math.random() * 9000)}`,
    title: 'My Primary Card',
    fullName: '',
    professionalTitle: '',
    companyOrInstitution: '',
    email: '',
    phone: '',
    location: '',
    shortBio: '',
    skills: 'Leadership, Strategic Planning, Innovation',
    avatarUrl: '',
    websiteUrl: '',
    primaryColor: '#7c3aed',
    secondaryColor: '#6366f1',
    backgroundColor: '#ffffff',
    textColor: '#0f172a',
    fontFamily: 'Inter, sans-serif',
    published: true,
    socialLinks: [
      { platform: 'LINKEDIN', url: '', label: 'LinkedIn', displayOrder: 0 },
      { platform: 'GITHUB', url: '', label: 'GitHub', displayOrder: 1 },
      { platform: 'TWITTER', url: '', label: 'Twitter', displayOrder: 2 },
    ],
  });

  useEffect(() => {
    fetchTemplatesAndThemes();
  }, []);

  const fetchTemplatesAndThemes = async () => {
    try {
      const [tRes, thRes] = await Promise.all([
        api.get('/templates'),
        api.get('/themes'),
      ]);
      setTemplates(tRes.data.data || []);
      setThemes(thRes.data.data || []);
    } catch (e) {
      console.error('Error fetching design presets', e);
    }
  };

  const checkSlug = async (slug) => {
    if (!slug) return;
    try {
      setSlugChecking(true);
      const res = await api.get(`/cards/slug-available?slug=${encodeURIComponent(slug)}`);
      setSlugAvailable(res.data.data);
    } catch (e) {
      // ignore
    } finally {
      setSlugChecking(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'slug') {
      checkSlug(value);
    }
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

  // Social link management
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

    if (!formData.fullName.trim()) {
      setError('Full Name is required');
      setActiveTab('BASIC');
      return;
    }

    if (!formData.title.trim()) {
      setError('Card Title label is required');
      setActiveTab('BASIC');
      return;
    }

    if (!slugAvailable) {
      setError('The chosen URL slug is already taken. Please enter another unique slug.');
      setActiveTab('BASIC');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/cards', formData);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      navigate('/cards');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create business card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Create Digital Business Card"
      subtitle="Design your card using our interactive two-panel builder with instant live updates."
      actions={
        <button onClick={handleSubmit} disabled={loading} className="btn btn-primary btn-sm">
          <Save size={15} /> {loading ? 'Saving...' : 'Publish Card'}
        </button>
      }
    >
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.85rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#dc2626', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Two-Panel Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'flex-start' }} className="builder-grid">
        {/* Left: Interactive Form */}
        <div className="card-box" style={{ padding: '1.75rem' }}>
          {/* Form Tabs */}
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
            {/* TAB 1: BASIC PROFILE */}
            {activeTab === 'BASIC' && (
              <div>
                <div className="form-group">
                  <label className="form-label">Card Nickname / Title *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Lead Consultant Card, Developer Profile"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Unique Public Slug *</span>
                    <span style={{ fontSize: '0.75rem', color: slugAvailable ? '#10b981' : '#ef4444' }}>
                      {slugChecking ? 'Checking...' : slugAvailable ? '✓ Slug Available' : '✗ Slug Taken'}
                    </span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ padding: '0.75rem 0.85rem', background: '#f1f5f9', border: '1.5px solid #e2e8f0', borderRight: 'none', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px', fontSize: '0.85rem', color: '#64748b' }}>
                      cardcraft.io/c/
                    </span>
                    <input
                      type="text"
                      required
                      className="form-control"
                      style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      placeholder="alex-morgan"
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
                    placeholder="e.g. Alex Morgan"
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
                      placeholder="e.g. Software Architect"
                      value={formData.professionalTitle}
                      onChange={(e) => handleInputChange('professionalTitle', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company / Institution</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Acme Labs"
                      value={formData.companyOrInstitution}
                      onChange={(e) => handleInputChange('companyOrInstitution', e.target.value)}
                    />
                  </div>
                </div>

                {/* Avatar / Photo Upload & URL */}
                <div className="form-group">
                  <label className="form-label">Profile Photo (Upload Image or Paste URL)</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                    <label
                      className="btn btn-secondary btn-sm"
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Upload size={14} /> Upload Device File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>or paste an online image link below:</span>
                  </div>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.avatarUrl}
                    onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: TEMPLATE & DESIGN */}
            {activeTab === 'DESIGN' && (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" style={{ marginBottom: '0.75rem' }}>Select Card Template</label>
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
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {t.charAt(0) + t.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preset Themes */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" style={{ marginBottom: '0.75rem' }}>Apply Color Theme Preset</label>
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
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: th.primaryColor, flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{th.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Color Pickers */}
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
                    <label className="form-label">Card Background Color</label>
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

            {/* TAB 3: CONTACT ENDPOINTS */}
            {activeTab === 'CONTACT' && (
              <div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="contact@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+1 (555) 234-5678"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location / City</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. London, UK / San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Website or Portfolio URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://mywebsite.com"
                    value={formData.websiteUrl}
                    onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* TAB 4: SKILLS & BIO */}
            {activeTab === 'SKILLS' && (
              <div>
                <div className="form-group">
                  <label className="form-label">Short Biography</label>
                  <textarea
                    rows="4"
                    className="form-control"
                    placeholder="Tell your professional story in 2-3 sentences..."
                    value={formData.shortBio}
                    onChange={(e) => handleInputChange('shortBio', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Skills / Tags (Comma separated)</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="React, Java, Spring Boot, UI/UX, Cloud"
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                    Separate competencies with commas. They will automatically render as interactive badges.
                  </span>
                </div>
              </div>
            )}

            {/* TAB 5: SOCIAL HANDLES */}
            {activeTab === 'SOCIAL' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Social & Professional Profiles</label>
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

            {/* Bottom Form Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => handleInputChange('published', e.target.checked)}
                />
                <label htmlFor="published" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155', cursor: 'pointer' }}>
                  Make Card Publicly Accessible Immediately
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                <Save size={16} /> {loading ? 'Publishing...' : 'Publish Business Card'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Preview */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <LivePreview cardData={formData} />
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .builder-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default CreateCardPage;
