package com.cardcraft.service;

import com.cardcraft.dto.request.ChangePasswordRequest;
import com.cardcraft.dto.request.UpdateUserRequest;
import com.cardcraft.dto.response.UserResponse;
import com.cardcraft.entity.User;
import com.cardcraft.exception.BadRequestException;
import com.cardcraft.exception.ResourceNotFoundException;
import com.cardcraft.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthService authService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
    }

    @Transactional(readOnly = true)
    public UserResponse getMe(Long userId) {
        User user = getUserEntity(userId);
        return authService.mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(Long userId, UpdateUserRequest request) {
        User user = getUserEntity(userId);
        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone());
        user.setBio(request.getBio());
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        User updated = userRepository.save(user);
        return authService.mapToUserResponse(updated);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("New passwords do not match");
        }

        User user = getUserEntity(userId);
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public User getUserEntity(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }
}
