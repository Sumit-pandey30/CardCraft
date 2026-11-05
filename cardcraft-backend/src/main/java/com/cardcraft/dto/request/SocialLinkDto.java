package com.cardcraft.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SocialLinkDto {

    private Long id;

    @NotBlank(message = "Platform is required")
    private String platform;

    @NotBlank(message = "URL is required")
    @Size(max = 500)
    private String url;

    @Size(max = 100)
    private String label;

    private int displayOrder;

    public SocialLinkDto() {}

    public SocialLinkDto(String platform, String url, String label, int displayOrder) {
        this.platform = platform;
        this.url = url;
        this.label = label;
        this.displayOrder = displayOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public int getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
}
