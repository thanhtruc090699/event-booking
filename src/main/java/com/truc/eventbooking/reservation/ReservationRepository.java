package com.truc.eventbooking.reservation;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class ReservationRepository {
    private final List<Reservation> reservations = new ArrayList<Reservation>();
    private final AtomicLong idGenerator = new AtomicLong(5000L);

    public List<Reservation> findAll() {
        return reservations;
    }
    public Optional<Reservation> findByReservationId(Long reservationId) {
        return reservations.stream().filter(reservation -> reservation.getReservationId().equals(reservationId)).findFirst();
    }
    public Optional<Reservation> findBySeatId(Long seatId) {
        return reservations.stream().filter(reservation -> reservation.getSeatId().equals(seatId)).findFirst();
    }
    public Reservation save(Long seatId, Long customerId) {
        Long reservationId = idGenerator.incrementAndGet();
        Reservation reservation = new Reservation(reservationId, seatId, customerId);
        reservations.add(reservation);
        return reservation;
    }

}
