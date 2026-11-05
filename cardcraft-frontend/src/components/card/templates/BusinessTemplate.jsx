import React from 'react';
import { Building2, Mail, Phone, MapPin, Globe, ShieldCheck, Calendar } from 'lucide-react';
import { getSocialPlatformDetails } from '../../common/SocialIcon';

export const BusinessTemplate = ({ card }) => {
  const primaryColor = card.primaryColor || '#d97706';
  const textColor = card.textColor || '#1c1917';
  const backgroundColor = card.backgroundColor || '#fefce8';
  const fontFamily = card.fontFamily || 'Playfair Display, serif';

  const skillsList = card.skills
    ? card.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div
      style={{
        fontFamily,
        backgroundColor: '#ffffff',
        color: textColor,
        borderRadius: '0.75rem',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
        border: `2px solid ${primaryColor}40`,
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {/* Gold/Navy Corporate Header */}
      <div
        style={{
          backgroundColor: '#1c1917',
          padding: '1.75rem 1.5rem',
          color: '#ffffff',
          borderBottom: `4px solid ${primaryColor}`,
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: primaryColor, fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <Building2 size={16} /> Enterprise Network
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#a8a29e' }}>
            <ShieldCheck size={14} color={primaryColor} /> Official Profile
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '8px',
              border: `2px solid ${primaryColor}`,
              backgroundColor: '#292524',
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {card.avatarUrl ? (
              <img
                src={card.avatarUrl}
                alt={card.fullName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <Building2 size={36} color={primaryColor} />
            )}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', lineHeight: 1.2, color: '#fafaf9' }}>
              {card.fullName || 'Executive Name'}
            </h2>
            <div style={{ fontSize: '0.95rem', color: primaryColor, fontWeight: '600', marginTop: '2px', fontFamily: 'Inter, sans-serif' }}>
              {card.professionalTitle || 'Managing Director'}
            </div>
            {card.companyOrInstitution && (
              <div style={{ fontSize: '0.85rem', color: '#d6d3d1', marginTop: '2px', fontFamily: 'Inter, sans-serif' }}>
                {card.companyOrInstitution}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div style={{ padding: '1.5rem', fontFamily: 'Inter, sans-serif' }}>
        {card.shortBio && (
          <p style={{ fontSize: '0.875rem', color: '#44403c', lineHeight: 1.6, marginBottom: '1.25rem', borderLeft: `3px solid ${primaryColor}`, paddingLeft: '0.75rem' }}>
            {card.shortBio}
          </p>
        )}

        {/* Corporate Contact Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '1.25rem' }}>
          {card.email && (
            <a
              href={`mailto:${card.email}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '10px',
                background: '#fafaf9',
                borderRadius: '8px',
                border: '1px solid #e7e5e4',
                fontSize: '0.8rem',
                color: '#292524',
              }}
            >
              <span style={{ fontSize: '0.7rem', color: '#78716c', fontWeight: '600', textTransform: 'uppercase' }}>Email</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>{card.email}</span>
            </a>
          )}
          {card.phone && (
            <a
              href={`tel:${card.phone}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '10px',
                background: '#fafaf9',
                borderRadius: '8px',
                border: '1px solid #e7e5e4',
                fontSize: '0.8rem',
                color: '#292524',
              }}
            >
              <span style={{ fontSize: '0.7rem', color: '#78716c', fontWeight: '600', textTransform: 'uppercase' }}>Phone</span>
              <span style={{ fontWeight: '500' }}>{card.phone}</span>
            </a>
          )}
          {card.location && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '10px',
                background: '#fafaf9',
                borderRadius: '8px',
                border: '1px solid #e7e5e4',
                fontSize: '0.8rem',
                color: '#292524',
              }}
            >
              <span style={{ fontSize: '0.7rem', color: '#78716c', fontWeight: '600', textTransform: 'uppercase' }}>Location</span>
              <span style={{ fontWeight: '500' }}>{card.location}</span>
            </div>
          )}
          {card.websiteUrl && (
            <a
              href={card.websiteUrl.startsWith('http') ? card.websiteUrl : `https://${card.websiteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '10px',
                background: '#fafaf9',
                borderRadius: '8px',
                border: '1px solid #e7e5e4',
                fontSize: '0.8rem',
                color: primaryColor,
              }}
            >
              <span style={{ fontSize: '0.7rem', color: '#78716c', fontWeight: '600', textTransform: 'uppercase' }}>Website</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '600' }}>{card.websiteUrl}</span>
            </a>
          )}
        </div>

        {/* Corporate Focus */}
        {skillsList.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#78716c', letterSpacing: '0.05em', marginBottom: '6px' }}>
              Corporate Focus & Domains
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skillsList.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    background: '#f5f5f4',
                    color: '#292524',
                    border: '1px solid #d6d3d1',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social / Direct Connect */}
        {card.socialLinks && card.socialLinks.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {card.socialLinks.map((link, idx) => {
              const details = getSocialPlatformDetails(link.platform);
              const IconComponent = details.icon;
              return (
                <a
                  key={idx}
                  href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    background: '#1c1917',
                    color: '#fafaf9',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                  }}
                >
                  <IconComponent size={14} color={primaryColor} />
                  <span>{link.label || details.name}</span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessTemplate;
