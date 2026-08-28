package com.truc.eventbooking.reservation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    public Optional<Reservation> findBySeat_SeatId(Long seatId);

}
