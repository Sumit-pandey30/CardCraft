import React from 'react';
import { GraduationCap, BookOpen, Mail, Phone, MapPin, Globe, Award } from 'lucide-react';
import { getSocialPlatformDetails } from '../../common/SocialIcon';

export const StudentTemplate = ({ card }) => {
  const primaryColor = card.primaryColor || '#3b82f6';
  const secondaryColor = card.secondaryColor || '#60a5fa';
  const textColor = card.textColor || '#1e293b';
  const backgroundColor = card.backgroundColor || '#ffffff';
  const fontFamily = card.fontFamily || 'Poppins, sans-serif';

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
        boxShadow: '0 15px 30px rgba(59, 130, 246, 0.12)',
        border: '1.5px solid #dbeafe',
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {/* Student Banner */}
      <div
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
          padding: '1.5rem',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '600' }}>
            <GraduationCap size={18} /> Student ID Card
          </div>
          <span style={{ background: 'rgba(255,255,255,0.25)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '700' }}>
            VERIFIED SCHOLAR
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              border: '3px solid #ffffff',
              backgroundColor: '#eff6ff',
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
              <GraduationCap size={32} color={primaryColor} />
            )}
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '700', lineHeight: 1.2 }}>
              {card.fullName || 'Student Name'}
            </h2>
            <div style={{ fontSize: '0.85rem', opacity: 0.95, marginTop: '2px' }}>
              {card.professionalTitle || 'Undergraduate Student'}
            </div>
            {card.companyOrInstitution && (
              <div style={{ fontSize: '0.8rem', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <BookOpen size={12} /> {card.companyOrInstitution}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ padding: '1.25rem' }}>
        {card.shortBio && (
          <div style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>
            {card.shortBio}
          </div>
        )}

        {/* Subjects / Skills */}
        {skillsList.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Award size={13} color={primaryColor} /> Coursework & Skills
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skillsList.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: '#eff6ff',
                    color: primaryColor,
                    border: '1px solid #bfdbfe',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact Strip */}
        <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1rem' }}>
          {card.email && (
            <a href={`mailto:${card.email}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: '#334155' }}>
              <Mail size={14} color={primaryColor} /> <span>{card.email}</span>
            </a>
          )}
          {card.phone && (
            <a href={`tel:${card.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: '#334155' }}>
              <Phone size={14} color={primaryColor} /> <span>{card.phone}</span>
            </a>
          )}
          {card.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: '#334155' }}>
              <MapPin size={14} color={primaryColor} /> <span>{card.location}</span>
            </div>
          )}
          {card.websiteUrl && (
            <a
              href={card.websiteUrl.startsWith('http') ? card.websiteUrl : `https://${card.websiteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: primaryColor, fontWeight: '500' }}
            >
              <Globe size={14} /> <span>{card.websiteUrl}</span>
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
                    gap: '5px',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    background: '#f1f5f9',
                    color: '#1e293b',
                    fontSize: '0.78rem',
                    fontWeight: '600',
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

export default StudentTemplate;
