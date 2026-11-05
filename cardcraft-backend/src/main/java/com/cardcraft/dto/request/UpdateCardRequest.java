package com.cardcraft.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

public class UpdateCardRequest {

    @NotBlank(message = "Template code is required")
    private String templateCode;

    private Long themeId;

    @NotBlank(message = "Slug is required")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "Slug must contain only lowercase letters, numbers, and hyphens")
    @Size(min = 3, max = 100, message = "Slug must be between 3 and 100 characters")
    private String slug;

    @NotBlank(message = "Card title is required")
    @Size(max = 150)
    private String title;

    @NotBlank(message = "Full name is required")
    @Size(max = 120)
    private String fullName;

    @Size(max = 150)
    private String professionalTitle;

    @Size(max = 150)
    private String companyOrInstitution;

    @Size(max = 150)
    private String email;

    @Size(max = 30)
    private String phone;

    @Size(max = 150)
    private String location;

    @Size(max = 2000)
    private String shortBio;

    @Size(max = 2000)
    private String skills;

    @Size(max = 500)
    private String avatarUrl;

    @Size(max = 500)
    private String bannerUrl;

    @Size(max = 255)
    private String websiteUrl;

    private String primaryColor;
    private String secondaryColor;
    private String backgroundColor;
    private String textColor;
    private String fontFamily;

    private boolean published = true;
    private boolean active = true;

    @Valid
    private List<SocialLinkDto> socialLinks = new ArrayList<>();

    public UpdateCardRequest() {}

    public String getTemplateCode() { return templateCode; }
    public void setTemplateCode(String templateCode) { this.templateCode = templateCode; }

    public Long getThemeId() { return themeId; }
    public void setThemeId(Long themeId) { this.themeId = themeId; }

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

    public List<SocialLinkDto> getSocialLinks() { return socialLinks; }
    public void setSocialLinks(List<SocialLinkDto> socialLinks) { this.socialLinks = socialLinks; }
}
