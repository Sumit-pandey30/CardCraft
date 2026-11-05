import React, { useState } from 'react';
import { X, Copy, Check, QrCode, Download, Share2 } from 'lucide-react';
import api from '../../services/api';

export const ShareModal = ({ isOpen, onClose, card }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen || !card) return null;

  const publicUrl = `${window.location.origin}/c/${card.slug}`;
  const qrApiUrl = `/api/public/cards/${card.slug}/qr`;

  const recordShare = async (medium) => {
    try {
      await api.post(`/public/cards/${card.slug}/shares`, { shareMedium: medium });
    } catch (e) {
      // Non-blocking
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    recordShare('COPY_LINK');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsapp = () => {
    recordShare('WHATSAPP');
    const text = encodeURIComponent(`Check out my digital business card on CardCraft: ${publicUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareToLinkedIn = () => {
    recordShare('LINKEDIN');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`, '_blank');
  };

  const shareToTwitter = () => {
    recordShare('TWITTER');
    const text = encodeURIComponent(`Connect with me on CardCraft! Here is my smart digital business card: ${publicUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareByEmail = () => {
    recordShare('EMAIL');
    const subject = encodeURIComponent(`${card.fullName}'s Digital Business Card`);
    const body = encodeURIComponent(`Hi,\n\nHere is my digital business card:\n${publicUrl}\n\nBest regards,\n${card.fullName}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '1.25rem',
          maxWidth: '440px',
          width: '100%',
          padding: '1.75rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#ede9fe',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
            }}
          >
            <Share2 size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>
            Share Digital Business Card
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
            Share {card.fullName}'s card with clients, peers & colleagues
          </p>
        </div>

        {/* Copy Link Input */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
            Public Card URL
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              readOnly
              value={publicUrl}
              style={{
                flex: 1,
                padding: '0.625rem 0.85rem',
                border: '1.5px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: '#334155',
                background: '#f8fafc',
                outline: 'none',
              }}
            />
            <button
              onClick={copyToClipboard}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.625rem 1rem',
                background: copied ? '#10b981' : '#7c3aed',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.85rem',
                transition: 'all 0.2s',
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Share buttons grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '1.25rem' }}>
          <button
            onClick={shareToWhatsapp}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 4px',
              background: '#ecfdf5',
              color: '#059669',
              borderRadius: '10px',
              border: '1px solid #a7f3d0',
              fontSize: '0.75rem',
              fontWeight: '600',
            }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              W
            </div>
            WhatsApp
          </button>

          <button
            onClick={shareToLinkedIn}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 4px',
              background: '#eff6ff',
              color: '#1d4ed8',
              borderRadius: '10px',
              border: '1px solid #bfdbfe',
              fontSize: '0.75rem',
              fontWeight: '600',
            }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0a66c2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              in
            </div>
            LinkedIn
          </button>

          <button
            onClick={shareToTwitter}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 4px',
              background: '#f8fafc',
              color: '#0f172a',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              fontSize: '0.75rem',
              fontWeight: '600',
            }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              X
            </div>
            X (Twitter)
          </button>

          <button
            onClick={shareByEmail}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 4px',
              background: '#fef2f2',
              color: '#dc2626',
              borderRadius: '10px',
              border: '1px solid #fecaca',
              fontSize: '0.75rem',
              fontWeight: '600',
            }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ea4335', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              @
            </div>
            Email
          </button>
        </div>

        {/* QR Code Toggle */}
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', textAlign: 'center' }}>
          <button
            onClick={() => setShowQr(!showQr)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#7c3aed',
              fontWeight: '600',
              fontSize: '0.85rem',
            }}
          >
            <QrCode size={16} /> {showQr ? 'Hide QR Code' : 'Display QR Code to Scan'}
          </button>

          {showQr && (
            <div style={{ marginTop: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src={qrApiUrl}
                alt="QR Code"
                style={{ width: '160px', height: '160px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                Scan with any smartphone camera to open card instantly
              </p>
              <a
                href={qrApiUrl}
                download={`${card.slug}-qr.png`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#7c3aed',
                }}
              >
                <Download size={14} /> Download QR PNG
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
