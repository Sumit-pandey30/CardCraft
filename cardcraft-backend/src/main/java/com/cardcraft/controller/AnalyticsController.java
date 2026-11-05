package com.cardcraft.controller;

import com.cardcraft.dto.response.ApiResponse;
import com.cardcraft.dto.response.OverviewAnalyticsResponse;
import com.cardcraft.security.UserPrincipal;
import com.cardcraft.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<OverviewAnalyticsResponse>> getOverview(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        OverviewAnalyticsResponse response = analyticsService.getUserOverview(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
