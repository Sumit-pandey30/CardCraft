package com.cardcraft.service;

import com.cardcraft.entity.BusinessCard;
import com.cardcraft.entity.SocialLink;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;

@Service
public class PdfExportService {

    private final QrCodeService qrCodeService;

    @Value("${cardcraft.app.base-url:http://localhost:5173}")
    private String appBaseUrl;

    public PdfExportService(QrCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }

    @Transactional(readOnly = true)
    public byte[] generateCardPdf(BusinessCard card) {
        try {
            // Business card / card format: 600x380 points (horizontal)
            Rectangle pageSize = new Rectangle(600, 380);
            Document document = new Document(pageSize, 30, 30, 25, 25);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, baos);

            document.open();

            // Primary color parsing
            Color primaryColor = parseColor(card.getPrimaryColor(), new Color(99, 102, 241));
            Color textColor = parseColor(card.getTextColor(), new Color(15, 23, 42));
            Color grayColor = new Color(100, 116, 139);

            // 1. Header Band
            PdfPTable headerTable = new PdfPTable(1);
            headerTable.setWidthPercentage(100);
            PdfPCell headerCell = new PdfPCell();
            headerCell.setBackgroundColor(primaryColor);
            headerCell.setPadding(12);
            headerCell.setBorder(Rectangle.NO_BORDER);

            Font brandFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);
            Paragraph brandPara = new Paragraph("CARDCRAFT DIGITAL BUSINESS CARD", brandFont);
            brandPara.setAlignment(Element.ALIGN_RIGHT);
            headerCell.addElement(brandPara);
            headerTable.addCell(headerCell);
            document.add(headerTable);

            // 2. Main Content (2 columns: Left = details, Right = QR code)
            PdfPTable mainTable = new PdfPTable(2);
            mainTable.setWidthPercentage(100);
            mainTable.setWidths(new float[]{68f, 32f});
            mainTable.setSpacingBefore(15);

            // Left column: Profile info
            PdfPCell leftCell = new PdfPCell();
            leftCell.setBorder(Rectangle.NO_BORDER);
            leftCell.setPaddingRight(15);

