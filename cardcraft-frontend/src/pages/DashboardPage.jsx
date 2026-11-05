import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ShareModal from '../components/card/ShareModal';
import {
  CreditCard,
  Eye,
  Share2,
  MessageSquare,
  PlusCircle,
  ExternalLink,
  Edit,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareCard, setShareCard] = useState(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics/overview');
      setOverview(res.data.data);
    } catch (e) {
      console.error('Failed to load overview analytics', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title={`Hello, ${user?.fullName?.split(' ')[0] || 'Creator'}! 👋`}
      subtitle="Here is an overview of your digital business cards and viewer engagement."
    >
      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Total Cards */}
        <div className="card-box" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>Total Cards</span>
            <div style={{ padding: '8px', background: '#ede9fe', borderRadius: '8px', color: '#7c3aed' }}>
              <CreditCard size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
            {loading ? '...' : overview?.totalCards || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <TrendingUp size={14} /> Active & ready to share
          </div>
        </div>

        {/* Total Views */}
        <div className="card-box" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>Profile Views</span>
            <div style={{ padding: '8px', background: '#e0f2fe', borderRadius: '8px', color: '#0284c7' }}>
              <Eye size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
            {loading ? '...' : overview?.totalViews || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Across all digital cards
          </div>
        </div>

        {/* Total Shares */}
        <div className="card-box" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>Card Shares</span>
            <div style={{ padding: '8px', background: '#ecfdf5', borderRadius: '8px', color: '#059669' }}>
              <Share2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
            {loading ? '...' : overview?.totalShares || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Via WhatsApp, QR & link
          </div>
        </div>

        {/* Unread Messages */}
        <div className="card-box" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>Inquiries / Leads</span>
            <div style={{ padding: '8px', background: '#fdf2f8', borderRadius: '8px', color: '#ec4899' }}>
              <MessageSquare size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a' }}>
            {loading ? '...' : overview?.unreadMessages || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Direct visitor messages
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
          borderRadius: '16px',
          padding: '1.75rem',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-purple)',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            <Sparkles size={13} /> Quick Action
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Need another digital business card?</h3>
          <p style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '2px' }}>
            Create separate cards for your developer profile, freelancing gigs, academic credentials, or business projects.
          </p>
        </div>
        <Link
          to="/cards/create"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ffffff',
            color: '#7c3aed',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '0.9rem',
          }}
        >
          <PlusCircle size={16} /> Create New Card
        </Link>
      </div>

      {/* Recent Cards Section */}
      <div className="card-box" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>Your Recent Cards</h3>
            <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Manage, edit and view your latest created cards</p>
          </div>
          <Link to="/cards" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View all cards <ArrowUpRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading cards...</div>
        ) : !overview?.recentCards || overview.recentCards.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CreditCard size={28} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>No business cards yet</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '380px', margin: '0.5rem auto 1.5rem' }}>
              Create your first digital business card in less than 2 minutes and start sharing your professional profile.
            </p>
            <Link to="/cards/create" className="btn btn-primary">
              <PlusCircle size={16} /> Create Your First Card
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {overview.recentCards.map((card) => (
              <div
                key={card.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'box-shadow 0.2s',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span className="badge badge-purple">{card.templateName || card.templateCode}</span>
                    <span className={`badge ${card.published ? 'badge-green' : 'badge-gray'}`}>
                      {card.published ? 'Live' : 'Draft'}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>
                    {card.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', fontWeight: '500', color: '#64748b', marginBottom: '0.75rem' }}>
                    {card.fullName} {card.professionalTitle ? `• ${card.professionalTitle}` : ''}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: '#94a3b8' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={13} /> {card.viewCount} views
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} /> /c/{card.slug}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  <Link to={`/cards/${card.id}/edit`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    <Edit size={14} /> Edit
                  </Link>
                  <button
                    onClick={() => setShareCard(card)}
                    className="btn btn-secondary btn-sm"
                    title="Share Card"
                  >
                    <Share2 size={14} />
                  </button>
                  <Link
                    to={`/c/${card.slug}`}
                    target="_blank"
                    className="btn btn-primary btn-sm"
                    title="Open Public Card"
                  >
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ShareModal
        isOpen={!!shareCard}
        onClose={() => setShareCard(null)}
        card={shareCard}
      />
    </DashboardLayout>
  );
};

export default DashboardPage;
