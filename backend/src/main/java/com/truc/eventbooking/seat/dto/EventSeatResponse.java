package com.truc.eventbooking.seat.dto;

import com.truc.eventbooking.seat.SeatStatus;

import java.math.BigDecimal;

public record EventSeatResponse (
        Long id,
        String section,
        String rowLabel,
        String seatNumber,
        BigDecimal price,
        SeatStatus status){
}
