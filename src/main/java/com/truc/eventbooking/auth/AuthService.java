package com.truc.eventbooking.auth;

import com.truc.eventbooking.auth.dto.LoginRequest;
import com.truc.eventbooking.auth.dto.LoginResponse;
import com.truc.eventbooking.auth.dto.RegisterRequest;
import com.truc.eventbooking.auth.dto.RegisterResponse;
import com.truc.eventbooking.common.exception.BusinessConflictException;
import com.truc.eventbooking.common.exception.NotFoundException;
import com.truc.eventbooking.security.JWTService;
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
        String token = jwtService.generateToken(customer);
        return new LoginResponse(
                token,
                "Bearer",
                jwtService.getExpirationMs() / 1000
        );
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
