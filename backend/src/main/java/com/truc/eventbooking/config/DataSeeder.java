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
        for(int i = 1; i <= 50; i++) {
            String row = i <= 25 ? "A" : "B";
            String block = i <= 25 ? "1" : "2";
            String number = String.format("%02d", i % 25 + 1);
            BigDecimal price = i <= 25 ? new BigDecimal(49.99) : new BigDecimal(39.99);
            seatRepository.save(new Seat(event1, row, block, number, price, SeatStatus.AVAILABLE));
        }

        for(int i = 1; i <= 30; i++) {
            String row = i <= 15 ? "A" : "B";
            String block = i <= 15 ? "1" : "2";
            String number = String.format("%02d", i % 15 + 1);
            BigDecimal price = i <= 15 ? new BigDecimal(120.00) : new BigDecimal(89.00);
            seatRepository.save(new Seat(event2, row, block, number, price, SeatStatus.AVAILABLE));
        }

        for(int i = 1; i <= 40; i++) {
            String row = i <= 20 ? "A" : "B";
            String block = i <= 20 ? "1" : "2";
            String number = String.format("%02d", i % 20 + 1);
            BigDecimal price = i <= 20 ? new BigDecimal(35.00) : new BigDecimal(29.99);
            seatRepository.save(new Seat(event3, row, block, number, price, SeatStatus.AVAILABLE));
        }

        for(int i = 1; i <= 25; i++) {
            String row = i <= 12 ? "A" : "B";
            String block = i <= 12 ? "1" : "2";
            String number = String.format("%02d", i % 12 + 1);
            BigDecimal price = i <= 12 ? new BigDecimal(15.00) : new BigDecimal(10.00);
            seatRepository.save(new Seat(event4, row, block, number, price, SeatStatus.AVAILABLE));
        }

        for(int i = 1; i <= 60; i++) {
            String row = i <= 30 ? "A" : "B";
            String block = i <= 30 ? "1" : "2";
            String number = String.format("%02d", i % 30 + 1);
            BigDecimal price = i <= 30 ? new BigDecimal(25.00) : new BigDecimal(19.99);
            seatRepository.save(new Seat(event5, row, block, number, price, SeatStatus.AVAILABLE));
        }

        for(int i = 1; i <= 20; i++) {
            String row = "A";
            String block = "1";
            String number = String.format("%02d", i);
            BigDecimal price = new BigDecimal(0.00);
            seatRepository.save(new Seat(event6, row, block, number, price, SeatStatus.AVAILABLE));
        }
    }
}
