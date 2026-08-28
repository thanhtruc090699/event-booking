package com.truc.eventbooking.seat.dto;

import com.truc.eventbooking.seat.SeatStatus;

import java.math.BigDecimal;

public record EventSeatResponse (
        Long seatId,
        String section,
        String rowLabel,
        String seatNumber,
        BigDecimal seatPrice,
        SeatStatus seatStatus){
}
