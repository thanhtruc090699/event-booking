package com.truc.eventbooking.common.dto;

public record ErrorResponse(
        String code,
        String message
) {
}
