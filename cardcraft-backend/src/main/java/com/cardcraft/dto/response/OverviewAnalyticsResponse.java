package com.cardcraft.dto.response;

import java.util.List;
import java.util.Map;

public class OverviewAnalyticsResponse {

    private long totalCards;
    private long totalViews;
    private long totalShares;
    private long unreadMessages;
    private List<CardSummaryResponse> recentCards;
    private List<Map<String, Object>> viewsTimeline;

    public OverviewAnalyticsResponse() {}

    public long getTotalCards() { return totalCards; }
    public void setTotalCards(long totalCards) { this.totalCards = totalCards; }

    public long getTotalViews() { return totalViews; }
    public void setTotalViews(long totalViews) { this.totalViews = totalViews; }

    public long getTotalShares() { return totalShares; }
    public void setTotalShares(long totalShares) { this.totalShares = totalShares; }

    public long getUnreadMessages() { return unreadMessages; }
    public void setUnreadMessages(long unreadMessages) { this.unreadMessages = unreadMessages; }

    public List<CardSummaryResponse> getRecentCards() { return recentCards; }
    public void setRecentCards(List<CardSummaryResponse> recentCards) { this.recentCards = recentCards; }

    public List<Map<String, Object>> getViewsTimeline() { return viewsTimeline; }
    public void setViewsTimeline(List<Map<String, Object>> viewsTimeline) { this.viewsTimeline = viewsTimeline; }
}
