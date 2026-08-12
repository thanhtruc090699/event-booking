package com.truc.eventbooking.seat.dto;

import com.truc.eventbooking.seat.SeatStatus;

public record EventSeatResponse (
        Long seatId,
        String section,
        String rowLabel,
        String seatNumber,
        Double seatPrice,
        SeatStatus seatStatus){
}