            Font nameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, textColor);
            Paragraph namePara = new Paragraph(card.getFullName(), nameFont);
            leftCell.addElement(namePara);

            if (card.getProfessionalTitle() != null && !card.getProfessionalTitle().isBlank()) {
                Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, primaryColor);
                leftCell.addElement(new Paragraph(card.getProfessionalTitle(), titleFont));
            }

            if (card.getCompanyOrInstitution() != null && !card.getCompanyOrInstitution().isBlank()) {
                Font compFont = FontFactory.getFont(FontFactory.HELVETICA, 11, grayColor);
                leftCell.addElement(new Paragraph(card.getCompanyOrInstitution(), compFont));
            }

            // Short bio
            if (card.getShortBio() != null && !card.getShortBio().isBlank()) {
                Font bioFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9, new Color(51, 65, 85));
                Paragraph bioPara = new Paragraph(card.getShortBio(), bioFont);
                bioPara.setSpacingBefore(8);
                leftCell.addElement(bioPara);
            }

            // Contact rows
            PdfPTable contactTable = new PdfPTable(1);
            contactTable.setWidthPercentage(100);
            contactTable.setSpacingBefore(10);

            Font contactFont = FontFactory.getFont(FontFactory.HELVETICA, 9, textColor);

            if (card.getEmail() != null && !card.getEmail().isBlank()) {
                PdfPCell c = new PdfPCell(new Phrase("Email: " + card.getEmail(), contactFont));
                c.setBorder(Rectangle.NO_BORDER);
                c.setPadding(2);
                contactTable.addCell(c);
            }
            if (card.getPhone() != null && !card.getPhone().isBlank()) {
                PdfPCell c = new PdfPCell(new Phrase("Phone: " + card.getPhone(), contactFont));
                c.setBorder(Rectangle.NO_BORDER);
                c.setPadding(2);
                contactTable.addCell(c);
            }
            if (card.getLocation() != null && !card.getLocation().isBlank()) {
                PdfPCell c = new PdfPCell(new Phrase("Location: " + card.getLocation(), contactFont));
                c.setBorder(Rectangle.NO_BORDER);
                c.setPadding(2);
                contactTable.addCell(c);
            }
            if (card.getWebsiteUrl() != null && !card.getWebsiteUrl().isBlank()) {
                PdfPCell c = new PdfPCell(new Phrase("Website: " + card.getWebsiteUrl(), contactFont));
                c.setBorder(Rectangle.NO_BORDER);
                c.setPadding(2);
                contactTable.addCell(c);
            }

            leftCell.addElement(contactTable);

            // Skills
            if (card.getSkills() != null && !card.getSkills().isBlank()) {
                Font skillFont = FontFactory.getFont(FontFactory.HELVETICA, 8, primaryColor);
                Paragraph skillPara = new Paragraph("Skills: " + card.getSkills(), skillFont);
                skillPara.setSpacingBefore(6);
                leftCell.addElement(skillPara);
            }

            // Social links
            if (card.getSocialLinks() != null && !card.getSocialLinks().isEmpty()) {
                StringBuilder sb = new StringBuilder();
                for (SocialLink sl : card.getSocialLinks()) {
                    if (!sb.isEmpty()) sb.append(" | ");
                    sb.append(sl.getPlatform()).append(": ").append(sl.getUrl());
                }
                Font socialFont = FontFactory.getFont(FontFactory.HELVETICA, 8, grayColor);
                Paragraph socialPara = new Paragraph(sb.toString(), socialFont);
                socialPara.setSpacingBefore(6);
                leftCell.addElement(socialPara);
            }

            mainTable.addCell(leftCell);

            // Right column: QR Code and Scan message
            PdfPCell rightCell = new PdfPCell();
            rightCell.setBorder(Rectangle.NO_BORDER);
            rightCell.setHorizontalAlignment(Element.ALIGN_CENTER);

            String publicCardUrl = appBaseUrl + "/c/" + card.getSlug();
            byte[] qrBytes = qrCodeService.generateQrCodeImage(publicCardUrl, 130, 130);
            Image qrImage = Image.getInstance(qrBytes);
            qrImage.setAlignment(Element.ALIGN_CENTER);
            rightCell.addElement(qrImage);

            Font scanFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, textColor);
            Paragraph scanPara = new Paragraph("SCAN TO VIEW DIGITAL CARD", scanFont);
            scanPara.setAlignment(Element.ALIGN_CENTER);
            scanPara.setSpacingBefore(5);
            rightCell.addElement(scanPara);

            Font urlFont = FontFactory.getFont(FontFactory.HELVETICA, 7, primaryColor);
            Paragraph urlPara = new Paragraph(publicCardUrl, urlFont);
            urlPara.setAlignment(Element.ALIGN_CENTER);
            urlPara.setSpacingBefore(2);
            rightCell.addElement(urlPara);

            mainTable.addCell(rightCell);
            document.add(mainTable);

            // 3. Footer
            Font footFont = FontFactory.getFont(FontFactory.HELVETICA, 8, new Color(148, 163, 184));
            Paragraph footerPara = new Paragraph("CardCraft Smart Digital Business Card Platform", footFont);
            footerPara.setAlignment(Element.ALIGN_CENTER);
            footerPara.setSpacingBefore(20);
            document.add(footerPara);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Card PDF: " + e.getMessage(), e);
        }
    }

    private Color parseColor(String hex, Color defaultColor) {
        if (hex == null || hex.isBlank()) return defaultColor;
        try {
            String clean = hex.trim();
            if (!clean.startsWith("#")) clean = "#" + clean;
            return Color.decode(clean);
        } catch (Exception e) {
            return defaultColor;
        }
    }
}
