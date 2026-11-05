package com.cardcraft.controller;

import com.cardcraft.dto.response.ApiResponse;
import com.cardcraft.dto.response.CardThemeResponse;
import com.cardcraft.dto.response.TemplateResponse;
import com.cardcraft.service.TemplateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TemplateController {

    private final TemplateService templateService;

    public TemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }

    @GetMapping("/templates")
    public ResponseEntity<ApiResponse<List<TemplateResponse>>> getTemplates() {
        List<TemplateResponse> templates = templateService.getAllTemplates();
        return ResponseEntity.ok(ApiResponse.ok(templates));
    }

    @GetMapping("/themes")
    public ResponseEntity<ApiResponse<List<CardThemeResponse>>> getThemes() {
        List<CardThemeResponse> themes = templateService.getAllThemes();
        return ResponseEntity.ok(ApiResponse.ok(themes));
    }
}
