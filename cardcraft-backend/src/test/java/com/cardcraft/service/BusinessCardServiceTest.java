package com.cardcraft.service;

import com.cardcraft.dto.request.CreateCardRequest;
import com.cardcraft.dto.request.UpdateCardRequest;
import com.cardcraft.dto.response.CardResponse;
import com.cardcraft.entity.BusinessCard;
import com.cardcraft.entity.Template;
import com.cardcraft.entity.User;
import com.cardcraft.exception.BadRequestException;
import com.cardcraft.exception.ResourceNotFoundException;
import com.cardcraft.repository.BusinessCardRepository;
import com.cardcraft.repository.CardThemeRepository;
import com.cardcraft.repository.SocialLinkRepository;
import com.cardcraft.repository.TemplateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BusinessCardServiceTest {

    @Mock
    private BusinessCardRepository cardRepository;

    @Mock
    private TemplateRepository templateRepository;

    @Mock
    private CardThemeRepository themeRepository;

    @Mock
    private SocialLinkRepository socialLinkRepository;

    @Mock
    private UserService userService;

    @Mock
    private TemplateService templateService;

    @InjectMocks
    private BusinessCardService cardService;

    private User sampleUser;
    private Template sampleTemplate;
    private BusinessCard sampleCard;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(10L);
        sampleUser.setFullName("Alice Smith");
        sampleUser.setEmail("alice@example.com");

        sampleTemplate = new Template("PROFESSIONAL", "Professional Modern", "Desc", "/img.png");
        sampleTemplate.setId(1L);

        sampleCard = new BusinessCard();
        sampleCard.setId(100L);
        sampleCard.setUser(sampleUser);
        sampleCard.setTemplate(sampleTemplate);
        sampleCard.setSlug("alice-card");
        sampleCard.setTitle("Alice Work Card");
        sampleCard.setFullName("Alice Smith");
        sampleCard.setProfessionalTitle("Lead Software Architect");
        sampleCard.setPublished(true);
        sampleCard.setActive(true);
        sampleCard.setViewCount(5L);
    }

    @Test
    @DisplayName("Should successfully create a business card with unique slug")
    void testCreateCardSuccess() {
        CreateCardRequest request = new CreateCardRequest();
        request.setSlug("alice-card");
        request.setTitle("Alice Work Card");
        request.setFullName("Alice Smith");
        request.setTemplateCode("PROFESSIONAL");

        when(userService.getUserEntity(10L)).thenReturn(sampleUser);
        when(cardRepository.existsBySlug("alice-card")).thenReturn(false);
        when(templateRepository.findByCode("PROFESSIONAL")).thenReturn(Optional.of(sampleTemplate));
        when(cardRepository.save(any(BusinessCard.class))).thenReturn(sampleCard);

        CardResponse response = cardService.createCard(10L, request);

        assertNotNull(response);
        assertEquals("alice-card", response.getSlug());
        assertEquals("Alice Work Card", response.getTitle());
        verify(cardRepository, atLeastOnce()).save(any(BusinessCard.class));
    }

    @Test
    @DisplayName("Should reject card creation if slug is already taken")
    void testCreateCardDuplicateSlug() {
        CreateCardRequest request = new CreateCardRequest();
        request.setSlug("alice-card");
        request.setTitle("Duplicate Card");
        request.setFullName("Alice Smith");

        when(userService.getUserEntity(10L)).thenReturn(sampleUser);
        when(cardRepository.existsBySlug("alice-card")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> cardService.createCard(10L, request));
        verify(cardRepository, never()).save(any(BusinessCard.class));
    }

    @Test
    @DisplayName("Should prevent a user from accessing or updating another user's card")
    void testUserOwnershipAuthorization() {
        UpdateCardRequest request = new UpdateCardRequest();
        request.setSlug("alice-card-update");
        request.setTitle("Hacked Title");
        request.setFullName("Alice");
        request.setTemplateCode("PROFESSIONAL");

        // User 99 attempts to update card owned by user 10
        when(cardRepository.findByIdAndUserIdAndActiveTrue(100L, 99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                cardService.updateCard(100L, 99L, request)
        );

        verify(cardRepository, never()).save(any(BusinessCard.class));
    }

    @Test
    @DisplayName("Should allow public access only to published and active cards")
    void testPublicCardAccess() {
        when(cardRepository.findBySlugAndPublishedTrueAndActiveTrue("alice-card"))
                .thenReturn(Optional.of(sampleCard));

        CardResponse response = cardService.getPublicCardBySlug("alice-card");
        assertNotNull(response);
        assertEquals("alice-card", response.getSlug());

        when(cardRepository.findBySlugAndPublishedTrueAndActiveTrue("unpublished-card"))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                cardService.getPublicCardBySlug("unpublished-card")
        );
    }

    @Test
    @DisplayName("Should toggle card publish status between true and false")
    void testTogglePublish() {
        when(cardRepository.findByIdAndUserIdAndActiveTrue(100L, 10L)).thenReturn(Optional.of(sampleCard));
        when(cardRepository.save(any(BusinessCard.class))).thenReturn(sampleCard);

        boolean nowPublished = cardService.togglePublish(100L, 10L);
        assertFalse(nowPublished); // was true, now false

        nowPublished = cardService.togglePublish(100L, 10L);
        assertTrue(nowPublished); // was false, now true
    }
}
