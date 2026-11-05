package com.cardcraft.controller;

import com.cardcraft.dto.request.ContactMessageRequest;
import com.cardcraft.dto.request.RecordShareRequest;
import com.cardcraft.dto.response.ApiResponse;
import com.cardcraft.dto.response.CardResponse;
import com.cardcraft.dto.response.ContactMessageResponse;
import com.cardcraft.entity.BusinessCard;
import com.cardcraft.service.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/public/cards")
public class PublicCardController {

    private final BusinessCardService cardService;
    private final AnalyticsService analyticsService;
    private final ContactMessageService messageService;
    private final QrCodeService qrCodeService;
    private final PdfExportService pdfExportService;

    @Value("${cardcraft.app.base-url:http://localhost:5173}")
    private String appBaseUrl;

    public PublicCardController(BusinessCardService cardService,
                                AnalyticsService analyticsService,
                                ContactMessageService messageService,
                                QrCodeService qrCodeService,
                                PdfExportService pdfExportService) {
        this.cardService = cardService;
        this.analyticsService = analyticsService;
        this.messageService = messageService;
        this.qrCodeService = qrCodeService;
        this.pdfExportService = pdfExportService;
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<CardResponse>> getPublicCard(@PathVariable String slug) {
        CardResponse response = cardService.getPublicCardBySlug(slug);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/{slug}/views")
    public ResponseEntity<ApiResponse<Void>> recordView(@PathVariable String slug, HttpServletRequest request) {
        String ip = getClientIp(request);
        String userAgent = request.getHeader("User-Agent");
        String referer = request.getHeader("Referer");
        analyticsService.recordCardView(slug, ip, userAgent, referer);
        return ResponseEntity.ok(ApiResponse.ok("View recorded", null));
    }

    @PostMapping("/{slug}/shares")
    public ResponseEntity<ApiResponse<Void>> recordShare(@PathVariable String slug,
                                                         @Valid @RequestBody RecordShareRequest request) {
        analyticsService.recordCardShare(slug, request.getShareMedium());
        return ResponseEntity.ok(ApiResponse.ok("Share recorded", null));
    }

    @PostMapping("/{slug}/contact")
    public ResponseEntity<ApiResponse<ContactMessageResponse>> sendContactMessage(
            @PathVariable String slug,
            @Valid @RequestBody ContactMessageRequest request) {
        ContactMessageResponse response = messageService.sendContactMessage(slug, request);
        return ResponseEntity.ok(ApiResponse.ok("Message sent successfully to card owner", response));
    }

    @GetMapping("/{slug}/qr")
    public ResponseEntity<byte[]> getPublicCardQr(@PathVariable String slug,
                                                  @RequestParam(defaultValue = "300") int size) {
        BusinessCard card = cardService.getPublicCardEntityBySlug(slug);
        String publicCardUrl = appBaseUrl + "/c/" + card.getSlug();
        byte[] qrBytes = qrCodeService.generateQrCodeImage(publicCardUrl, size, size);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + card.getSlug() + "-qr.png\"")
                .body(qrBytes);
    }

    @GetMapping("/{slug}/pdf")
    public ResponseEntity<byte[]> getPublicCardPdf(@PathVariable String slug) {
        BusinessCard card = cardService.getPublicCardEntityBySlug(slug);
        byte[] pdfBytes = pdfExportService.generateCardPdf(card);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + card.getSlug() + "-card.pdf\"")
                .body(pdfBytes);
    }

    @GetMapping("/{slug}/vcard")
    public ResponseEntity<byte[]> getCardVcf(@PathVariable String slug) {
        BusinessCard card = cardService.getPublicCardEntityBySlug(slug);

        StringBuilder vcf = new StringBuilder();
        vcf.append("BEGIN:VCARD\r\n");
        vcf.append("VERSION:3.0\r\n");
        vcf.append("FN:").append(escapeVCard(card.getFullName())).append("\r\n");
        if (card.getProfessionalTitle() != null && !card.getProfessionalTitle().isBlank()) {
            vcf.append("TITLE:").append(escapeVCard(card.getProfessionalTitle())).append("\r\n");
        }
        if (card.getCompanyOrInstitution() != null && !card.getCompanyOrInstitution().isBlank()) {
            vcf.append("ORG:").append(escapeVCard(card.getCompanyOrInstitution())).append("\r\n");
        }
        if (card.getEmail() != null && !card.getEmail().isBlank()) {
            vcf.append("EMAIL;TYPE=INTERNET,PREF:").append(card.getEmail().trim()).append("\r\n");
        }
        if (card.getPhone() != null && !card.getPhone().isBlank()) {
            vcf.append("TEL;TYPE=CELL,VOICE:").append(card.getPhone().trim()).append("\r\n");
        }
        if (card.getWebsiteUrl() != null && !card.getWebsiteUrl().isBlank()) {
            vcf.append("URL:").append(card.getWebsiteUrl().trim()).append("\r\n");
        }
        if (card.getShortBio() != null && !card.getShortBio().isBlank()) {
            vcf.append("NOTE:").append(escapeVCard(card.getShortBio())).append("\r\n");
        }
        vcf.append("URL;TYPE=DIGITAL_CARD:").append(appBaseUrl).append("/c/").append(card.getSlug()).append("\r\n");
        vcf.append("END:VCARD\r\n");

        byte[] vcfBytes = vcf.toString().getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/vcard"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + card.getSlug() + ".vcf\"")
                .body(vcfBytes);
    }

    private String escapeVCard(String value) {
        if (value == null) return "";
        return value.replace("\\", "\\\\").replace(";", "\\;").replace(",", "\\,").replace("\n", "\\n");
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
