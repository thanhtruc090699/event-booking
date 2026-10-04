package com.truc.eventbooking.reservation;

import com.truc.eventbooking.seat.Seat;
import com.truc.eventbooking.seat.SeatService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class ReservationExpiryScheduler {
    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private SeatService seatService;

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void expireOverdueReservations() {
        //Find all active reservations which is expired
        // Each expired reservation: set status = Expired, then release seats
        for(Reservation reservation : reservationRepository.findAll()) {
            if (reservation.getStatus() == ReservationStatus.ACTIVE && reservation.getExpiryDate().isBefore(OffsetDateTime.now())) {
                for( ReservationSeat rs : reservation.getReservationSeats()){
                    seatService.releaseSeat(rs.getSeat().getSeatId());
                }
                reservation.setStatus(ReservationStatus.EXPIRED);
                reservationRepository.save(reservation);
            }
        }
    }

}
