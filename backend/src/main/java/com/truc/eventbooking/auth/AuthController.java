package com.truc.eventbooking.auth;

import com.truc.eventbooking.auth.dto.*;
import com.truc.eventbooking.common.exception.ForbiddenException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
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
    public LoginResponse login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        LoginResponse loginResponse = authService.login(loginRequest);
        setRefreshTokenCookie(response, loginResponse.refreshToken());
        //Just return access token
        return new LoginResponse(loginResponse.accessToken(),
                null,
                loginResponse.tokenType(),
                loginResponse.accessTokenExpiresIn(),
                0);
    }

    @PostMapping("/social")
    public LoginResponse social(@Valid @RequestBody SocialLoginRequest socialLoginRequest, HttpServletResponse response) {
        LoginResponse loginResponse = authService.socialLogin(socialLoginRequest);
        setRefreshTokenCookie(response, loginResponse.refreshToken());
        //Just return access token
        return new LoginResponse(loginResponse.accessToken(),
                null,
                loginResponse.tokenType(),
                loginResponse.accessTokenExpiresIn(),
                0);
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        ResponseCookie refreshCookie = ResponseCookie.
                from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false) // false to allow dev localhost (Http), then changing to true when deploying https
                .path("/api/auth/refresh") // cookie will send when calling exact this endpoint
                .maxAge(Duration.ofDays(7))
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    }

    @PostMapping("/refresh")
    public RefreshTokenResponse refresh(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new ForbiddenException("MISSING_REFRESH_TOKEN", "Refresh token is missing");
        }
        return authService.refreshAccessToken(refreshToken);
    }

    @GetMapping("/me")
    public MeResponse me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ForbiddenException("AUTH_REQUIRED","Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);
        return authService.getCurrentUser(token);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletResponse response) {
        //Delete cookie refresh token
        ResponseCookie deleteCookie = ResponseCookie.
                from("refreshToken","")
                .httpOnly(true)
                .secure(false)
                .maxAge(0) //maxAge=0 ->delete cookie
                .sameSite("Strict").build();
        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());
    }
}
