package com.cardcraft.service;

import com.cardcraft.dto.response.CardThemeResponse;
import com.cardcraft.dto.response.TemplateResponse;
import com.cardcraft.entity.CardTheme;
import com.cardcraft.entity.Template;
import com.cardcraft.repository.CardThemeRepository;
import com.cardcraft.repository.TemplateRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TemplateService {

    private final TemplateRepository templateRepository;
    private final CardThemeRepository themeRepository;

    public TemplateService(TemplateRepository templateRepository, CardThemeRepository themeRepository) {
        this.templateRepository = templateRepository;
        this.themeRepository = themeRepository;
    }

    @Transactional(readOnly = true)
    public List<TemplateResponse> getAllTemplates() {
        return templateRepository.findByActiveTrue().stream()
                .map(this::mapToTemplateResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CardThemeResponse> getAllThemes() {
        return themeRepository.findAll().stream()
                .map(this::mapToThemeResponse)
                .toList();
    }

    public TemplateResponse mapToTemplateResponse(Template template) {
        if (template == null) return null;
        TemplateResponse res = new TemplateResponse();
        res.setId(template.getId());
        res.setCode(template.getCode());
        res.setDisplayName(template.getDisplayName());
        res.setDescription(template.getDescription());
        res.setPreviewImageUrl(template.getPreviewImageUrl());
        res.setLayoutConfig(template.getLayoutConfig());
        res.setActive(template.isActive());
        return res;
    }

    public CardThemeResponse mapToThemeResponse(CardTheme theme) {
        if (theme == null) return null;
        CardThemeResponse res = new CardThemeResponse();
        res.setId(theme.getId());
        res.setName(theme.getName());
        res.setPrimaryColor(theme.getPrimaryColor());
        res.setSecondaryColor(theme.getSecondaryColor());
        res.setBackgroundColor(theme.getBackgroundColor());
        res.setTextColor(theme.getTextColor());
        res.setAccentColor(theme.getAccentColor());
        res.setFontFamily(theme.getFontFamily());
        res.setBorderRadius(theme.getBorderRadius());
        res.setDefault(theme.isDefault());
        return res;
    }
}
