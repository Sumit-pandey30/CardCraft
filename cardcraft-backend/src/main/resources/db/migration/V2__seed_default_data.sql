-- Default Templates
INSERT INTO templates (code, display_name, description, preview_image_url, layout_config, is_active)
VALUES
('PROFESSIONAL', 'Professional Modern', 'Sleek executive layout with refined typography, company badge, and structured contact info.', '/templates/professional.png', '{"badge": "Corporate", "style": "classic"}', TRUE),
('DEVELOPER', 'Developer Terminal', 'Code-inspired layout highlighting GitHub stats, technology stack, and interactive developer badges.', '/templates/developer.png', '{"badge": "Tech", "style": "terminal"}', TRUE),
('STUDENT', 'Academic Scholar', 'Fresh vibrant layout with university credentials, coursework tags, projects, and academic contact.', '/templates/student.png', '{"badge": "Education", "style": "modern"}', TRUE),
('FREELANCER', 'Creative Freelancer', 'Portfolio-focused design highlighting freelance services, client testimonials, and direct hire CTA.', '/templates/freelancer.png', '{"badge": "Creative", "style": "minimal"}', TRUE),
('BUSINESS', 'Enterprise Business', 'Polished corporate branding with office location, meeting scheduler link, and company portfolio.', '/templates/business.png', '{"badge": "Enterprise", "style": "bold"}', TRUE);

-- Default Card Themes
INSERT INTO card_themes (name, primary_color, secondary_color, background_color, text_color, accent_color, font_family, border_radius, is_default)
VALUES
('Royal Purple', '#7c3aed', '#6d28d9', '#ffffff', '#0f172a', '#a855f7', 'Inter, sans-serif', '1rem', TRUE),
('Cyber Emerald', '#10b981', '#059669', '#0f172a', '#f8fafc', '#34d399', 'JetBrains Mono, monospace', '0.75rem', FALSE),
('Midnight Slate', '#3b82f6', '#2563eb', '#090d16', '#f1f5f9', '#60a5fa', 'Inter, sans-serif', '1.25rem', FALSE),
('Sunset Coral', '#f43f5e', '#e11d48', '#ffffff', '#1e293b', '#fb7185', 'Poppins, sans-serif', '1rem', FALSE),
('Executive Gold', '#d97706', '#b45309', '#fbfbfb', '#1c1917', '#f59e0b', 'Playfair Display, serif', '0.5rem', FALSE),
('Clean Minimal', '#475569', '#334155', '#f8fafc', '#0f172a', '#64748b', 'Inter, sans-serif', '0.75rem', FALSE);
