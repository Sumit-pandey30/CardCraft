package com.cardcraft.dto.response;

import java.time.LocalDateTime;

public class ContactMessageResponse {

    private Long id;
    private Long cardId;
    private String cardTitle;
    private String cardSlug;
    private String senderName;
    private String senderEmail;
    private String senderPhone;
    private String subject;
    private String message;
    private boolean read;
    private LocalDateTime sentAt;

    public ContactMessageResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCardId() { return cardId; }
    public void setCardId(Long cardId) { this.cardId = cardId; }

    public String getCardTitle() { return cardTitle; }
    public void setCardTitle(String cardTitle) { this.cardTitle = cardTitle; }

    public String getCardSlug() { return cardSlug; }
    public void setCardSlug(String cardSlug) { this.cardSlug = cardSlug; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getSenderEmail() { return senderEmail; }
    public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }

    public String getSenderPhone() { return senderPhone; }
    public void setSenderPhone(String senderPhone) { this.senderPhone = senderPhone; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}
