package com.cardcraft.controller;

import com.cardcraft.dto.request.ChangePasswordRequest;
import com.cardcraft.dto.request.UpdateUserRequest;
import com.cardcraft.dto.response.ApiResponse;
import com.cardcraft.dto.response.ContactMessageResponse;
import com.cardcraft.dto.response.UserResponse;
import com.cardcraft.security.UserPrincipal;
import com.cardcraft.service.ContactMessageService;
import com.cardcraft.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final ContactMessageService messageService;

    public UserController(UserService userService, ContactMessageService messageService) {
        this.userService = userService;
        this.messageService = messageService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMe(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserResponse response = userService.getMe(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@AuthenticationPrincipal UserPrincipal currentUser,
                                                                   @Valid @RequestBody UpdateUserRequest request) {
        UserResponse response = userService.updateProfile(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", response));
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@AuthenticationPrincipal UserPrincipal currentUser,
                                                            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Password changed successfully", null));
    }

    @GetMapping("/me/messages")
    public ResponseEntity<ApiResponse<List<ContactMessageResponse>>> getAllMessages(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<ContactMessageResponse> messages = messageService.getAllMessagesForUser(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok(messages));
    }

    @PatchMapping("/me/messages/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markMessageAsRead(@AuthenticationPrincipal UserPrincipal currentUser,
                                                               @PathVariable Long id) {
        messageService.markAsRead(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Message marked as read", null));
    }
}
