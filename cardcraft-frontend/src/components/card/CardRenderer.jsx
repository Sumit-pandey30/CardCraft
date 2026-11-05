import React from 'react';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import DeveloperTemplate from './templates/DeveloperTemplate';
import StudentTemplate from './templates/StudentTemplate';
import FreelancerTemplate from './templates/FreelancerTemplate';
import BusinessTemplate from './templates/BusinessTemplate';

export const CardRenderer = ({ card, onContactClick }) => {
  if (!card) return null;

  const templateCode = (
    card.template?.code ||
    card.templateCode ||
    'PROFESSIONAL'
  ).toUpperCase();

  switch (templateCode) {
    case 'DEVELOPER':
      return <DeveloperTemplate card={card} onContactClick={onContactClick} />;
    case 'STUDENT':
      return <StudentTemplate card={card} onContactClick={onContactClick} />;
    case 'FREELANCER':
      return <FreelancerTemplate card={card} onContactClick={onContactClick} />;
    case 'BUSINESS':
      return <BusinessTemplate card={card} onContactClick={onContactClick} />;
    case 'PROFESSIONAL':
    default:
      return <ProfessionalTemplate card={card} onContactClick={onContactClick} />;
  }
};

export default CardRenderer;
