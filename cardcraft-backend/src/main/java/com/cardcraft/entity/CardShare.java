package com.cardcraft.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "card_shares")
public class CardShare {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "card_id", nullable = false)
    private BusinessCard card;

    @Column(name = "share_medium", nullable = false, length = 50)
    private String shareMedium;

    @Column(name = "shared_at", nullable = false, updatable = false)
    private LocalDateTime sharedAt = LocalDateTime.now();

    public CardShare() {}

    public CardShare(BusinessCard card, String shareMedium) {
        this.card = card;
        this.shareMedium = shareMedium;
        this.sharedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (sharedAt == null) sharedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public BusinessCard getCard() { return card; }
    public void setCard(BusinessCard card) { this.card = card; }

    public String getShareMedium() { return shareMedium; }
    public void setShareMedium(String shareMedium) { this.shareMedium = shareMedium; }

    public LocalDateTime getSharedAt() { return sharedAt; }
    public void setSharedAt(LocalDateTime sharedAt) { this.sharedAt = sharedAt; }
}
