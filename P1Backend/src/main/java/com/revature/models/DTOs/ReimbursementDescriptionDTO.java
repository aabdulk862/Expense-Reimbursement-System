package com.revature.models.DTOs;

public class ReimbursementDescriptionDTO {
    private String description;

    public ReimbursementDescriptionDTO() {}

    public ReimbursementDescriptionDTO(String description) {
        this.description = description;
    }

    // Getter and Setter
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
