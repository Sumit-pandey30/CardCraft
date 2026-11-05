import React from 'react';
import { Sparkles, Mail, Phone, MapPin, Globe, CheckCircle2, ArrowRight } from 'lucide-react';
import { getSocialPlatformDetails } from '../../common/SocialIcon';

export const FreelancerTemplate = ({ card, onContactClick }) => {
  const primaryColor = card.primaryColor || '#ec4899';
  const secondaryColor = card.secondaryColor || '#8b5cf6';
  const textColor = card.textColor || '#0f172a';
  const backgroundColor = card.backgroundColor || '#ffffff';
  const fontFamily = card.fontFamily || 'Inter, sans-serif';

  const skillsList = card.skills
    ? card.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div
      style={{
        fontFamily,
        backgroundColor,
        color: textColor,
        borderRadius: '1.5rem',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -15px rgba(236, 72, 153, 0.2)',
        border: '1px solid #fce7f3',
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {/* Dynamic Creative Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
          padding: '2rem 1.5rem 1.5rem',
          color: '#ffffff',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Availability Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(8px)',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: '600',
            marginBottom: '1rem',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}></span>
          Available for Freelance & Contracts
        </div>

        {/* Centered Avatar */}
        <div
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            border: '4px solid #ffffff',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
            margin: '0 auto 0.75rem',
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
            <Sparkles size={36} color={primaryColor} />
          )}
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          {card.fullName || 'Freelancer Name'}
        </h2>
        <div style={{ fontSize: '0.95rem', fontWeight: '500', opacity: 0.95, marginTop: '2px' }}>
          {card.professionalTitle || 'Independent Creative Professional'}
        </div>
        {card.companyOrInstitution && (
          <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '2px' }}>
            {card.companyOrInstitution}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '1.5rem' }}>
        {card.shortBio && (
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, textAlign: 'center', marginBottom: '1.25rem' }}>
            "{card.shortBio}"
          </p>
        )}

        {/* Services & Skills */}
        {skillsList.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', textAlign: 'center', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
              Specialties & Services
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {skillsList.map((skill, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    color: '#334155',
                    background: '#fdf2f8',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontWeight: '500',
                  }}
                >
                  <CheckCircle2 size={14} color={primaryColor} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
          {card.email && (
            <a href={`mailto:${card.email}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155' }}>
              <Mail size={15} color={primaryColor} /> <span>{card.email}</span>
            </a>
          )}
          {card.phone && (
            <a href={`tel:${card.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155' }}>
              <Phone size={15} color={primaryColor} /> <span>{card.phone}</span>
            </a>
          )}
          {card.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155' }}>
              <MapPin size={15} color={primaryColor} /> <span>{card.location}</span>
            </div>
          )}
          {card.websiteUrl && (
            <a
              href={card.websiteUrl.startsWith('http') ? card.websiteUrl : `https://${card.websiteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: primaryColor, fontWeight: '600' }}
            >
              <Globe size={15} /> <span>{card.websiteUrl}</span>
            </a>
          )}
        </div>

        {/* Social Links */}
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
                    borderRadius: '999px',
                    background: details.bg,
                    color: details.color,
                    fontSize: '0.8rem',
                    fontWeight: '600',
                  }}
                >
                  <IconComponent size={14} />
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

export default FreelancerTemplate;
