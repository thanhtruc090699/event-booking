package com.truc.eventbooking.auth;

import com.truc.eventbooking.auth.dto.*;
import com.truc.eventbooking.common.exception.BusinessConflictException;
import com.truc.eventbooking.common.exception.ForbiddenException;
import com.truc.eventbooking.common.exception.NotFoundException;
import com.truc.eventbooking.security.JWTService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    public AuthService(AuthRepository authRepository,
                       PasswordEncoder passwordEncoder,
                       JWTService jwtService) {
        this.authRepository = authRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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
        Customer savedCustomer = authRepository.save(customer);
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
                    customer.getFullName());

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
