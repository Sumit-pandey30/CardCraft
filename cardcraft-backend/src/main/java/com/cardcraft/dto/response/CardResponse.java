package com.cardcraft.dto.response;

import com.cardcraft.dto.request.SocialLinkDto;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CardResponse {

    private Long id;
    private String slug;
    private String title;
    private String fullName;
    private String professionalTitle;
    private String companyOrInstitution;
    private String email;
    private String phone;
    private String location;
    private String shortBio;
    private String skills;
    private String avatarUrl;
    private String bannerUrl;
    private String websiteUrl;

    private String primaryColor;
    private String secondaryColor;
    private String backgroundColor;
    private String textColor;
    private String fontFamily;

    private boolean published;
    private boolean active;
    private String qrCodeUrl;
    private Long viewCount;

    private TemplateResponse template;
    private CardThemeResponse theme;
    private List<SocialLinkDto> socialLinks = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CardResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public TemplateResponse getTemplate() { return template; }
    public void setTemplate(TemplateResponse template) { this.template = template; }

    public CardThemeResponse getTheme() { return theme; }
    public void setTheme(CardThemeResponse theme) { this.theme = theme; }

    public List<SocialLinkDto> getSocialLinks() { return socialLinks; }
    public void setSocialLinks(List<SocialLinkDto> socialLinks) { this.socialLinks = socialLinks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
