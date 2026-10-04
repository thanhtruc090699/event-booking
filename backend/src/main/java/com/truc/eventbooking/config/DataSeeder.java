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
                OffsetDateTime.parse("2026-09-20T19:00:00Z"),
                "Berlin",
                "Concert",
                "https://picsum.photos/seed/event-1/480/270",
                true
        ));

        Event event2 = eventRepository.save(new Event(
                "Tech Conference Munich",
                "Software engineering conference in Munich",
                "Munich Messe",
                OffsetDateTime.parse("2026-10-05T09:00:00Z"),
                "Munich",
                "Conference",
                "https://picsum.photos/seed/event-2/480/270",
                false
        ));

        Event event3 = eventRepository.save(new Event(
                "Jazz Night Hamburg",
                "Amazing jazz performance in Hamburg",
                "Hamburg Jazz Club",
                OffsetDateTime.parse("2026-09-25T20:00:00Z"),
                "Hamburg",
                "Concert",
                "https://picsum.photos/seed/event-3/480/270",
                true
        ));

        Event event4 = eventRepository.save(new Event(
                "Art Exhibition Frankfurt",
                "Modern art exhibition",
                "Frankfurt Art Museum",
                OffsetDateTime.parse("2026-11-10T10:00:00Z"),
                "Frankfurt",
                "Arts",
                "https://picsum.photos/seed/event-4/480/270",
                false
        ));

        Event event5 = eventRepository.save(new Event(
                "Food Festival Cologne",
                "International food festival",
                "Cologne City Center",
                OffsetDateTime.parse("2026-10-15T12:00:00Z"),
                "Cologne",
                "Festival",
                "https://picsum.photos/seed/event-5/480/270",
                true
        ));

        Event event6 = eventRepository.save(new Event(
                "Startup Meetup Berlin",
                "Networking event for startups",
                "Berlin Tech Hub",
                OffsetDateTime.parse("2026-09-28T18:00:00Z"),
                "Berlin",
                "Business",
                "https://picsum.photos/seed/event-6/480/270",
                false
        ));
        // Event 1: 5 rows (A-E) with 8 seats each = 40 seats total
        char[] event1Rows = {'A', 'B', 'C', 'D', 'E'};
        for(char row : event1Rows) {
            for(int seatNum = 1; seatNum <= 8; seatNum++) {
                String seatNumber = String.format("%02d", seatNum);
                BigDecimal price = row == 'A' || row == 'B' ? new BigDecimal("49.99") : new BigDecimal("39.99");
                seatRepository.save(new Seat(event1, "", String.valueOf(row), seatNumber, price, SeatStatus.AVAILABLE));
            }
        }

        // Event 2: 4 rows (A-D) with 8 seats each = 32 seats total
        char[] event2Rows = {'A', 'B', 'C', 'D'};
        for(char row : event2Rows) {
            for(int seatNum = 1; seatNum <= 8; seatNum++) {
                String seatNumber = String.format("%02d", seatNum);
                BigDecimal price = row == 'A' || row == 'B' ? new BigDecimal("120.00") : new BigDecimal("89.00");
                seatRepository.save(new Seat(event2, "", String.valueOf(row), seatNumber, price, SeatStatus.AVAILABLE));
            }
        }

        // Event 3: 5 rows (A-E) with 8 seats each = 40 seats total
        char[] event3Rows = {'A', 'B', 'C', 'D', 'E'};
        for(char row : event3Rows) {
            for(int seatNum = 1; seatNum <= 8; seatNum++) {
                String seatNumber = String.format("%02d", seatNum);
                BigDecimal price = row == 'A' || row == 'B' ? new BigDecimal("35.00") : new BigDecimal("29.99");
                seatRepository.save(new Seat(event3, "", String.valueOf(row), seatNumber, price, SeatStatus.AVAILABLE));
            }
        }

        // Event 4: 4 rows (A-D) with 8 seats each = 32 seats total
        char[] event4Rows = {'A', 'B', 'C', 'D'};
        for(char row : event4Rows) {
            for(int seatNum = 1; seatNum <= 8; seatNum++) {
                String seatNumber = String.format("%02d", seatNum);
                BigDecimal price = row == 'A' || row == 'B' ? new BigDecimal("15.00") : new BigDecimal("10.00");
                seatRepository.save(new Seat(event4, "", String.valueOf(row), seatNumber, price, SeatStatus.AVAILABLE));
            }
        }

        // Event 5: 8 rows (A-H) with 8 seats each = 64 seats total
        char[] event5Rows = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'};
        for(char row : event5Rows) {
            for(int seatNum = 1; seatNum <= 8; seatNum++) {
                String seatNumber = String.format("%02d", seatNum);
                BigDecimal price = row == 'A' || row == 'B' || row == 'C' ? new BigDecimal("25.00") : new BigDecimal("19.99");
                seatRepository.save(new Seat(event5, "", String.valueOf(row), seatNumber, price, SeatStatus.AVAILABLE));
            }
        }

        // Event 6: 3 rows (A-C) with 8 seats each = 24 seats total (Free event)
        char[] event6Rows = {'A', 'B', 'C'};
        for(char row : event6Rows) {
            for(int seatNum = 1; seatNum <= 8; seatNum++) {
                String seatNumber = String.format("%02d", seatNum);
                seatRepository.save(new Seat(event6, "", String.valueOf(row), seatNumber, BigDecimal.ZERO, SeatStatus.AVAILABLE));
            }
        }
    }
}
