import React from 'react';
import { Terminal, Github, Globe, Mail, Phone, MapPin, Code2, Cpu } from 'lucide-react';
import { getSocialPlatformDetails } from '../../common/SocialIcon';

export const DeveloperTemplate = ({ card }) => {
  const primaryColor = card.primaryColor || '#10b981';
  const backgroundColor = card.backgroundColor || '#0f172a';
  const textColor = card.textColor || '#f8fafc';
  const fontFamily = card.fontFamily || 'JetBrains Mono, monospace';

  const skillsList = card.skills
    ? card.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div
      style={{
        fontFamily,
        backgroundColor,
        color: textColor,
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.45)',
        border: '1px solid #334155',
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {/* Terminal Titlebar */}
      <div
        style={{
          backgroundColor: '#1e293b',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #334155',
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></div>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></div>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Terminal size={12} color={primaryColor} /> ~/cardcraft/{card.slug || 'developer'}.sh
        </div>
        <div style={{ fontSize: '0.7rem', color: primaryColor, fontWeight: '700' }}>v1.0</div>
      </div>

      {/* Terminal Body */}
      <div style={{ padding: '1.5rem' }}>
        {/* Profile Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '12px',
              border: `2px solid ${primaryColor}`,
              backgroundColor: '#1e293b',
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
              <Code2 size={32} color={primaryColor} />
            )}
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>class Developer &#123;</div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.02em' }}>
              {card.fullName || 'Developer Name'}
            </h2>
            <div style={{ fontSize: '0.85rem', color: primaryColor, fontWeight: '600' }}>
              &gt; {card.professionalTitle || 'Software Engineer'}
            </div>
            {card.companyOrInstitution && (
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                @ {card.companyOrInstitution}
              </div>
            )}
          </div>
        </div>

        {/* Short Bio in Code comment style */}
        {card.shortBio && (
          <div
            style={{
              backgroundColor: '#1e293b',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.825rem',
              color: '#cbd5e1',
              borderLeft: `3px solid ${primaryColor}`,
              marginBottom: '1.25rem',
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: '#64748b' }}>// About</span>
            <div>{card.shortBio}</div>
          </div>
        )}

        {/* Tech Stack */}
        {skillsList.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Cpu size={12} color={primaryColor} /> const stack = [
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingLeft: '8px' }}>
              {skillsList.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.75rem',
                    background: '#1e293b',
                    color: '#38bdf8',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid #334155',
                  }}
                >
                  "{skill}"
                </span>
              ))}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>];</div>
          </div>
        )}

        {/* Contact endpoints */}
        <div style={{ backgroundColor: '#131f37', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '6px' }}>// Contact Endpoints</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {card.email && (
              <a href={`mailto:${card.email}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
                <Mail size={13} color={primaryColor} /> <span>{card.email}</span>
              </a>
            )}
            {card.phone && (
              <a href={`tel:${card.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
                <Phone size={13} color={primaryColor} /> <span>{card.phone}</span>
              </a>
            )}
            {card.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
                <MapPin size={13} color={primaryColor} /> <span>{card.location}</span>
              </div>
            )}
            {card.websiteUrl && (
              <a
                href={card.websiteUrl.startsWith('http') ? card.websiteUrl : `https://${card.websiteUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#38bdf8' }}
              >
                <Globe size={13} color="#38bdf8" /> <span>{card.websiteUrl}</span>
              </a>
            )}
          </div>
        </div>

        {/* Social / Git Repos */}
        {card.socialLinks && card.socialLinks.length > 0 && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
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
                      padding: '5px 10px',
                      borderRadius: '6px',
                      background: '#1e293b',
                      color: '#f8fafc',
                      fontSize: '0.75rem',
                      border: '1px solid #334155',
                    }}
                  >
                    <IconComponent size={13} color={primaryColor} />
                    <span>{link.label || details.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '1rem' }}>&#125; // EOF</div>
      </div>
    </div>
  );
};

export default DeveloperTemplate;
