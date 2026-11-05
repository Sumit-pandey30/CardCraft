import React from 'react';
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Mail,
  Phone,
  MessageSquare,
  Facebook,
  Share2,
  ExternalLink,
  Code
} from 'lucide-react';

export const getSocialPlatformDetails = (platform = '') => {
  const p = platform.toUpperCase().trim();
  switch (p) {
    case 'GITHUB':
      return { name: 'GitHub', icon: Github, color: '#24292e', bg: '#f6f8fa' };
    case 'LINKEDIN':
      return { name: 'LinkedIn', icon: Linkedin, color: '#0a66c2', bg: '#e8f4f9' };
    case 'TWITTER':
    case 'X':
      return { name: 'X / Twitter', icon: Twitter, color: '#1da1f2', bg: '#e8f5fd' };
    case 'INSTAGRAM':
      return { name: 'Instagram', icon: Instagram, color: '#e4405f', bg: '#fdf0f3' };
    case 'YOUTUBE':
      return { name: 'YouTube', icon: Youtube, color: '#ff0000', bg: '#ffe5e5' };
    case 'WEBSITE':
    case 'PORTFOLIO':
      return { name: 'Website', icon: Globe, color: '#6366f1', bg: '#eef2ff' };
    case 'EMAIL':
      return { name: 'Email', icon: Mail, color: '#ea4335', bg: '#fef2f2' };
    case 'PHONE':
      return { name: 'Phone', icon: Phone, color: '#10b981', bg: '#ecfdf5' };
    case 'DISCORD':
      return { name: 'Discord', icon: MessageSquare, color: '#5865f2', bg: '#eef0fd' };
    case 'FACEBOOK':
      return { name: 'Facebook', icon: Facebook, color: '#1877f2', bg: '#ebf4ff' };
    default:
      return { name: platform || 'Link', icon: ExternalLink, color: '#64748b', bg: '#f1f5f9' };
  }
};

export const SocialIcon = ({ platform, size = 18, className = '' }) => {
  const { icon: Icon } = getSocialPlatformDetails(platform);
  return <Icon size={size} className={className} />;
};

export default SocialIcon;
