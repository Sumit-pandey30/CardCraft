package com.cardcraft.controller;

import com.cardcraft.dto.request.LoginRequest;
import com.cardcraft.dto.request.RefreshTokenRequest;
import com.cardcraft.dto.request.RegisterRequest;
import com.cardcraft.dto.response.ApiResponse;
import com.cardcraft.dto.response.AuthResponse;
import com.cardcraft.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request,
                                                              HttpServletRequest httpRequest) {
        String userAgent = httpRequest.getHeader("User-Agent");
        String ip = getClientIp(httpRequest);
        AuthResponse response = authService.register(request, userAgent, ip);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("User registered successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request,
                                                           HttpServletRequest httpRequest) {
        String userAgent = httpRequest.getHeader("User-Agent");
        String ip = getClientIp(httpRequest);
        AuthResponse response = authService.login(request, userAgent, ip);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@Valid @RequestBody RefreshTokenRequest request,
                                                             HttpServletRequest httpRequest) {
        String userAgent = httpRequest.getHeader("User-Agent");
        String ip = getClientIp(httpRequest);
        AuthResponse response = authService.refreshToken(request, userAgent, ip);
        return ResponseEntity.ok(ApiResponse.ok("Token refreshed successfully", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestBody(required = false) RefreshTokenRequest request) {
        if (request != null) {
            authService.logout(request.getRefreshToken());
        }
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully", null));
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
