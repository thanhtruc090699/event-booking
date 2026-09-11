package com.truc.eventbooking.auth;

import com.truc.eventbooking.auth.dto.*;
import com.truc.eventbooking.common.exception.ForbiddenException;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegisterResponse register(@Valid @RequestBody RegisterRequest registerRequest) {
        return authService.register(registerRequest);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @PostMapping("/refresh")
    public RefreshTokenResponse refresh(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        return authService.refreshAccessToken(refreshTokenRequest);
    }

    @GetMapping("/me")
    public MeResponse me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ForbiddenException("AUTH_REQUIRED","Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);
        return authService.getCurrentUser(token);
    }

}
