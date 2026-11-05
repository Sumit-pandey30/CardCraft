package com.cardcraft.service;

import com.cardcraft.dto.response.AnalyticsResponse;
import com.cardcraft.dto.response.CardSummaryResponse;
import com.cardcraft.dto.response.OverviewAnalyticsResponse;
import com.cardcraft.entity.BusinessCard;
import com.cardcraft.entity.CardShare;
import com.cardcraft.entity.CardView;
import com.cardcraft.repository.BusinessCardRepository;
import com.cardcraft.repository.CardShareRepository;
import com.cardcraft.repository.CardViewRepository;
import com.cardcraft.repository.ContactMessageRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class AnalyticsService {

    private final CardViewRepository viewRepository;
    private final CardShareRepository shareRepository;
    private final BusinessCardRepository cardRepository;
    private final ContactMessageRepository messageRepository;
    private final BusinessCardService cardService;

    public AnalyticsService(CardViewRepository viewRepository,
                            CardShareRepository shareRepository,
                            BusinessCardRepository cardRepository,
                            ContactMessageRepository messageRepository,
                            BusinessCardService cardService) {
        this.viewRepository = viewRepository;
        this.shareRepository = shareRepository;
        this.cardRepository = cardRepository;
        this.messageRepository = messageRepository;
        this.cardService = cardService;
    }

    @Transactional
    public void recordCardView(String slug, String ip, String userAgent, String referer) {
        cardRepository.findBySlugAndPublishedTrueAndActiveTrue(slug).ifPresent(card -> {
            String device = detectDevice(userAgent);
            CardView view = new CardView(card, ip, truncate(userAgent, 300), truncate(referer, 300), device);
            viewRepository.save(view);

            card.setViewCount(card.getViewCount() + 1);
            cardRepository.save(card);
        });
    }

    @Transactional
    public void recordCardShare(String slug, String medium) {
        cardRepository.findBySlugAndPublishedTrueAndActiveTrue(slug).ifPresent(card -> {
            CardShare share = new CardShare(card, medium != null ? medium.toUpperCase(Locale.ROOT) : "OTHER");
            shareRepository.save(share);
        });
    }

    @Transactional(readOnly = true)
    public AnalyticsResponse getCardAnalytics(Long cardId, Long userId) {
        BusinessCard card = cardService.getCardEntity(cardId, userId);

        AnalyticsResponse res = new AnalyticsResponse();
        res.setCardId(card.getId());
        res.setCardTitle(card.getTitle());
        res.setSlug(card.getSlug());
        res.setTotalViews(card.getViewCount());
        res.setTotalShares(shareRepository.countByCardId(cardId));

        // Device breakdown
        Map<String, Long> deviceMap = new LinkedHashMap<>();
        for (Object[] row : viewRepository.countViewsByDeviceType(cardId)) {
            String dev = row[0] != null ? row[0].toString() : "OTHER";
            Long count = ((Number) row[1]).longValue();
            deviceMap.put(dev, count);
        }
        res.setDeviceBreakdown(deviceMap);

        // Share breakdown
        Map<String, Long> shareMap = new LinkedHashMap<>();
        for (Object[] row : shareRepository.countSharesByMedium(cardId)) {
            String medium = row[0] != null ? row[0].toString() : "OTHER";
            Long count = ((Number) row[1]).longValue();
            shareMap.put(medium, count);
        }
        res.setShareBreakdown(shareMap);

        // Views timeline (last 14 days)
        LocalDateTime since = LocalDate.now().minusDays(13).atStartOfDay();
        List<CardView> recentViews = viewRepository.findViewsSince(cardId, since);
        res.setViewsTimeline(buildTimeline(recentViews, 14));

        // Top Referrers
        List<Map<String, Object>> topReferrers = new ArrayList<>();
        for (Object[] row : viewRepository.countViewsByReferer(cardId, PageRequest.of(0, 5))) {
            Map<String, Object> ref = new HashMap<>();
            ref.put("referer", row[0] != null ? row[0].toString() : "Direct / QR Code");
            ref.put("count", ((Number) row[1]).longValue());
            topReferrers.add(ref);
        }
        res.setTopReferrers(topReferrers);

        return res;
    }

    @Transactional(readOnly = true)
    public OverviewAnalyticsResponse getUserOverview(Long userId) {
        OverviewAnalyticsResponse res = new OverviewAnalyticsResponse();
        res.setTotalCards(cardRepository.countByUserIdAndActiveTrue(userId));
        res.setTotalViews(cardRepository.sumViewsByUserId(userId));
        res.setTotalShares(shareRepository.countSharesByUserId(userId));
        res.setUnreadMessages(messageRepository.countByCardUserIdAndIsReadFalse(userId));

        List<CardSummaryResponse> recent = cardRepository.findByUserIdAndActiveTrueOrderByCreatedAtDesc(userId)
                .stream()
                .limit(5)
                .map(cardService::mapToSummaryResponse)
                .toList();
        res.setRecentCards(recent);

        // Views timeline across user cards for 7 days
        List<Map<String, Object>> timeline = new ArrayList<>();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate today = LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            LocalDateTime start = day.atStartOfDay();
            LocalDateTime end = day.plusDays(1).atStartOfDay();
            long count = viewRepository.countViewsForUserSince(userId, start) -
                    viewRepository.countViewsForUserSince(userId, end);
            if (count < 0) count = 0;
            Map<String, Object> entry = new HashMap<>();
            entry.put("date", day.format(dtf));
            entry.put("views", count);
            timeline.add(entry);
        }
        res.setViewsTimeline(timeline);

        return res;
    }

    private List<Map<String, Object>> buildTimeline(List<CardView> views, int days) {
        Map<String, Long> countByDate = new HashMap<>();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        for (CardView cv : views) {
            String dateStr = cv.getViewedAt().toLocalDate().format(dtf);
            countByDate.put(dateStr, countByDate.getOrDefault(dateStr, 0L) + 1);
        }

        List<Map<String, Object>> timeline = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = days - 1; i >= 0; i--) {
            String dateKey = today.minusDays(i).format(dtf);
            Map<String, Object> point = new HashMap<>();
            point.put("date", dateKey);
            point.put("views", countByDate.getOrDefault(dateKey, 0L));
            timeline.add(point);
        }
        return timeline;
    }

    private String detectDevice(String userAgent) {
        if (userAgent == null) return "DESKTOP";
        String ua = userAgent.toLowerCase();
        if (ua.contains("mobile") || ua.contains("android") || ua.contains("iphone")) {
            return "MOBILE";
        } else if (ua.contains("ipad") || ua.contains("tablet")) {
            return "TABLET";
        }
        return "DESKTOP";
    }

    private String truncate(String text, int max) {
        if (text == null) return null;
        return text.length() <= max ? text : text.substring(0, max);
    }
}
