import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';
import {
  BarChart3,
  Eye,
  Share2,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Mail,
  Calendar,
  CheckCircle,
  MessageSquare
} from 'lucide-react';

export const AnalyticsPage = () => {
  const [searchParams] = useSearchParams();
  const cardIdParam = searchParams.get('cardId');

  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(cardIdParam || '');
  const [analytics, setAnalytics] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCardsList();
  }, []);

  useEffect(() => {
    if (selectedCardId) {
      fetchCardAnalytics(selectedCardId);
    }
  }, [selectedCardId]);

  const fetchCardsList = async () => {
    try {
      const res = await api.get('/cards/all');
      const list = res.data.data || [];
      setCards(list);
      if (list.length > 0 && !selectedCardId) {
        setSelectedCardId(list[0].id);
      }
    } catch (e) {
      console.error('Failed to fetch cards list', e);
    }
  };

  const fetchCardAnalytics = async (cardId) => {
    try {
      setLoading(true);
      const [aRes, mRes] = await Promise.all([
        api.get(`/cards/${cardId}/analytics`),
        api.get(`/cards/${cardId}/messages`),
      ]);
      setAnalytics(aRes.data.data);
      setMessages(mRes.data.data?.content || []);
    } catch (e) {
      console.error('Failed to load card analytics', e);
    } finally {
      setLoading(false);
    }
  };

  const markMessageRead = async (msgId) => {
    try {
      await api.patch(`/users/me/messages/${msgId}/read`);
      setMessages(messages.map((m) => (m.id === msgId ? { ...m, read: true } : m)));
    } catch (e) {
      console.error('Failed to mark message read', e);
    }
  };

  return (
    <DashboardLayout
      title="Analytics & Engagement"
      subtitle="Comprehensive metrics, traffic sources, visitor device breakdown, and incoming lead messages."
    >
      {/* Card Selector Header */}
      <div
        className="card-box"
        style={{
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
            Select Card to Analyze
          </label>
          <div style={{ marginTop: '4px' }}>
            <select
              value={selectedCardId}
              onChange={(e) => setSelectedCardId(e.target.value)}
              className="form-control"
              style={{ width: '280px', fontWeight: '600' }}
            >
              {cards.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} (/c/{c.slug})
                </option>
              ))}
            </select>
          </div>
        </div>

        {analytics && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ background: '#f8fafc', padding: '8px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Views</span>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>{analytics.totalViews}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '8px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Shares</span>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>{analytics.totalShares}</div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading metrics...</div>
      ) : !analytics ? (
        <div className="card-box" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          Select or create a business card to view analytics.
        </div>
      ) : (
        <>
          {/* Timeline and Charts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '1.5rem', marginBottom: '2rem' }} className="analytics-grid">
            {/* View Timeline Chart */}
            <div className="card-box" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                14-Day View History
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.5rem' }}>
                Daily page views tracked on your public digital card
              </p>

              {/* Bar visualization */}
              <div style={{ display: 'flex', alignItems: 'flex-end', height: '180px', gap: '8px', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                {analytics.viewsTimeline?.map((point, idx) => {
                  const maxViews = Math.max(...analytics.viewsTimeline.map((p) => p.views || 0), 1);
                  const heightPercent = Math.max(((point.views || 0) / maxViews) * 100, 6);
                  return (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#7c3aed', marginBottom: '4px' }}>
                        {point.views > 0 ? point.views : ''}
                      </span>
                      <div
                        style={{
                          width: '100%',
                          height: `${heightPercent}%`,
                          background: point.views > 0 ? 'linear-gradient(180deg, #7c3aed 0%, #6366f1 100%)' : '#e2e8f0',
                          borderRadius: '6px 6px 0 0',
                          transition: 'height 0.3s ease',
                        }}
                        title={`${point.date}: ${point.views} views`}
                      />
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        {point.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Device Breakdown */}
            <div className="card-box" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                Device Breakdown
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.5rem' }}>
                What devices visitors used to scan or view your card
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { key: 'MOBILE', label: 'Mobile Smartphones', icon: Smartphone, color: '#10b981' },
                  { key: 'DESKTOP', label: 'Desktop Computers', icon: Monitor, color: '#3b82f6' },
                  { key: 'TABLET', label: 'Tablets / iPads', icon: Tablet, color: '#f59e0b' },
                ].map((d) => {
                  const Icon = d.icon;
                  const count = analytics.deviceBreakdown?.[d.key] || 0;
                  const total = analytics.totalViews || 1;
                  const percent = Math.round((count / total) * 100);
                  return (
                    <div key={d.key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#334155' }}>
                          <Icon size={16} color={d.color} /> {d.label}
                        </span>
                        <span style={{ fontWeight: '700', color: '#0f172a' }}>{count} ({percent}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, height: '100%', background: d.color, borderRadius: '4px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lead Messages Inbox */}
          <div className="card-box" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
                  Received Contact Messages
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
                  Inquiries and leads submitted by visitors viewing this digital card
                </p>
              </div>
              <span className="badge badge-purple">{messages.length} messages</span>
            </div>

            {messages.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                No messages received yet on this card.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      background: msg.read ? '#ffffff' : '#f5f3ff',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>{msg.senderName}</span>
                          {!msg.read && (
                            <span style={{ background: '#7c3aed', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                              NEW
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                          <a href={`mailto:${msg.senderEmail}`} style={{ color: '#7c3aed' }}>{msg.senderEmail}</a>
                          {msg.senderPhone ? ` • ${msg.senderPhone}` : ''}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {new Date(msg.sentAt).toLocaleString()}
                        </span>
                        {!msg.read && (
                          <button
                            onClick={() => markMessageRead(msg.id)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>

                    {msg.subject && (
                      <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>
                        Subject: {msg.subject}
                      </p>
                    )}

                    <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 900px) {
          .analytics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
