package com.cardcraft.service;

import com.cardcraft.dto.request.CreateCardRequest;
import com.cardcraft.dto.request.SocialLinkDto;
import com.cardcraft.dto.request.UpdateCardRequest;
import com.cardcraft.dto.response.CardResponse;
import com.cardcraft.dto.response.CardSummaryResponse;
import com.cardcraft.entity.BusinessCard;
import com.cardcraft.entity.CardTheme;
import com.cardcraft.entity.SocialLink;
import com.cardcraft.entity.Template;
import com.cardcraft.entity.User;
import com.cardcraft.exception.BadRequestException;
import com.cardcraft.exception.ResourceNotFoundException;
import com.cardcraft.repository.BusinessCardRepository;
import com.cardcraft.repository.CardThemeRepository;
import com.cardcraft.repository.SocialLinkRepository;
import com.cardcraft.repository.TemplateRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class BusinessCardService {

    private final BusinessCardRepository cardRepository;
    private final TemplateRepository templateRepository;
    private final CardThemeRepository themeRepository;
    private final SocialLinkRepository socialLinkRepository;
    private final UserService userService;
    private final TemplateService templateService;

    @Value("${cardcraft.app.base-url:http://localhost:5173}")
    private String appBaseUrl;

    public BusinessCardService(BusinessCardRepository cardRepository,
                               TemplateRepository templateRepository,
                               CardThemeRepository themeRepository,
                               SocialLinkRepository socialLinkRepository,
                               UserService userService,
                               TemplateService templateService) {
        this.cardRepository = cardRepository;
        this.templateRepository = templateRepository;
        this.themeRepository = themeRepository;
        this.socialLinkRepository = socialLinkRepository;
        this.userService = userService;
        this.templateService = templateService;
    }

    @Transactional(readOnly = true)
    public Page<CardSummaryResponse> getUserCards(Long userId, Pageable pageable) {
        return cardRepository.findByUserIdAndActiveTrue(userId, pageable)
                .map(this::mapToSummaryResponse);
    }

    @Transactional(readOnly = true)
    public List<CardSummaryResponse> getAllUserCards(Long userId) {
        return cardRepository.findByUserIdAndActiveTrueOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToSummaryResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CardResponse getCardById(Long cardId, Long userId) {
        BusinessCard card = cardRepository.findByIdAndUserIdAndActiveTrue(cardId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found or access denied"));
        return mapToCardResponse(card);
    }

    @Transactional(readOnly = true)
    public BusinessCard getCardEntity(Long cardId, Long userId) {
        return cardRepository.findByIdAndUserIdAndActiveTrue(cardId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found or access denied"));
    }

    @Transactional(readOnly = true)
    public BusinessCard getPublicCardEntityBySlug(String slug) {
        return cardRepository.findBySlugAndPublishedTrueAndActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Digital business card not found with slug: " + slug));
    }

    @Transactional(readOnly = true)
    public CardResponse getPublicCardBySlug(String slug) {
        BusinessCard card = getPublicCardEntityBySlug(slug);
        return mapToCardResponse(card);
    }

    @Transactional
    public CardResponse createCard(Long userId, CreateCardRequest request) {
        User user = userService.getUserEntity(userId);

        String slug = sanitizeSlug(request.getSlug());
        if (cardRepository.existsBySlug(slug)) {
            throw new BadRequestException("The custom URL slug '" + slug + "' is already in use. Please choose another.");
        }

        Template template = templateRepository.findByCode(request.getTemplateCode().toUpperCase(Locale.ROOT))
                .orElseGet(() -> templateRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new BadRequestException("No template found")));

        CardTheme theme = null;
        if (request.getThemeId() != null) {
            theme = themeRepository.findById(request.getThemeId()).orElse(null);
        }

        BusinessCard card = new BusinessCard();
        card.setUser(user);
        card.setTemplate(template);
        card.setTheme(theme);
        card.setSlug(slug);
        card.setTitle(request.getTitle().trim());
        card.setFullName(request.getFullName().trim());
        card.setProfessionalTitle(request.getProfessionalTitle());
        card.setCompanyOrInstitution(request.getCompanyOrInstitution());
        card.setEmail(request.getEmail());
        card.setPhone(request.getPhone());
        card.setLocation(request.getLocation());
        card.setShortBio(request.getShortBio());
        card.setSkills(request.getSkills());
        card.setAvatarUrl(request.getAvatarUrl());
        card.setBannerUrl(request.getBannerUrl());
        card.setWebsiteUrl(request.getWebsiteUrl());

        // Custom colors or fallbacks from theme
        applyThemeColors(card, theme, request.getPrimaryColor(), request.getSecondaryColor(),
                request.getBackgroundColor(), request.getTextColor(), request.getFontFamily());

        card.setPublished(request.isPublished());
        card.setActive(true);
        card.setViewCount(0L);
        card.setQrCodeUrl(appBaseUrl + "/api/public/cards/" + slug + "/qr");

        BusinessCard savedCard = cardRepository.save(card);

        // Save Social Links
        if (request.getSocialLinks() != null && !request.getSocialLinks().isEmpty()) {
            int order = 0;
            for (SocialLinkDto dto : request.getSocialLinks()) {
                if (dto.getUrl() != null && !dto.getUrl().isBlank()) {
                    SocialLink link = new SocialLink(savedCard, dto.getPlatform(), dto.getUrl().trim(), dto.getLabel(), order++);
                    savedCard.addSocialLink(link);
                }
            }
            savedCard = cardRepository.save(savedCard);
        }

        return mapToCardResponse(savedCard);
    }

    @Transactional
    public CardResponse updateCard(Long cardId, Long userId, UpdateCardRequest request) {
        BusinessCard card = cardRepository.findByIdAndUserIdAndActiveTrue(cardId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found or access denied"));

        String slug = sanitizeSlug(request.getSlug());
        if (cardRepository.existsBySlugAndIdNot(slug, cardId)) {
            throw new BadRequestException("The custom URL slug '" + slug + "' is already taken by another card");
        }

        Template template = templateRepository.findByCode(request.getTemplateCode().toUpperCase(Locale.ROOT))
                .orElse(card.getTemplate());

        CardTheme theme = null;
        if (request.getThemeId() != null) {
            theme = themeRepository.findById(request.getThemeId()).orElse(null);
        }

        card.setTemplate(template);
        card.setTheme(theme);
        card.setSlug(slug);
        card.setTitle(request.getTitle().trim());
        card.setFullName(request.getFullName().trim());
        card.setProfessionalTitle(request.getProfessionalTitle());
        card.setCompanyOrInstitution(request.getCompanyOrInstitution());
        card.setEmail(request.getEmail());
        card.setPhone(request.getPhone());
        card.setLocation(request.getLocation());
        card.setShortBio(request.getShortBio());
        card.setSkills(request.getSkills());
        card.setAvatarUrl(request.getAvatarUrl());
        card.setBannerUrl(request.getBannerUrl());
        card.setWebsiteUrl(request.getWebsiteUrl());

        applyThemeColors(card, theme, request.getPrimaryColor(), request.getSecondaryColor(),
                request.getBackgroundColor(), request.getTextColor(), request.getFontFamily());

        card.setPublished(request.isPublished());
        card.setActive(request.isActive());
        card.setQrCodeUrl(appBaseUrl + "/api/public/cards/" + slug + "/qr");

        // Update social links
        card.getSocialLinks().clear();
        if (request.getSocialLinks() != null) {
            int order = 0;
            for (SocialLinkDto dto : request.getSocialLinks()) {
                if (dto.getUrl() != null && !dto.getUrl().isBlank()) {
                    SocialLink link = new SocialLink(card, dto.getPlatform(), dto.getUrl().trim(), dto.getLabel(), order++);
                    card.addSocialLink(link);
                }
            }
        }

        BusinessCard updated = cardRepository.save(card);
        return mapToCardResponse(updated);
    }

    @Transactional
    public void deleteCard(Long cardId, Long userId) {
        BusinessCard card = cardRepository.findByIdAndUserIdAndActiveTrue(cardId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found or access denied"));
        card.setActive(false);
        cardRepository.save(card);
    }

    @Transactional
    public boolean togglePublish(Long cardId, Long userId) {
        BusinessCard card = cardRepository.findByIdAndUserIdAndActiveTrue(cardId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found or access denied"));
        card.setPublished(!card.isPublished());
        cardRepository.save(card);
        return card.isPublished();
    }

    @Transactional(readOnly = true)
    public boolean isSlugAvailable(String slug, Long excludeCardId) {
        String cleanSlug = sanitizeSlug(slug);
        if (excludeCardId != null) {
            return !cardRepository.existsBySlugAndIdNot(cleanSlug, excludeCardId);
        }
        return !cardRepository.existsBySlug(cleanSlug);
    }

    private void applyThemeColors(BusinessCard card, CardTheme theme, String pCol, String sCol, String bgCol, String textCol, String font) {
        if (pCol != null && !pCol.isBlank()) {
            card.setPrimaryColor(pCol);
        } else if (theme != null) {
            card.setPrimaryColor(theme.getPrimaryColor());
        }

        if (sCol != null && !sCol.isBlank()) {
            card.setSecondaryColor(sCol);
        } else if (theme != null) {
            card.setSecondaryColor(theme.getSecondaryColor());
        }

        if (bgCol != null && !bgCol.isBlank()) {
            card.setBackgroundColor(bgCol);
        } else if (theme != null) {
            card.setBackgroundColor(theme.getBackgroundColor());
        }

        if (textCol != null && !textCol.isBlank()) {
            card.setTextColor(textCol);
        } else if (theme != null) {
            card.setTextColor(theme.getTextColor());
        }

        if (font != null && !font.isBlank()) {
            card.setFontFamily(font);
        } else if (theme != null) {
            card.setFontFamily(theme.getFontFamily());
        }
    }

    public String sanitizeSlug(String raw) {
        if (raw == null || raw.isBlank()) return "card-" + System.currentTimeMillis();
        return raw.trim().toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9-]", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

    public CardResponse mapToCardResponse(BusinessCard card) {
        CardResponse res = new CardResponse();
        res.setId(card.getId());
        res.setSlug(card.getSlug());
        res.setTitle(card.getTitle());
        res.setFullName(card.getFullName());
        res.setProfessionalTitle(card.getProfessionalTitle());
        res.setCompanyOrInstitution(card.getCompanyOrInstitution());
        res.setEmail(card.getEmail());
        res.setPhone(card.getPhone());
        res.setLocation(card.getLocation());
        res.setShortBio(card.getShortBio());
        res.setSkills(card.getSkills());
        res.setAvatarUrl(card.getAvatarUrl());
        res.setBannerUrl(card.getBannerUrl());
        res.setWebsiteUrl(card.getWebsiteUrl());

        res.setPrimaryColor(card.getPrimaryColor());
        res.setSecondaryColor(card.getSecondaryColor());
        res.setBackgroundColor(card.getBackgroundColor());
        res.setTextColor(card.getTextColor());
        res.setFontFamily(card.getFontFamily());

        res.setPublished(card.isPublished());
        res.setActive(card.isActive());
        res.setQrCodeUrl(card.getQrCodeUrl());
        res.setViewCount(card.getViewCount());

        res.setTemplate(templateService.mapToTemplateResponse(card.getTemplate()));
        res.setTheme(templateService.mapToThemeResponse(card.getTheme()));

        List<SocialLinkDto> links = new ArrayList<>();
        if (card.getSocialLinks() != null) {
            for (SocialLink sl : card.getSocialLinks()) {
                links.add(new SocialLinkDto(sl.getPlatform(), sl.getUrl(), sl.getLabel(), sl.getDisplayOrder()));
            }
        }
        res.setSocialLinks(links);
        res.setCreatedAt(card.getCreatedAt());
        res.setUpdatedAt(card.getUpdatedAt());

        return res;
    }

    public CardSummaryResponse mapToSummaryResponse(BusinessCard card) {
        CardSummaryResponse res = new CardSummaryResponse();
        res.setId(card.getId());
        res.setSlug(card.getSlug());
        res.setTitle(card.getTitle());
        res.setFullName(card.getFullName());
        res.setProfessionalTitle(card.getProfessionalTitle());
        res.setCompanyOrInstitution(card.getCompanyOrInstitution());
        res.setAvatarUrl(card.getAvatarUrl());
        res.setTemplateCode(card.getTemplate() != null ? card.getTemplate().getCode() : "PROFESSIONAL");
        res.setTemplateName(card.getTemplate() != null ? card.getTemplate().getDisplayName() : "Professional");
        res.setPrimaryColor(card.getPrimaryColor());
        res.setPublished(card.isPublished());
        res.setActive(card.isActive());
        res.setViewCount(card.getViewCount());
        res.setCreatedAt(card.getCreatedAt());
        res.setUpdatedAt(card.getUpdatedAt());
        return res;
    }
}
