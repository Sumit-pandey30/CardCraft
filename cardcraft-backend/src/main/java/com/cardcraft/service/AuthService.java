package com.cardcraft.service;

import com.cardcraft.dto.request.LoginRequest;
import com.cardcraft.dto.request.RefreshTokenRequest;
import com.cardcraft.dto.request.RegisterRequest;
import com.cardcraft.dto.response.AuthResponse;
import com.cardcraft.dto.response.UserResponse;
import com.cardcraft.entity.User;
import com.cardcraft.entity.UserSession;
import com.cardcraft.exception.BadRequestException;
import com.cardcraft.exception.UnauthorizedException;
import com.cardcraft.repository.UserRepository;
import com.cardcraft.repository.UserSessionRepository;
import com.cardcraft.security.JwtTokenProvider;
import com.cardcraft.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserSessionRepository sessionRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       UserSessionRepository sessionRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request, String userAgent, String ipAddress) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already registered: " + email);
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        // Always enforce default USER role for public registrations
        user.setRole("ROLE_USER");
        user.setActive(true);

        User savedUser = userRepository.save(user);
        UserPrincipal principal = UserPrincipal.create(savedUser);

        String accessToken = tokenProvider.generateAccessToken(principal);
        String refreshToken = tokenProvider.generateRefreshToken();

        saveSession(savedUser, refreshToken, userAgent, ipAddress);

        return new AuthResponse(accessToken, refreshToken, mapToUserResponse(savedUser));
    }

    @Transactional
    public AuthResponse login(LoginRequest request, String userAgent, String ipAddress) {
        String email = request.getEmail().trim().toLowerCase();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        if (!user.isActive()) {
            throw new UnauthorizedException("Account is disabled");
        }

        String accessToken = tokenProvider.generateAccessToken(principal);
        String refreshToken = tokenProvider.generateRefreshToken();

        saveSession(user, refreshToken, userAgent, ipAddress);

        return new AuthResponse(accessToken, refreshToken, mapToUserResponse(user));
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request, String userAgent, String ipAddress) {
        String tokenHash = hashToken(request.getRefreshToken());
        UserSession session = sessionRepository.findByRefreshTokenHashAndRevokedFalse(tokenHash)
                .orElseThrow(() -> new UnauthorizedException("Invalid or revoked refresh token"));

        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            session.setRevoked(true);
            sessionRepository.save(session);
            throw new UnauthorizedException("Refresh token has expired. Please sign in again");
        }

        // Revoke the old token (token rotation)
        session.setRevoked(true);
        sessionRepository.save(session);

        User user = session.getUser();
        if (!user.isActive()) {
            throw new UnauthorizedException("Account is deactivated");
        }

        UserPrincipal principal = UserPrincipal.create(user);
        String newAccessToken = tokenProvider.generateAccessToken(principal);
        String newRefreshToken = tokenProvider.generateRefreshToken();

        saveSession(user, newRefreshToken, userAgent, ipAddress);

        return new AuthResponse(newAccessToken, newRefreshToken, mapToUserResponse(user));
    }

    @Transactional
    public void logout(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            String tokenHash = hashToken(refreshToken);
            sessionRepository.findByRefreshTokenHashAndRevokedFalse(tokenHash).ifPresent(session -> {
                session.setRevoked(true);
                sessionRepository.save(session);
            });
        }
    }

    private void saveSession(User user, String refreshToken, String userAgent, String ipAddress) {
        String tokenHash = hashToken(refreshToken);
        long validitySeconds = tokenProvider.getRefreshExpirationMs() / 1000;
        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(validitySeconds);

        UserSession session = new UserSession(user, tokenHash, userAgent, ipAddress, expiresAt);
        sessionRepository.save(session);
    }

    public static String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    public UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setAvatarUrl(user.getAvatarUrl());
        response.setPhone(user.getPhone());
        response.setBio(user.getBio());
        response.setActive(user.isActive());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
