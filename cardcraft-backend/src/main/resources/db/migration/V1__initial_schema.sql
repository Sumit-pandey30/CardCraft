-- CardCraft Initial Schema: 9 mandatory tables
-- Engine: InnoDB, Charset: utf8mb4

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    avatar_url VARCHAR(500) NULL,
    phone VARCHAR(30) NULL,
    bio TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Templates Table
CREATE TABLE IF NOT EXISTS templates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    preview_image_url VARCHAR(500) NULL,
    layout_config TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_templates_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Card Themes Table
CREATE TABLE IF NOT EXISTS card_themes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    primary_color VARCHAR(30) NOT NULL,
    secondary_color VARCHAR(30) NOT NULL,
    background_color VARCHAR(30) NOT NULL,
    text_color VARCHAR(30) NOT NULL,
    accent_color VARCHAR(30) NOT NULL,
    font_family VARCHAR(50) NOT NULL DEFAULT 'Inter, sans-serif',
    border_radius VARCHAR(20) NOT NULL DEFAULT '1rem',
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Business Cards Table
CREATE TABLE IF NOT EXISTS business_cards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    template_id BIGINT NOT NULL,
    theme_id BIGINT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    professional_title VARCHAR(150) NULL,
    company_or_institution VARCHAR(150) NULL,
    email VARCHAR(150) NULL,
    phone VARCHAR(30) NULL,
    location VARCHAR(150) NULL,
    short_bio TEXT NULL,
    skills TEXT NULL,
    avatar_url VARCHAR(500) NULL,
    banner_url VARCHAR(500) NULL,
    website_url VARCHAR(255) NULL,
    primary_color VARCHAR(30) NULL,
    secondary_color VARCHAR(30) NULL,
    background_color VARCHAR(30) NULL,
    text_color VARCHAR(30) NULL,
    font_family VARCHAR(50) NULL,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    qr_code_url VARCHAR(500) NULL,
    view_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cards_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cards_template FOREIGN KEY (template_id) REFERENCES templates(id),
    CONSTRAINT fk_cards_theme FOREIGN KEY (theme_id) REFERENCES card_themes(id) ON DELETE SET NULL,
    INDEX idx_cards_user (user_id),
    INDEX idx_cards_slug (slug),
    INDEX idx_cards_status (is_published, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Social Links Table
CREATE TABLE IF NOT EXISTS social_links (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    card_id BIGINT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    url VARCHAR(500) NOT NULL,
    label VARCHAR(100) NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_social_links_card FOREIGN KEY (card_id) REFERENCES business_cards(id) ON DELETE CASCADE,
    INDEX idx_social_links_card (card_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Card Views Table
CREATE TABLE IF NOT EXISTS card_views (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    card_id BIGINT NOT NULL,
    viewer_ip VARCHAR(60) NULL,
    user_agent VARCHAR(300) NULL,
    referer VARCHAR(300) NULL,
    device_type VARCHAR(30) NULL,
    country VARCHAR(80) NULL,
    viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_card_views_card FOREIGN KEY (card_id) REFERENCES business_cards(id) ON DELETE CASCADE,
    INDEX idx_card_views_card (card_id),
    INDEX idx_card_views_time (viewed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Card Shares Table
CREATE TABLE IF NOT EXISTS card_shares (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    card_id BIGINT NOT NULL,
    share_medium VARCHAR(50) NOT NULL,
    shared_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_card_shares_card FOREIGN KEY (card_id) REFERENCES business_cards(id) ON DELETE CASCADE,
    INDEX idx_card_shares_card (card_id),
    INDEX idx_card_shares_time (shared_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    refresh_token_hash VARCHAR(255) NOT NULL,
    user_agent VARCHAR(300) NULL,
    ip_address VARCHAR(60) NULL,
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_sessions_user (user_id),
    INDEX idx_user_sessions_token (refresh_token_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    card_id BIGINT NOT NULL,
    sender_name VARCHAR(100) NOT NULL,
    sender_email VARCHAR(150) NOT NULL,
    sender_phone VARCHAR(30) NULL,
    subject VARCHAR(200) NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contact_messages_card FOREIGN KEY (card_id) REFERENCES business_cards(id) ON DELETE CASCADE,
    INDEX idx_contact_messages_card (card_id),
    INDEX idx_contact_messages_time (sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
