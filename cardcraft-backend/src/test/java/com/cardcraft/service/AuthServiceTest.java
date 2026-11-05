package com.cardcraft.service;

import com.cardcraft.dto.request.LoginRequest;
import com.cardcraft.dto.request.RegisterRequest;
import com.cardcraft.dto.response.AuthResponse;
import com.cardcraft.entity.User;
import com.cardcraft.exception.BadRequestException;
import com.cardcraft.exception.UnauthorizedException;
import com.cardcraft.repository.UserRepository;
import com.cardcraft.repository.UserSessionRepository;
import com.cardcraft.security.JwtTokenProvider;
import com.cardcraft.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserSessionRepository sessionRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setFullName("John Doe");
        sampleUser.setEmail("john@example.com");
        sampleUser.setPasswordHash("hashed_password");
        sampleUser.setRole("ROLE_USER");
        sampleUser.setActive(true);
    }

    @Test
    @DisplayName("Should register new user successfully with ROLE_USER and hashed password")
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest("John Doe", "john@example.com", "Password123!", "Password123!");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("hashed_password");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(tokenProvider.generateAccessToken(any(UserPrincipal.class))).thenReturn("mock-access-token");
        when(tokenProvider.generateRefreshToken()).thenReturn("mock-refresh-token");
        when(tokenProvider.getRefreshExpirationMs()).thenReturn(604800000L);

        AuthResponse response = authService.register(request, "JUnit-Agent", "127.0.0.1");

        assertNotNull(response);
        assertEquals("mock-access-token", response.getAccessToken());
        assertEquals("mock-refresh-token", response.getRefreshToken());
        assertEquals("john@example.com", response.getUser().getEmail());
        assertEquals("ROLE_USER", response.getUser().getRole());
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException if passwords do not match")
    void testRegisterPasswordMismatch() {
        RegisterRequest request = new RegisterRequest("John Doe", "john@example.com", "Password123!", "Mismatch!");

        BadRequestException exception = assertThrows(BadRequestException.class, () ->
                authService.register(request, "JUnit", "127.0.0.1")
        );

        assertTrue(exception.getMessage().contains("Passwords do not match"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException if email is already taken")
    void testRegisterDuplicateEmail() {
        RegisterRequest request = new RegisterRequest("John Doe", "john@example.com", "Password123!", "Password123!");
        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        BadRequestException exception = assertThrows(BadRequestException.class, () ->
                authService.register(request, "JUnit", "127.0.0.1")
        );

        assertTrue(exception.getMessage().contains("already registered"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should authenticate user and return tokens upon valid login")
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("john@example.com", "Password123!");
        UserPrincipal principal = UserPrincipal.create(sampleUser);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(tokenProvider.generateAccessToken(any(UserPrincipal.class))).thenReturn("access-token-123");
        when(tokenProvider.generateRefreshToken()).thenReturn("refresh-token-123");
        when(tokenProvider.getRefreshExpirationMs()).thenReturn(604800000L);

        AuthResponse response = authService.login(request, "Agent", "127.0.0.1");

        assertNotNull(response);
        assertEquals("access-token-123", response.getAccessToken());
        assertEquals("john@example.com", response.getUser().getEmail());
    }

    @Test
    @DisplayName("Should fail when bad credentials are provided during login")
    void testLoginBadCredentials() {
        LoginRequest request = new LoginRequest("john@example.com", "WrongPassword");
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () ->
                authService.login(request, "Agent", "127.0.0.1")
        );
    }
}
