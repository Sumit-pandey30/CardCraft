package com.cardcraft.dto.response;

public class TemplateResponse {
    private Long id;
    private String code;
    private String displayName;
    private String description;
    private String previewImageUrl;
    private String layoutConfig;
    private boolean active;

    public TemplateResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPreviewImageUrl() { return previewImageUrl; }
    public void setPreviewImageUrl(String previewImageUrl) { this.previewImageUrl = previewImageUrl; }

    public String getLayoutConfig() { return layoutConfig; }
    public void setLayoutConfig(String layoutConfig) { this.layoutConfig = layoutConfig; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
