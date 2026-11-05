import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, Eye } from 'lucide-react';
import CardRenderer from './CardRenderer';

export const LivePreview = ({ cardData }) => {
  const [device, setDevice] = useState('mobile'); // 'mobile' | 'tablet' | 'desktop'

  const getWidth = () => {
    switch (device) {
      case 'desktop':
        return '480px';
      case 'tablet':
        return '420px';
      case 'mobile':
      default:
        return '360px';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Device Switcher Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '0.75rem 1rem',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>
          <Eye size={16} color="#7c3aed" /> Live Card Preview
        </div>

        <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: '600',
              background: device === 'mobile' ? '#ffffff' : 'transparent',
              color: device === 'mobile' ? '#7c3aed' : '#64748b',
              boxShadow: device === 'mobile' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Smartphone size={14} /> Mobile
          </button>
          <button
            type="button"
            onClick={() => setDevice('tablet')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: '600',
              background: device === 'tablet' ? '#ffffff' : 'transparent',
              color: device === 'tablet' ? '#7c3aed' : '#64748b',
              boxShadow: device === 'tablet' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Tablet size={14} /> Tablet
          </button>
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: '600',
              background: device === 'desktop' ? '#ffffff' : 'transparent',
              color: device === 'desktop' ? '#7c3aed' : '#64748b',
              boxShadow: device === 'desktop' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Monitor size={14} /> Desktop
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div
        style={{
          width: '100%',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '1rem',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ede9fe 100%)',
          borderRadius: '16px',
          border: '1px dashed #cbd5e1',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 200px)',
        }}
      >
        <div
          style={{
            width: getWidth(),
            transition: 'width 0.25s ease',
          }}
        >
          <CardRenderer card={cardData} />
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
