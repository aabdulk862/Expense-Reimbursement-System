package com.revature.models.DTOs;

public class RoleUpdateRequest {
    private int currentUserId;  // ID of the user making the request
    private int targetUserId;   // ID of the user whose role is being updated
    private String newRole;     // The new role to be assigned

    public RoleUpdateRequest() {
    }

    public RoleUpdateRequest(int currentUserId, int targetUserId, String newRole) {
        this.currentUserId = currentUserId;
        this.targetUserId = targetUserId;
        this.newRole = newRole;
    }

    public int getCurrentUserId() {
        return currentUserId;
    }

    public void setCurrentUserId(int currentUserId) {
        this.currentUserId = currentUserId;
    }

    public int getTargetUserId() {
        return targetUserId;
    }

    public void setTargetUserId(int targetUserId) {
        this.targetUserId = targetUserId;
    }

    public String getNewRole() {
        return newRole;
    }

    public void setNewRole(String newRole) {
        this.newRole = newRole;
    }

    @Override
    public String toString() {
        return "RoleUpdateRequest{" +
                "currentUserId=" + currentUserId +
                ", targetUserId=" + targetUserId +
                ", newRole='" + newRole + '\'' +
                '}';
    }
}
