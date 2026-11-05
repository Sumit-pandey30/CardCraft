package com.cardcraft.dto.response;

import java.util.List;
import java.util.Map;

public class AnalyticsResponse {

    private Long cardId;
    private String cardTitle;
    private String slug;
    private Long totalViews;
    private Long totalShares;
    private Map<String, Long> deviceBreakdown;
    private Map<String, Long> shareBreakdown;
    private List<Map<String, Object>> viewsTimeline; // list of { date: "YYYY-MM-DD", views: count }
    private List<Map<String, Object>> topReferrers;

    public AnalyticsResponse() {}

    public Long getCardId() { return cardId; }
    public void setCardId(Long cardId) { this.cardId = cardId; }

    public String getCardTitle() { return cardTitle; }
    public void setCardTitle(String cardTitle) { this.cardTitle = cardTitle; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public Long getTotalViews() { return totalViews; }
    public void setTotalViews(Long totalViews) { this.totalViews = totalViews; }

    public Long getTotalShares() { return totalShares; }
    public void setTotalShares(Long totalShares) { this.totalShares = totalShares; }

    public Map<String, Long> getDeviceBreakdown() { return deviceBreakdown; }
    public void setDeviceBreakdown(Map<String, Long> deviceBreakdown) { this.deviceBreakdown = deviceBreakdown; }

    public Map<String, Long> getShareBreakdown() { return shareBreakdown; }
    public void setShareBreakdown(Map<String, Long> shareBreakdown) { this.shareBreakdown = shareBreakdown; }

    public List<Map<String, Object>> getViewsTimeline() { return viewsTimeline; }
    public void setViewsTimeline(List<Map<String, Object>> viewsTimeline) { this.viewsTimeline = viewsTimeline; }

    public List<Map<String, Object>> getTopReferrers() { return topReferrers; }
    public void setTopReferrers(List<Map<String, Object>> topReferrers) { this.topReferrers = topReferrers; }
}
