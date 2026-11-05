import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import LivePreview from '../components/card/LivePreview';
import api from '../services/api';
import ShareModal from '../components/card/ShareModal';
import { Edit, Share2, FileDown, ExternalLink, QrCode } from 'lucide-react';

export const CardPreviewPage = () => {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    fetchCard();
  }, [id]);

  const fetchCard = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/cards/${id}`);
      setCard(res.data.data);
    } catch (e) {
      console.error('Error fetching card', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Live Card Preview">
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          Loading card preview...
        </div>
      </DashboardLayout>
    );
  }

  if (!card) {
    return (
      <DashboardLayout title="Card Not Found">
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <p>The requested business card was not found.</p>
          <Link to="/cards" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to My Cards</Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`Preview: ${card.title}`}
      subtitle={`Slug: /c/${card.slug} • ${card.published ? 'Live on web' : 'Draft mode'}`}
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/cards/${card.id}/edit`} className="btn btn-secondary btn-sm">
            <Edit size={14} /> Edit
          </Link>
          <button onClick={() => setShareOpen(true)} className="btn btn-secondary btn-sm">
            <Share2 size={14} /> Share
          </button>
          <a
            href={`/api/cards/${card.id}/pdf`}
            download={`${card.slug}-card.pdf`}
            className="btn btn-secondary btn-sm"
          >
            <FileDown size={14} /> PDF
          </a>
          <a
            href={`/c/${card.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            <ExternalLink size={14} /> Open Live Page
          </a>
        </div>
      }
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <LivePreview cardData={card} />
      </div>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        card={card}
      />
    </DashboardLayout>
  );
};

export default CardPreviewPage;
