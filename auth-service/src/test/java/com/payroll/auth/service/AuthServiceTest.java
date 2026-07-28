package com.payroll.auth.service;

import com.payroll.auth.dto.AuthRequest;
import com.payroll.auth.dto.AuthResponse;
import com.payroll.auth.dto.RegisterRequest;
import com.payroll.auth.entity.User;
import com.payroll.auth.exception.InvalidCredentialsException;
import com.payroll.auth.repository.UserRepository;
import com.payroll.auth.security.JwtUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;

import java.util.Optional;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.core.context.SecurityContextHolder.getContext;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private AuthRequest authRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setUsername("admin");
        registerRequest.setPassword("password");
        registerRequest.setEmail("admin@example.com");
        registerRequest.setRoles(Set.of("ADMIN"));

        authRequest = new AuthRequest();
        authRequest.setUsername("admin");
        authRequest.setPassword("password");
    }

    @Test
    void register_DuplicateUsername_ThrowsException() {
        when(userRepository.existsByUsername("admin")).thenReturn(true);
        Assertions.assertThrows(RuntimeException.class, () -> authService.register(registerRequest));
    }

    @Test
    void login_UserNotFound_ThrowsException() {
        when(userRepository.findByUsernameOrEmail("admin", "admin")).thenReturn(Optional.empty());
        Assertions.assertThrows(InvalidCredentialsException.class, () -> authService.login(authRequest));
    }

    @Test
    void login_InvalidPassword_ThrowsException() {
        User user = new User();
        user.setUsername("admin");
        user.setPassword("encodedPassword");
        user.setActive(true);

        when(userRepository.findByUsernameOrEmail("admin", "admin")).thenReturn(Optional.of(user));
        Assertions.assertThrows(InvalidCredentialsException.class, () -> authService.login(authRequest));
    }

    @Test
    void login_WithValidAuthentication_ReturnsResponse() {
        User user = new User();
        user.setUsername("admin");
        user.setPassword("encodedPassword");
        user.setActive(true);

        when(userRepository.findByUsernameOrEmail("admin", "admin")).thenReturn(Optional.of(user));
        org.springframework.security.core.Authentication auth = org.mockito.Mockito.mock(org.springframework.security.core.Authentication.class);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(auth.isAuthenticated()).thenReturn(true);
        when(jwtUtil.generateToken("admin", any(java.util.List.class))).thenReturn("jwt-token");

        AuthResponse response = authService.login(authRequest);

        Assertions.assertNotNull(response);
        Assertions.assertEquals("jwt-token", response.getToken());
    }
}
