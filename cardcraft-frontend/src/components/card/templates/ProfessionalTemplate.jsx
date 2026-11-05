import React from 'react';
import { Mail, Phone, MapPin, Globe, Briefcase, Building } from 'lucide-react';
import { getSocialPlatformDetails } from '../../common/SocialIcon';

export const ProfessionalTemplate = ({ card }) => {
  const primaryColor = card.primaryColor || '#7c3aed';
  const secondaryColor = card.secondaryColor || '#6366f1';
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
        borderRadius: '1.25rem',
        overflow: 'hidden',
        boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.12)',
        border: '1px solid #e2e8f0',
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {/* Top Banner */}
      <div
        style={{
          height: '130px',
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(8px)',
            color: '#ffffff',
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: '600',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Executive
        </div>
      </div>

      {/* Avatar & Main Info */}
      <div style={{ padding: '0 1.5rem 1.5rem', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-45px', marginBottom: '1rem' }}>
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              border: '4px solid #ffffff',
              boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
              backgroundColor: '#f1f5f9',
              overflow: 'hidden',
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
              <span style={{ fontSize: '2rem', fontWeight: '700', color: primaryColor }}>
                {card.fullName ? card.fullName.charAt(0).toUpperCase() : 'C'}
              </span>
            )}
          </div>
        </div>

        <h2 style={{ fontSize: '1.45rem', fontWeight: '800', lineHeight: 1.2, color: textColor }}>
          {card.fullName || 'Your Full Name'}
        </h2>

        {card.professionalTitle && (
          <p style={{ fontSize: '0.95rem', fontWeight: '600', color: primaryColor, marginTop: '2px' }}>
            {card.professionalTitle}
          </p>
        )}

        {card.companyOrInstitution && (
          <p style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <Building size={14} /> {card.companyOrInstitution}
          </p>
        )}

        {/* Short Bio */}
        {card.shortBio && (
          <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginTop: '0.85rem' }}>
            {card.shortBio}
          </p>
        )}

        {/* Contact info list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '1.25rem', padding: '0.85rem', background: '#f8fafc', borderRadius: '0.75rem' }}>
          {card.email && (
            <a
              href={`mailto:${card.email}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155' }}
            >
              <div style={{ padding: '6px', background: '#ffffff', borderRadius: '6px', color: primaryColor, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Mail size={15} />
              </div>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.email}</span>
            </a>
          )}
          {card.phone && (
            <a
              href={`tel:${card.phone}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155' }}
            >
              <div style={{ padding: '6px', background: '#ffffff', borderRadius: '6px', color: primaryColor, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Phone size={15} />
              </div>
              <span>{card.phone}</span>
            </a>
          )}
          {card.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155' }}>
              <div style={{ padding: '6px', background: '#ffffff', borderRadius: '6px', color: primaryColor, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <MapPin size={15} />
              </div>
              <span>{card.location}</span>
            </div>
          )}
          {card.websiteUrl && (
            <a
              href={card.websiteUrl.startsWith('http') ? card.websiteUrl : `https://${card.websiteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: primaryColor, fontWeight: '500' }}
            >
              <div style={{ padding: '6px', background: '#ffffff', borderRadius: '6px', color: primaryColor, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Globe size={15} />
              </div>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.websiteUrl}</span>
            </a>
          )}
        </div>

        {/* Skills */}
        {skillsList.length > 0 && (
          <div style={{ marginTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '0.5rem' }}>
              Core Competencies
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skillsList.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: `${primaryColor}15`,
                    color: primaryColor,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {card.socialLinks && card.socialLinks.length > 0 && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
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
                    title={link.label || details.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: details.bg,
                      color: details.color,
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      transition: 'transform 0.15s ease',
                      border: '1px solid rgba(0,0,0,0.05)'
                    }}
                  >
                    <IconComponent size={15} />
                    <span>{link.label || details.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
