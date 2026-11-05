import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CardRenderer from '../components/card/CardRenderer';
import ShareModal from '../components/card/ShareModal';
import ContactModal from '../components/card/ContactModal';
import api from '../services/api';
import {
  Download,
  Share2,
  MessageSquare,
  FileDown,
  Sparkles,
  AlertTriangle,
  QrCode
} from 'lucide-react';

export const PublicCardPage = () => {
  const { slug } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareOpen, setShareOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    fetchPublicCard();
  }, [slug]);

  const fetchPublicCard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/public/cards/${slug}`);
      setCard(res.data.data);

      // Record page view asynchronously
      api.post(`/public/cards/${slug}/views`).catch(() => {});
    } catch (err) {
      if (err.response?.status === 404) {
        setError('This digital business card is either private or does not exist.');
      } else {
        setError('Unable to load this card at the moment.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadVCard = () => {
    window.location.href = `/api/public/cards/${slug}/vcard`;
  };

  const handleDownloadPdf = () => {
    window.location.href = `/api/public/cards/${slug}/pdf`;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #ede9fe', borderTop: '3px solid #7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading digital card...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '1.5rem' }}>
        <div className="card-box" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem 1.75rem', textAlign: 'center' }}>
          <AlertTriangle size={48} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>Card Unavailable</h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.5rem 0 1.5rem', lineHeight: 1.5 }}>
            {error || 'This card is currently not available.'}
          </p>
          <Link to="/" className="btn btn-primary">
            Explore CardCraft
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem 4rem',
      }}
    >
      {/* Centered Digital Card */}
      <div style={{ width: '100%', maxWidth: '440px', marginBottom: '1.5rem' }}>
        <CardRenderer card={card} onContactClick={() => setContactOpen(true)} />
      </div>

      {/* Floating Action Strip */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '0.85rem 1.25rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={handleDownloadVCard}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: '#7c3aed',
            fontSize: '0.72rem',
            fontWeight: '700',
            padding: '6px 2px',
            borderRadius: '8px',
          }}
          title="Save contact to your phone's address book"
        >
          <Download size={18} />
          <span>Save Contact</span>
        </button>

        <button
          onClick={handleDownloadPdf}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: '#334155',
            fontSize: '0.72rem',
            fontWeight: '700',
            padding: '6px 2px',
            borderRadius: '8px',
          }}
          title="Download printable high-resolution PDF card"
        >
          <FileDown size={18} />
          <span>Card PDF</span>
        </button>

        <button
          onClick={() => setContactOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: '#334155',
            fontSize: '0.72rem',
            fontWeight: '700',
            padding: '6px 2px',
            borderRadius: '8px',
          }}
          title="Send a direct message"
        >
          <MessageSquare size={18} />
          <span>Message</span>
        </button>

        <button
          onClick={() => setShareOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: '#334155',
            fontSize: '0.72rem',
            fontWeight: '700',
            padding: '6px 2px',
            borderRadius: '8px',
          }}
          title="Share card & QR"
        >
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>

      {/* Powered by CardCraft footer pill */}
      <Link
        to="/"
        target="_blank"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          background: '#ffffff',
          borderRadius: '999px',
          border: '1px solid #e2e8f0',
          fontSize: '0.75rem',
          fontWeight: '600',
          color: '#64748b',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Sparkles size={13} color="#7c3aed" /> Built with <strong style={{ color: '#0f172a' }}>CardCraft</strong>
      </Link>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        card={card}
      />

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        card={card}
      />
    </div>
  );
};

export default PublicCardPage;
