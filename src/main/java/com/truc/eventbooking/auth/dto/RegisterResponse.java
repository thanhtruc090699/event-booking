package com.truc.eventbooking.auth.dto;

import jakarta.validation.constraints.NotNull;

public record RegisterResponse(
        @NotNull Long customerId,
        @NotNull String email,
        @NotNull String fullName

) {
}
