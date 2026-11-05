package com.cardcraft.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "card_themes")
public class CardTheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(name = "primary_color", nullable = false, length = 30)
    private String primaryColor;

    @Column(name = "secondary_color", nullable = false, length = 30)
    private String secondaryColor;

    @Column(name = "background_color", nullable = false, length = 30)
    private String backgroundColor;

    @Column(name = "text_color", nullable = false, length = 30)
    private String textColor;

    @Column(name = "accent_color", nullable = false, length = 30)
    private String accentColor;

    @Column(name = "font_family", nullable = false, length = 50)
    private String fontFamily = "Inter, sans-serif";

    @Column(name = "border_radius", nullable = false, length = 20)
    private String borderRadius = "1rem";

    @Column(name = "is_default", nullable = false)
    private boolean isDefault = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public CardTheme() {}

    public CardTheme(String name, String primaryColor, String secondaryColor, String backgroundColor, String textColor, String accentColor) {
        this.name = name;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.accentColor = accentColor;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPrimaryColor() { return primaryColor; }
    public void setPrimaryColor(String primaryColor) { this.primaryColor = primaryColor; }

    public String getSecondaryColor() { return secondaryColor; }
    public void setSecondaryColor(String secondaryColor) { this.secondaryColor = secondaryColor; }

    public String getBackgroundColor() { return backgroundColor; }
    public void setBackgroundColor(String backgroundColor) { this.backgroundColor = backgroundColor; }

    public String getTextColor() { return textColor; }
    public void setTextColor(String textColor) { this.textColor = textColor; }

    public String getAccentColor() { return accentColor; }
    public void setAccentColor(String accentColor) { this.accentColor = accentColor; }

    public String getFontFamily() { return fontFamily; }
    public void setFontFamily(String fontFamily) { this.fontFamily = fontFamily; }

    public String getBorderRadius() { return borderRadius; }
    public void setBorderRadius(String borderRadius) { this.borderRadius = borderRadius; }

    public boolean isDefault() { return isDefault; }
    public void setDefault(boolean aDefault) { isDefault = aDefault; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
