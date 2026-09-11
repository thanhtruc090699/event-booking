package com.truc.eventbooking.auth.dto;

public record MeResponse(Long customerId,
                         String email,
                         String fullName) {
}
