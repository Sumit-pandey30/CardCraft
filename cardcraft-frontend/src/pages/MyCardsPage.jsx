import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';
import ShareModal from '../components/card/ShareModal';
import {
  PlusCircle,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Share2,
  FileDown,
  QrCode,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Lock,
  BarChart2
} from 'lucide-react';

export const MyCardsPage = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PUBLISHED' | 'DRAFT'
  const [shareCard, setShareCard] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cards/all');
      setCards(res.data.data || []);
    } catch (e) {
      console.error('Failed to fetch cards', e);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (cardId) => {
    try {
      const res = await api.patch(`/cards/${cardId}/publish`);
      setCards(cards.map((c) => (c.id === cardId ? { ...c, published: res.data.data } : c)));
    } catch (e) {
      alert('Failed to update card status');
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await api.delete(`/cards/${cardId}`);
      setCards(cards.filter((c) => c.id !== cardId));
      setDeleteConfirmId(null);
    } catch (e) {
      alert('Failed to delete card');
    }
  };

  const copyCardLink = (card) => {
    const url = `${window.location.origin}/c/${card.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(card.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.title?.toLowerCase().includes(search.toLowerCase()) ||
      card.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      card.slug?.toLowerCase().includes(search.toLowerCase());

    if (statusFilter === 'PUBLISHED') return matchesSearch && card.published;
    if (statusFilter === 'DRAFT') return matchesSearch && !card.published;
    return matchesSearch;
  });

  return (
    <DashboardLayout
      title="My Digital Business Cards"
      subtitle="Create, manage, download and share all your personalized digital business cards."
      actions={
        <Link to="/cards/create" className="btn btn-primary btn-sm">
          <PlusCircle size={15} /> New Card
        </Link>
      }
    >
      {/* Search and Filters Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search cards by title or name..."
            style={{ paddingLeft: '2.5rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <div style={{ display: 'flex', gap: '8px', background: '#ffffff', padding: '4px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '600',
              background: statusFilter === 'ALL' ? '#7c3aed' : 'transparent',
              color: statusFilter === 'ALL' ? '#fff' : '#64748b',
            }}
          >
            All Cards ({cards.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('PUBLISHED')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '600',
              background: statusFilter === 'PUBLISHED' ? '#10b981' : 'transparent',
              color: statusFilter === 'PUBLISHED' ? '#fff' : '#64748b',
            }}
          >
            Live ({cards.filter((c) => c.published).length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('DRAFT')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '600',
              background: statusFilter === 'DRAFT' ? '#64748b' : 'transparent',
              color: statusFilter === 'DRAFT' ? '#fff' : '#64748b',
            }}
          >
            Drafts ({cards.filter((c) => !c.published).length})
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading your business cards...</div>
      ) : filteredCards.length === 0 ? (
        <div className="card-box" style={{ padding: '3.5rem 1rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>
            {search ? 'No matching cards found' : 'You haven’t created any business cards yet'}
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '420px', margin: '0.5rem auto 1.5rem' }}>
            {search ? 'Try clearing your search keyword or filter.' : 'Choose a template and build your customized digital card in minutes.'}
          </p>
          <Link to="/cards/create" className="btn btn-primary">
            <PlusCircle size={16} /> Create Business Card
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="card-box"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div>
                {/* Header status bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                    {card.templateName || card.templateCode}
                  </span>

                  <button
                    onClick={() => handleTogglePublish(card.id)}
                    title={card.published ? 'Click to unpublish (switch to draft)' : 'Click to publish live'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      background: card.published ? '#ecfdf5' : '#f1f5f9',
                      color: card.published ? '#059669' : '#64748b',
                      border: `1px solid ${card.published ? '#a7f3d0' : '#e2e8f0'}`,
                    }}
                  >
                    {card.published ? <Globe size={12} /> : <Lock size={12} />}
                    {card.published ? 'Published (Live)' : 'Draft (Private)'}
                  </button>
                </div>

                {/* Card Title & Full Name */}
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#7c3aed', marginBottom: '2px' }}>
                  {card.fullName}
                </p>
                {card.professionalTitle && (
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>
                    {card.professionalTitle} {card.companyOrInstitution ? `@ ${card.companyOrInstitution}` : ''}
                  </p>
                )}

                {/* Slug & Stats */}
                <div
                  style={{
                    background: '#f8fafc',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                  }}
                >
                  <span style={{ fontFamily: 'monospace' }}>/c/{card.slug}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', color: '#0f172a' }}>
                    <Eye size={13} color="#0284c7" /> {card.viewCount} views
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                  <button
                    onClick={() => copyCardLink(card)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                    title="Copy Public Link"
                  >
                    {copiedId === card.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    {copiedId === card.id ? 'Copied' : 'Copy Link'}
                  </button>

                  <button
                    onClick={() => setShareCard(card)}
                    className="btn btn-secondary btn-sm"
                    title="Share Card & QR"
                  >
                    <Share2 size={14} /> Share
                  </button>

                  <a
                    href={`/api/cards/${card.id}/pdf`}
                    download={`${card.slug}-card.pdf`}
                    className="btn btn-secondary btn-sm"
                    title="Download Card PDF"
                  >
                    <FileDown size={14} /> PDF
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <Link to={`/cards/${card.id}/edit`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    <Edit size={14} /> Edit
                  </Link>

                  <Link to={`/c/${card.slug}`} target="_blank" className="btn btn-primary btn-sm" title="Open Public Card">
                    <ExternalLink size={14} /> View
                  </Link>

                  <Link to={`/analytics?cardId=${card.id}`} className="btn btn-secondary btn-sm" title="View Card Analytics">
                    <BarChart2 size={14} />
                  </Link>

                  <button
                    onClick={() => setDeleteConfirmId(card.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#ef4444' }}
                    title="Delete Card"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Delete Confirmation Modal */}
              {deleteConfirmId === card.id && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '1.25rem',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    zIndex: 10,
                  }}
                >
                  <Trash2 size={36} color="#ef4444" style={{ marginBottom: '0.5rem' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>Delete "{card.title}"?</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 1rem' }}>
                    This card will no longer be accessible via its public link.
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="btn btn-secondary btn-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ShareModal
        isOpen={!!shareCard}
        onClose={() => setShareCard(null)}
        card={shareCard}
      />
    </DashboardLayout>
  );
};

export default MyCardsPage;
