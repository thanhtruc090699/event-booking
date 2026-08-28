package com.truc.eventbooking.seat;
import com.truc.eventbooking.event.Event;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface SeatRepository extends JpaRepository<Seat, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from Seat s where s.seatId = :seatId")
    public Optional<Seat> findByIdForUpdate(@Param("seatId") Long seatId);
    public List<Seat> findAllByEventId(Long eventId);
}
