package com.truc.eventbooking.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, message = "Password must contain at least 8 characters")
        @Pattern(regexp = "(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).*", message = "Password must contain at least one uppercase letter and one special character")
        String password,
        @NotBlank String fullName
) {
}
