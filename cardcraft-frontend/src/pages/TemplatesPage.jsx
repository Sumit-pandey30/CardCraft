import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import CardRenderer from '../components/card/CardRenderer';
import { LayoutTemplate, ArrowRight, Check, Sparkles } from 'lucide-react';

export const TemplatesPage = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState('ALL');

  const templatesList = [
    {
      code: 'PROFESSIONAL',
      name: 'Professional Modern',
      category: 'Corporate & Executive',
      description: 'Sophisticated executive layout featuring high-contrast banner, clean credential badges, and structured contact points. Perfect for executives, consultants, and corporate leaders.',
      previewCard: {
        templateCode: 'PROFESSIONAL',
        fullName: 'Eleanor Vance',
        professionalTitle: 'Chief Strategy Officer & VP',
        companyOrInstitution: 'Horizon Global Capital',
        email: 'eleanor.vance@horizonglobal.com',
        phone: '+1 (555) 432-8901',
        location: 'New York, NY',
        shortBio: 'Leading enterprise transformation and strategic investments with 15+ years of cross-border executive leadership.',
        skills: 'Strategic Leadership, Mergers & Acquisitions, Board Advisory, Global Operations',
        websiteUrl: 'https://horizonglobal.com',
        primaryColor: '#7c3aed',
        secondaryColor: '#6366f1',
      },
    },
    {
      code: 'DEVELOPER',
      name: 'Developer Terminal',
      category: 'Software & Technology',
      description: 'Terminal-inspired code aesthetic featuring macOS window buttons, monospace typography, structured object properties, and interactive technology stack badges.',
      previewCard: {
        templateCode: 'DEVELOPER',
        fullName: 'Marcus Lin',
        professionalTitle: 'Senior Full Stack & Distributed Systems Engineer',
        companyOrInstitution: 'CloudScale Infrastructure',
        email: 'marcus@cloudscale.dev',
        phone: '+1 (555) 234-9876',
        location: 'Seattle, WA',
        shortBio: 'Building fault-tolerant distributed cloud microservices, reactive architectures, and open-source developer tooling.',
        skills: 'Java 21, Spring Boot, React, Kubernetes, Kafka, Go, GraphQL',
        websiteUrl: 'https://marcus.dev',
        primaryColor: '#10b981',
        backgroundColor: '#0f172a',
        textColor: '#f8fafc',
      },
    },
    {
      code: 'STUDENT',
      name: 'Academic Scholar',
      category: 'University & Academia',
      description: 'Vibrant academic ID card layout highlighting university affiliation, degree major, academic honors, verified scholar badge, and student research projects.',
      previewCard: {
        templateCode: 'STUDENT',
        fullName: 'Sophia Chen',
        professionalTitle: 'Computer Science & AI Researcher',
        companyOrInstitution: 'Stanford University (Class of 2026)',
        email: 'sophia.chen@stanford.edu',
        phone: '+1 (555) 876-5432',
        location: 'Palo Alto, CA',
        shortBio: 'Undergraduate researcher in multimodal vision-language models and reinforcement learning with human feedback.',
        skills: 'Deep Learning, PyTorch, Algorithms, Computer Vision, Python',
        websiteUrl: 'https://sophiachen.ai',
        primaryColor: '#3b82f6',
        secondaryColor: '#60a5fa',
      },
    },
    {
      code: 'FREELANCER',
      name: 'Creative Freelancer',
      category: 'Design & Independent Work',
      description: 'Showcase-driven layout featuring an active "Available for Hire" status pulse, service offerings grid, and direct inquiry CTA button.',
      previewCard: {
        templateCode: 'FREELANCER',
        fullName: 'Julian Hayes',
        professionalTitle: 'Independent Brand Designer & 3D Artist',
        companyOrInstitution: 'Hayes Creative Studio',
        email: 'hello@julianhayes.design',
        phone: '+1 (555) 345-6789',
        location: 'Austin, TX',
        shortBio: 'Crafting memorable visual identities, brand systems, and 3D product animations for visionary startups worldwide.',
        skills: 'Brand Identity, 3D Motion, Webflow, Figma, Creative Direction',
        websiteUrl: 'https://julianhayes.design',
        primaryColor: '#ec4899',
        secondaryColor: '#8b5cf6',
      },
    },
    {
      code: 'BUSINESS',
      name: 'Enterprise Business',
      category: 'Commerce & Institutions',
      description: 'Prestigious corporate identity card with gold and stone accents, Playfair serif typography, official verification badge, and structured headquarters contact points.',
      previewCard: {
        templateCode: 'BUSINESS',
        fullName: 'Arthur Sterling',
        professionalTitle: 'Managing Partner & Senior Counsel',
        companyOrInstitution: 'Sterling & Associates Advisory Group',
        email: 'arthur@sterlingadvisory.com',
        phone: '+1 (555) 901-2345',
        location: 'Chicago, IL',
        shortBio: 'Delivering commercial legal counsel, corporate restructuring guidance, and risk advisory for Fortune 500 enterprises.',
        skills: 'Commercial Litigation, Corporate Governance, Risk Advisory, Regulatory Compliance',
        websiteUrl: 'https://sterlingadvisory.com',
        primaryColor: '#d97706',
        textColor: '#1c1917',
      },
    },
  ];

  const handleUseTemplate = (code) => {
    navigate(`/cards/create?template=${code}`);
  };

  const filtered = selectedTemplate === 'ALL'
    ? templatesList
    : templatesList.filter((t) => t.code === selectedTemplate);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar />

      {/* Header */}
      <section style={{ padding: '3.5rem 1.5rem 2rem', textAlign: 'center', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ede9fe', color: '#7c3aed', padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.75rem' }}>
            <Sparkles size={14} /> Hand-Crafted Visual Templates
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em' }}>
            Explore CardCraft Templates
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#64748b', marginTop: '0.5rem', lineHeight: 1.6 }}>
            Choose from 5 professionally engineered templates. Fully customizable with colors, fonts, social links, and live preview.
          </p>

          {/* Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1.75rem', flexWrap: 'wrap' }}>
            {['ALL', 'PROFESSIONAL', 'DEVELOPER', 'STUDENT', 'FREELANCER', 'BUSINESS'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTemplate(t)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.825rem',
                  fontWeight: '700',
                  background: selectedTemplate === t ? '#7c3aed' : '#f1f5f9',
                  color: selectedTemplate === t ? '#ffffff' : '#64748b',
                  transition: 'all 0.15s ease',
                }}
              >
                {t === 'ALL' ? 'All Templates (5)' : t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Grid */}
      <section style={{ padding: '3rem 1.5rem 5rem', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2.5rem', alignItems: 'stretch' }}>
          {filtered.map((tmpl) => (
            <div
              key={tmpl.code}
              className="card-box"
              style={{
                borderRadius: '20px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#ffffff',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-purple">{tmpl.category}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={14} /> Ready to Use
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                  {tmpl.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {tmpl.description}
                </p>

                {/* Rendered Live Card Preview Box */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    padding: '1rem',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ width: '100%', maxWidth: '340px' }}>
                    <CardRenderer card={tmpl.previewCard} />
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleUseTemplate(tmpl.code)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem' }}
              >
                Use {tmpl.name} <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TemplatesPage;
