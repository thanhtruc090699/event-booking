package com.truc.eventbooking.seat;
import com.truc.eventbooking.event.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;


public interface SeatRepository extends JpaRepository<Seat, Long> {

    public List<Seat> findAllByEventId(Long eventId);
}
