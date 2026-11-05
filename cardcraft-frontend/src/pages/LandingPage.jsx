import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import CardRenderer from '../components/card/CardRenderer';
import {
  Sparkles,
  QrCode,
  FileDown,
  BarChart3,
  Share2,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle,
  LayoutTemplate,
  MessageSquare
} from 'lucide-react';

export const LandingPage = () => {
  const [activeTemplate, setActiveTemplate] = useState('PROFESSIONAL');

  const demoCard = {
    templateCode: activeTemplate,
    fullName: 'Alex Morgan',
    professionalTitle: 'Principal Product Designer & Tech Lead',
    companyOrInstitution: 'Apex Innovations Studio',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 789-2345',
    location: 'San Francisco, CA',
    shortBio: 'Designing high-impact human experiences and scalable design systems for next-gen digital products.',
    skills: 'UI/UX Design, React, Figma, Design Systems, TypeScript, Product Strategy',
    websiteUrl: 'https://alexdesign.io',
    primaryColor: activeTemplate === 'DEVELOPER' ? '#10b981' : activeTemplate === 'FREELANCER' ? '#ec4899' : activeTemplate === 'BUSINESS' ? '#d97706' : activeTemplate === 'STUDENT' ? '#3b82f6' : '#7c3aed',
    socialLinks: [
      { platform: 'LINKEDIN', url: 'https://linkedin.com', label: 'LinkedIn' },
      { platform: 'GITHUB', url: 'https://github.com', label: 'GitHub' },
      { platform: 'TWITTER', url: 'https://x.com', label: 'Twitter' },
    ],
  };

  const features = [
    {
      icon: LayoutTemplate,
      title: '5 Distinctive Templates',
      desc: 'Crafted for Professionals, Developers, Freelancers, Students, and Business owners with full design flexibility.',
    },
    {
      icon: QrCode,
      title: 'Dynamic QR Codes',
      desc: 'Instantly generated vector QR codes that let anyone scan with their smartphone camera to open your card.',
    },
    {
      icon: FileDown,
      title: 'PDF & vCard Export',
      desc: 'Download high-resolution print-ready PDF business cards or export a .vcf contact to save straight to phone contacts.',
    },
    {
      icon: BarChart3,
      title: 'Live Visitor Analytics',
      desc: 'Track profile visits, device breakdown, top referral sources, and share statistics in real time.',
    },
    {
      icon: MessageSquare,
      title: 'Direct Lead Capture',
      desc: 'Allow potential clients and employers to send you inquiries directly from your public card profile.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Always Live',
      desc: 'BCrypt encrypted security, private dashboard access, custom slugs, and fast global cloud delivery.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          padding: '4rem 1.5rem 5rem',
          background: 'radial-gradient(ellipse at top, #f5f3ff 0%, #ffffff 70%)',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3.5rem', alignItems: 'center' }} className="hero-grid">
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ede9fe',
                color: '#7c3aed',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.825rem',
                fontWeight: '700',
                marginBottom: '1.25rem',
              }}
            >
              <Sparkles size={16} /> Next-Generation Digital Networking
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                fontWeight: '900',
                letterSpacing: '-0.03em',
                lineHeight: 1.12,
                color: '#0f172a',
                marginBottom: '1.25rem',
              }}
            >
              Your Professional Identity, <span className="gradient-text">Digitally Perfected.</span>
            </h1>

            <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '560px' }}>
              Create, customize, and share smart digital business cards in seconds. Connect with QR codes, download PDF cards, and track visits with built-in analytics.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Your Card Free <ArrowRight size={18} />
              </Link>
              <Link to="/templates" className="btn btn-secondary btn-lg">
                Explore Templates
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} color="#10b981" /> Free Forever Plan
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} color="#10b981" /> No App Download Needed
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} color="#10b981" /> Real-time Live Preview
              </span>
            </div>
          </div>

          {/* Hero Live Preview Demo */}
          <div id="demo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Template Switcher Pills */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                background: '#ffffff',
                padding: '4px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {['PROFESSIONAL', 'DEVELOPER', 'STUDENT', 'FREELANCER', 'BUSINESS'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveTemplate(t)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    background: activeTemplate === t ? '#7c3aed' : 'transparent',
                    color: activeTemplate === t ? '#ffffff' : '#64748b',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            <div style={{ width: '100%', maxWidth: '380px' }}>
              <CardRenderer card={demoCard} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '5rem 1.5rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#0f172a' }}>
              Engineered for Modern Professionals
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748b', marginTop: '0.75rem', lineHeight: 1.6 }}>
              Ditch paper cards that end up in the trash. CardCraft gives you an interactive, shareable, and verifiable digital presence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="card-box"
                  style={{
                    padding: '2rem',
                    borderRadius: '16px',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: '#ede9fe',
                      color: '#7c3aed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3 Step Walkthrough */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '3rem' }}>
            Create Your Card in 3 Simple Steps
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', margin: '0 auto 1rem' }}>
                1
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Choose Your Template</h4>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Select from 5 purpose-built templates matching your professional domain and style.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', margin: '0 auto 1rem' }}>
                2
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Add Info & Themes</h4>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Add your photo, biography, contact endpoints, skills, and social handles with live preview.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', margin: '0 auto 1rem' }}>
                3
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Share & Get Leads</h4>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Share your unique public URL, show your QR code, export PDF, and receive contact messages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', color: '#ffffff', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Ready to upgrade your networking?
          </h2>
          <p style={{ fontSize: '1.15rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '2rem' }}>
            Join thousands of professionals, developers, and creators crafting modern digital business cards on CardCraft.
          </p>
          <Link
            to="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.85rem 2rem',
              background: '#ffffff',
              color: '#7c3aed',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '1rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }}
          >
            Start Building Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '3rem 1.5rem', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/logo.svg" alt="CardCraft" style={{ width: '28px', height: '28px' }} />
            <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff' }}>
              Card<span style={{ color: '#a855f7' }}>Craft</span>
            </span>
          </div>
          <div style={{ fontSize: '0.875rem' }}>
            &copy; {new Date().getFullYear()} CardCraft. Smart Digital Business Card Builder. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
            <Link to="/templates" style={{ color: '#cbd5e1' }}>Templates</Link>
            <Link to="/login" style={{ color: '#cbd5e1' }}>Sign In</Link>
            <Link to="/register" style={{ color: '#cbd5e1' }}>Sign Up</Link>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            text-align: center;
          }
          .hero-grid > div:first-child {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
