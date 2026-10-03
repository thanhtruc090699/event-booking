package com.truc.eventbooking.auth.dto;

import com.truc.eventbooking.auth.CustomerRole;

public record MeResponse(Long customerId,
                         String email,
                         String fullName,
                         CustomerRole role) {
}
