package com.cardcraft.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "card_views")
public class CardView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "card_id", nullable = false)
    private BusinessCard card;

    @Column(name = "viewer_ip", length = 60)
    private String viewerIp;

    @Column(name = "user_agent", length = 300)
    private String userAgent;

    @Column(length = 300)
    private String referer;

    @Column(name = "device_type", length = 30)
    private String deviceType;

    @Column(length = 80)
    private String country;

    @Column(name = "viewed_at", nullable = false, updatable = false)
    private LocalDateTime viewedAt = LocalDateTime.now();

    public CardView() {}

    public CardView(BusinessCard card, String viewerIp, String userAgent, String referer, String deviceType) {
        this.card = card;
        this.viewerIp = viewerIp;
        this.userAgent = userAgent;
        this.referer = referer;
        this.deviceType = deviceType;
        this.viewedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (viewedAt == null) viewedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public BusinessCard getCard() { return card; }
    public void setCard(BusinessCard card) { this.card = card; }

    public String getViewerIp() { return viewerIp; }
    public void setViewerIp(String viewerIp) { this.viewerIp = viewerIp; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public String getReferer() { return referer; }
    public void setReferer(String referer) { this.referer = referer; }

    public String getDeviceType() { return deviceType; }
    public void setDeviceType(String deviceType) { this.deviceType = deviceType; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public LocalDateTime getViewedAt() { return viewedAt; }
    public void setViewedAt(LocalDateTime viewedAt) { this.viewedAt = viewedAt; }
}
