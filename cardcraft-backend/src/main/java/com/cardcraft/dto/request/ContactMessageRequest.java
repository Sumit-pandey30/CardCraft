package com.cardcraft.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ContactMessageRequest {

    @NotBlank(message = "Your name is required")
    @Size(max = 100)
    private String senderName;

    @NotBlank(message = "Your email is required")
    @Email(message = "Please enter a valid email")
    @Size(max = 150)
    private String senderEmail;

    @Size(max = 30)
    private String senderPhone;

    @Size(max = 200)
    private String subject;

    @NotBlank(message = "Message text is required")
    @Size(min = 5, max = 2000, message = "Message must be between 5 and 2000 characters")
    private String message;

    public ContactMessageRequest() {}

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
}
