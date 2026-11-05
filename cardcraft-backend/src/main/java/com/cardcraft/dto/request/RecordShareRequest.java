package com.cardcraft.dto.request;

import jakarta.validation.constraints.NotBlank;

public class RecordShareRequest {

    @NotBlank(message = "Share medium is required")
    private String shareMedium;

    public RecordShareRequest() {}

    public RecordShareRequest(String shareMedium) {
        this.shareMedium = shareMedium;
    }

    public String getShareMedium() { return shareMedium; }
    public void setShareMedium(String shareMedium) { this.shareMedium = shareMedium; }
}
