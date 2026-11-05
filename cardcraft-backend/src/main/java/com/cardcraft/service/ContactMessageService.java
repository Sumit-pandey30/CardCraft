package com.cardcraft.service;

import com.cardcraft.dto.request.ContactMessageRequest;
import com.cardcraft.dto.response.ContactMessageResponse;
import com.cardcraft.entity.BusinessCard;
import com.cardcraft.entity.ContactMessage;
import com.cardcraft.exception.ResourceNotFoundException;
import com.cardcraft.repository.BusinessCardRepository;
import com.cardcraft.repository.ContactMessageRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ContactMessageService {

    private final ContactMessageRepository messageRepository;
    private final BusinessCardRepository cardRepository;

    public ContactMessageService(ContactMessageRepository messageRepository,
                                 BusinessCardRepository cardRepository) {
        this.messageRepository = messageRepository;
        this.cardRepository = cardRepository;
    }

    @Transactional
    public ContactMessageResponse sendContactMessage(String slug, ContactMessageRequest request) {
        BusinessCard card = cardRepository.findBySlugAndPublishedTrueAndActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found with slug: " + slug));

        ContactMessage msg = new ContactMessage(
                card,
                request.getSenderName().trim(),
                request.getSenderEmail().trim(),
                request.getSenderPhone(),
                request.getSubject(),
                request.getMessage().trim()
        );

        ContactMessage saved = messageRepository.save(msg);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<ContactMessageResponse> getMessagesForCard(Long cardId, Long userId, Pageable pageable) {
        cardRepository.findByIdAndUserIdAndActiveTrue(cardId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found or access denied"));

        return messageRepository.findByCardIdOrderBySentAtDesc(cardId, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public List<ContactMessageResponse> getAllMessagesForUser(Long userId) {
        return messageRepository.findByCardUserIdOrderBySentAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public void markAsRead(Long messageId, Long userId) {
        ContactMessage msg = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));

        if (!msg.getCard().getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Access denied");
        }

        msg.setRead(true);
        messageRepository.save(msg);
    }

    private ContactMessageResponse mapToResponse(ContactMessage m) {
        ContactMessageResponse r = new ContactMessageResponse();
        r.setId(m.getId());
        r.setCardId(m.getCard().getId());
        r.setCardTitle(m.getCard().getTitle());
        r.setCardSlug(m.getCard().getSlug());
        r.setSenderName(m.getSenderName());
        r.setSenderEmail(m.getSenderEmail());
        r.setSenderPhone(m.getSenderPhone());
        r.setSubject(m.getSubject());
        r.setMessage(m.getMessage());
        r.setRead(m.isRead());
        r.setSentAt(m.getSentAt());
        return r;
    }
}
