package com.truc.eventbooking.auth;

import com.truc.eventbooking.auth.dto.*;
import com.truc.eventbooking.common.exception.BusinessConflictException;
import com.truc.eventbooking.common.exception.ForbiddenException;
import com.truc.eventbooking.common.exception.NotFoundException;
import com.truc.eventbooking.security.JWTService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class AuthService {
    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final String googleClientId;
    private final String bootstrapAdminEmail;
    private final RestClient restClient = RestClient.create();
    public AuthService(AuthRepository authRepository,
                       PasswordEncoder passwordEncoder,
                       JWTService jwtService,
                       @Value("${app.social.google.client-id}") String googleClientId,
                       @Value("${app.admin.email:}") String bootstrapAdminEmail) {
        this.authRepository = authRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.googleClientId = googleClientId;
        this.bootstrapAdminEmail = bootstrapAdminEmail;
    }

    /**
     * Bootstraps the first administrator. There is no admin UI, so the account
     * listed in app.admin.email is promoted to ADMIN on registration and on every
     * password or social login. The role then lives in the database like any other
     * assignment and can be changed with a plain UPDATE statement.
     */
    private Customer applyBootstrapAdminRole(Customer customer) {
        if (!bootstrapAdminEmail.isBlank() && customer.getRole() == CustomerRole.CUSTOMER
                && customer.getEmail().equalsIgnoreCase(bootstrapAdminEmail.trim())) {
            customer.setRole(CustomerRole.ADMIN);
            return authRepository.save(customer);
        }
        return customer;
    }

    public RegisterResponse register(RegisterRequest request) {
        if(authRepository.existsByEmail(request.email())) {
            throw new BusinessConflictException("INVALID_CREDENTIALS","Invalid email or passeord");
        }
        String passwordHash = passwordEncoder.encode(request.password());

        Customer customer = new Customer(
                request.email(),
                passwordHash,
                request.fullName()
        );
        Customer savedCustomer = applyBootstrapAdminRole(authRepository.save(customer));
        return toRegisterResponse(savedCustomer);
    }

    public LoginResponse login(LoginRequest request) {
        Customer customer = authRepository.findByEmail(request.email()).orElseThrow(
                () -> new NotFoundException("EMAIL_NOT_FOUND", "Email not found")
        );

        boolean passwordMatches = passwordEncoder.matches(
                request.password(), customer.getPasswordHash()
        );
        if(!passwordMatches) {
            throw new BusinessConflictException("PASSWORD_MISMATCH", "Password does not match");
        }
        customer = applyBootstrapAdminRole(customer);
        String accessToken = jwtService.generateToken(customer);
        String refreshToken = jwtService.generateRefreshToken(customer);
        return new LoginResponse(
                accessToken,
                refreshToken,
                "Bearer",
                jwtService.getExpirationMs() / 1000,
                jwtService.getRefreshExpirationMs() / 1000
        );
    }

    public LoginResponse socialLogin(SocialLoginRequest request) {
        Customer customer;
        switch (request.provider().toLowerCase()) {
            case "google" -> customer = verifyGoogleToken(request.token());
            default -> throw new BusinessConflictException("UNSUPPORTED_PROVIDER", "Unsupported social provider: " + request.provider());
        }
        customer = applyBootstrapAdminRole(customer);
        String accessToken = jwtService.generateToken(customer);
        String refreshToken = jwtService.generateRefreshToken(customer);
        return new LoginResponse(
                accessToken,
                refreshToken,
                "Bearer",
                jwtService.getExpirationMs() / 1000,
                jwtService.getRefreshExpirationMs() / 1000
        );
    }

    private Customer verifyGoogleToken(String idToken) {
        Map<String, Object> info;
        try {
            info = restClient.get()
                    .uri("https://oauth2.googleapis.com/tokeninfo?id_token={idToken}", idToken)
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            throw new BusinessConflictException("INVALID_SOCIAL_TOKEN", "Invalid Google token");
        }
        if (info == null || !googleClientId.equals(info.get("aud"))) {
            throw new BusinessConflictException("INVALID_SOCIAL_TOKEN", "Google token audience mismatch");
        }
        if (!Boolean.parseBoolean(String.valueOf(info.get("email_verified")))) {
            throw new BusinessConflictException("EMAIL_NOT_VERIFIED", "Google email is not verified");
        }
        String email = (String) info.get("email");
        String name = (String) info.get("name");
        String sub = String.valueOf(info.get("sub"));
        return findOrCreateCustomer(email, name, "google", sub);
    }

    private Customer findOrCreateCustomer(String email, String name, String provider, String providerId) {
        return authRepository.findByProviderAndProviderId(provider, providerId)
                .or(() -> authRepository.findByEmail(email))
                .map(customer -> {
                    if (customer.getProvider() == null) {
                        customer.setProvider(provider);
                        customer.setProviderId(providerId);
                        authRepository.save(customer);
                    }
                    return customer;
                })
                .orElseGet(() -> authRepository.save(new Customer(email, name, provider, providerId)));
    }

    public RefreshTokenResponse refreshAccessToken(String refreshToken) {
        try{
            Customer customer = authRepository.findByEmail(jwtService.extractEmail(refreshToken)).orElseThrow(()->new NotFoundException("EMAIL_NOT_FOUND", "Email not found"));
            if(!jwtService.isValidRefreshToken(refreshToken,customer)){
                throw new BusinessConflictException("INVALID_REFRESH_TOKEN","Invalid refresh token");
            }

            return new RefreshTokenResponse(jwtService.generateToken(customer));
        } catch (JwtException | IllegalArgumentException e) {
            throw new BusinessConflictException("INVALID_REFRESH_TOKEN","Invalid refresh token");
        }
    }

    public MeResponse getCurrentUser(String token) {

        try {
            String email = jwtService.extractEmail(token);

            Customer customer = authRepository.findByEmail(email).orElseThrow(()->new NotFoundException("EMAIL_NOT_FOUND", "Email not found"));

            if(!jwtService.isValidAccessToken(token, customer)) {
                throw new BusinessConflictException("INVALID_ACCESS_TOKEN","Invalid access token");
            }
            return new MeResponse(customer.getCustomerId(),
                    customer.getEmail(),
                    customer.getFullName(),
                    customer.getRole());

        } catch (JwtException | IllegalArgumentException e) {
            throw new ForbiddenException("INVALID_ACCESS_TOKEN","Invalid access token");
        }
    }

    private RefreshTokenRequest toRefreshTokenRequest(String refreshToken) {
        return new RefreshTokenRequest(refreshToken);
    }
    private RegisterResponse toRegisterResponse(Customer customer) {
        return new RegisterResponse(
                customer.getCustomerId(),
                customer.getEmail(),
                customer.getFullName()
        );
    }
    private RegisterRequest toRegisterRequest(Customer customer) {
        return new RegisterRequest(
                customer.getEmail(),
                customer.getPasswordHash(),
                customer.getFullName()
        );
    }
    private LoginRequest toLoginRequest(Customer customer) {
        return new LoginRequest(
                customer.getEmail(),
                customer.getPasswordHash()
        );
    }




}
