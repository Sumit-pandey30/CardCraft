package com.cardcraft.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "business_cards")
public class BusinessCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "template_id", nullable = false)
    private Template template;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "theme_id")
    private CardTheme theme;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;

    @Column(name = "professional_title", length = 150)
    private String professionalTitle;

    @Column(name = "company_or_institution", length = 150)
    private String companyOrInstitution;

    @Column(length = 150)
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(length = 150)
    private String location;

    @Column(name = "short_bio", columnDefinition = "TEXT")
    private String shortBio;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "banner_url", length = 500)
    private String bannerUrl;

    @Column(name = "website_url", length = 255)
    private String websiteUrl;

    @Column(name = "primary_color", length = 30)
    private String primaryColor;

    @Column(name = "secondary_color", length = 30)
    private String secondaryColor;

    @Column(name = "background_color", length = 30)
    private String backgroundColor;

    @Column(name = "text_color", length = 30)
    private String textColor;

    @Column(name = "font_family", length = 50)
    private String fontFamily;

    @Column(name = "is_published", nullable = false)
    private boolean published = true;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "qr_code_url", length = 500)
    private String qrCodeUrl;

    @Column(name = "view_count", nullable = false)
    private Long viewCount = 0L;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "card", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    private List<SocialLink> socialLinks = new ArrayList<>();

    @OneToMany(mappedBy = "card", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CardView> cardViews = new ArrayList<>();

    @OneToMany(mappedBy = "card", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CardShare> cardShares = new ArrayList<>();

    @OneToMany(mappedBy = "card", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ContactMessage> contactMessages = new ArrayList<>();

    public BusinessCard() {}

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (viewCount == null) viewCount = 0L;
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Convenience helper
    public void addSocialLink(SocialLink link) {
        socialLinks.add(link);
        link.setCard(this);
    }

    public void removeSocialLink(SocialLink link) {
        socialLinks.remove(link);
        link.setCard(null);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Template getTemplate() { return template; }
    public void setTemplate(Template template) { this.template = template; }

    public CardTheme getTheme() { return theme; }
    public void setTheme(CardTheme theme) { this.theme = theme; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getProfessionalTitle() { return professionalTitle; }
    public void setProfessionalTitle(String professionalTitle) { this.professionalTitle = professionalTitle; }

    public String getCompanyOrInstitution() { return companyOrInstitution; }
    public void setCompanyOrInstitution(String companyOrInstitution) { this.companyOrInstitution = companyOrInstitution; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getShortBio() { return shortBio; }
    public void setShortBio(String shortBio) { this.shortBio = shortBio; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }

    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }

    public String getPrimaryColor() { return primaryColor; }
    public void setPrimaryColor(String primaryColor) { this.primaryColor = primaryColor; }

    public String getSecondaryColor() { return secondaryColor; }
    public void setSecondaryColor(String secondaryColor) { this.secondaryColor = secondaryColor; }

    public String getBackgroundColor() { return backgroundColor; }
    public void setBackgroundColor(String backgroundColor) { this.backgroundColor = backgroundColor; }

    public String getTextColor() { return textColor; }
    public void setTextColor(String textColor) { this.textColor = textColor; }

    public String getFontFamily() { return fontFamily; }
    public void setFontFamily(String fontFamily) { this.fontFamily = fontFamily; }

    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public String getQrCodeUrl() { return qrCodeUrl; }
    public void setQrCodeUrl(String qrCodeUrl) { this.qrCodeUrl = qrCodeUrl; }

    public Long getViewCount() { return viewCount; }
    public void setViewCount(Long viewCount) { this.viewCount = viewCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<SocialLink> getSocialLinks() { return socialLinks; }
    public void setSocialLinks(List<SocialLink> socialLinks) { this.socialLinks = socialLinks; }

    public List<CardView> getCardViews() { return cardViews; }
    public void setCardViews(List<CardView> cardViews) { this.cardViews = cardViews; }

    public List<CardShare> getCardShares() { return cardShares; }
    public void setCardShares(List<CardShare> cardShares) { this.cardShares = cardShares; }

    public List<ContactMessage> getContactMessages() { return contactMessages; }
    public void setContactMessages(List<ContactMessage> contactMessages) { this.contactMessages = contactMessages; }
}
