package com.truc.eventbooking.config;

import com.truc.eventbooking.event.Event;
import com.truc.eventbooking.event.EventRepository;
import com.truc.eventbooking.seat.Seat;
import com.truc.eventbooking.seat.SeatRepository;
import com.truc.eventbooking.seat.SeatStatus;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;
    public DataSeeder(EventRepository eventRepository,
                      SeatRepository seatRepository) {
        this.eventRepository = eventRepository;
        this.seatRepository = seatRepository;
    }

    @Override
    public void run(String... args) {
        if(eventRepository.count() > 0) {
            return;
        }
        Event event1 = eventRepository.save(new Event(
                "Rock Concert Berlin",
                "Live concert in Berlin",
                "Berlin Arena",
                OffsetDateTime.parse("2026-09-20T19:00:00Z")
        ));

        Event event2 = eventRepository.save(new Event(
                "Tech Conference Munich",
                "Software engineering conference in Munich",
                "Munich Messe",
                OffsetDateTime.parse("2026-10-05T09:00:00Z")
        ));
        seatRepository.save(new Seat( event1,
                "A",
                "1",
                "12",
                new BigDecimal(49.99),
                SeatStatus.AVAILABLE));

        seatRepository.save(new Seat( event1,
                "A",
                "1",
                "13",
                new BigDecimal(49.99),
                SeatStatus.AVAILABLE));

        seatRepository.save(new Seat(event1,
                "A",
                "1",
                "14",
                new BigDecimal(59.99),
                SeatStatus.AVAILABLE));

        seatRepository.save(new Seat(event2,
                "B",
                "2",
                "01",
                new BigDecimal(99.00),
                SeatStatus.AVAILABLE));
    }
}
