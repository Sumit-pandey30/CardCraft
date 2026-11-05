package com.cardcraft.controller;

import com.cardcraft.dto.request.CreateCardRequest;
import com.cardcraft.dto.request.UpdateCardRequest;
import com.cardcraft.dto.response.*;
import com.cardcraft.entity.BusinessCard;
import com.cardcraft.security.UserPrincipal;
import com.cardcraft.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
public class BusinessCardController {

    private final BusinessCardService cardService;
    private final QrCodeService qrCodeService;
    private final PdfExportService pdfExportService;
    private final AnalyticsService analyticsService;
    private final ContactMessageService messageService;

    @Value("${cardcraft.app.base-url:http://localhost:5173}")
    private String appBaseUrl;

    public BusinessCardController(BusinessCardService cardService,
                                  QrCodeService qrCodeService,
                                  PdfExportService pdfExportService,
                                  AnalyticsService analyticsService,
                                  ContactMessageService messageService) {
        this.cardService = cardService;
        this.qrCodeService = qrCodeService;
        this.pdfExportService = pdfExportService;
        this.analyticsService = analyticsService;
        this.messageService = messageService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CardSummaryResponse>>> getUserCards(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<CardSummaryResponse> cards = cardService.getUserCards(currentUser.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.ok(cards));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<CardSummaryResponse>>> getAllUserCards(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<CardSummaryResponse> cards = cardService.getAllUserCards(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok(cards));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CardResponse>> createCard(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CreateCardRequest request) {
        CardResponse response = cardService.createCard(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Business card created successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CardResponse>> getCardById(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        CardResponse response = cardService.getCardById(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CardResponse>> updateCard(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCardRequest request) {
        CardResponse response = cardService.updateCard(id, currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Business card updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCard(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        cardService.deleteCard(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Business card deleted successfully", null));
    }

    @PatchMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<Boolean>> togglePublish(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        boolean published = cardService.togglePublish(id, currentUser.getId());
        String msg = published ? "Card is now live and public" : "Card is now unpublished (draft)";
        return ResponseEntity.ok(ApiResponse.ok(msg, published));
    }

    @GetMapping("/slug-available")
    public ResponseEntity<ApiResponse<Boolean>> checkSlugAvailable(
            @RequestParam String slug,
            @RequestParam(required = false) Long excludeId) {
        boolean available = cardService.isSlugAvailable(slug, excludeId);
        return ResponseEntity.ok(ApiResponse.ok(available));
    }

    @GetMapping("/{id}/qr")
    public ResponseEntity<byte[]> getCardQrCode(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @RequestParam(defaultValue = "300") int size) {
        BusinessCard card = cardService.getCardEntity(id, currentUser.getId());
        String publicCardUrl = appBaseUrl + "/c/" + card.getSlug();
        byte[] qrImage = qrCodeService.generateQrCodeImage(publicCardUrl, size, size);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + card.getSlug() + "-qr.png\"")
                .body(qrImage);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadCardPdf(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        BusinessCard card = cardService.getCardEntity(id, currentUser.getId());
        byte[] pdfBytes = pdfExportService.generateCardPdf(card);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + card.getSlug() + "-card.pdf\"")
                .body(pdfBytes);
    }

    @GetMapping("/{id}/analytics")
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getCardAnalytics(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        AnalyticsResponse response = analyticsService.getCardAnalytics(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<ApiResponse<Page<ContactMessageResponse>>> getCardMessages(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ContactMessageResponse> messages = messageService.getMessagesForCard(id, currentUser.getId(), PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.ok(messages));
    }
}
