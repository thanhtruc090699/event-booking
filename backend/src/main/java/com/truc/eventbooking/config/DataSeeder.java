package com.truc.eventbooking.config;

import com.truc.eventbooking.event.Event;
import com.truc.eventbooking.event.EventRepository;
import com.truc.eventbooking.seat.Seat;
import com.truc.eventbooking.seat.SeatRepository;
import com.truc.eventbooking.seat.SeatStatus;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final int SEATS_PER_ROW = 8;

    private static final ZoneOffset SEED_ZONE = ZoneOffset.UTC;

    private static final List<EventSeed> EVENT_SEEDS = List.of(
            new EventSeed("Rock Concert Berlin", "Live concert in Berlin", "Berlin Arena",
                    5, 19, "Berlin", "Concert", 1, true,
                    5, 2, new BigDecimal("49.99"), new BigDecimal("39.99")),
            new EventSeed("Startup Meetup Berlin", "Networking event for startups", "Berlin Tech Hub",
                    8, 18, "Berlin", "Business", 6, false,
                    3, 2, BigDecimal.ZERO, BigDecimal.ZERO),
            new EventSeed("Jazz Night Hamburg", "Amazing jazz performance in Hamburg", "Hamburg Jazz Club",
                    12, 20, "Hamburg", "Concert", 3, true,
                    5, 2, new BigDecimal("35.00"), new BigDecimal("29.99")),
            new EventSeed("Tech Conference Munich", "Software engineering conference in Munich", "Munich Messe",
                    19, 9, "Munich", "Conference", 2, false,
                    4, 2, new BigDecimal("120.00"), new BigDecimal("89.00")),
            new EventSeed("Food Festival Cologne", "International food festival", "Cologne City Center",
                    26, 12, "Cologne", "Festival", 5, true,
                    8, 3, new BigDecimal("25.00"), new BigDecimal("19.99")),
            new EventSeed("Art Exhibition Frankfurt", "Modern art exhibition", "Frankfurt Art Museum",
                    40, 10, "Frankfurt", "Arts", 4, false,
                    4, 2, new BigDecimal("15.00"), new BigDecimal("10.00"))
    );

    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;

    public DataSeeder(EventRepository eventRepository,
                      SeatRepository seatRepository) {
        this.eventRepository = eventRepository;
        this.seatRepository = seatRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (eventRepository.count() > 0) {
            return;
        }
        OffsetDateTime seedBase = OffsetDateTime.now(SEED_ZONE).withMinute(0).withSecond(0).withNano(0);
        for (EventSeed seed : EVENT_SEEDS) {
            OffsetDateTime startTime = seedBase.plusDays(seed.daysFromNow()).withHour(seed.hourOfDay());
            Event event = eventRepository.save(new Event(
                    seed.name(),
                    seed.description(),
                    seed.venue(),
                    startTime,
                    seed.city(),
                    seed.category(),
                    "https://picsum.photos/seed/event-" + seed.imageSeed() + "/480/270",
                    seed.hot()
            ));
            createSeats(event, seed);
        }
    }

    private void createSeats(Event event, EventSeed seed) {
        for (int rowIndex = 0; rowIndex < seed.rowCount(); rowIndex++) {
            char rowLabel = (char) ('A' + rowIndex);
            BigDecimal price = rowIndex < seed.premiumRowCount() ? seed.premiumPrice() : seed.standardPrice();
            for (int seatNumber = 1; seatNumber <= SEATS_PER_ROW; seatNumber++) {
                seatRepository.save(new Seat(event, "", String.valueOf(rowLabel),
                        String.format("%02d", seatNumber), price, SeatStatus.AVAILABLE));
            }
        }
    }

    private record EventSeed(
            String name,
            String description,
            String venue,
            int daysFromNow,
            int hourOfDay,
            String city,
            String category,
            int imageSeed,
            boolean hot,
            int rowCount,
            int premiumRowCount,
            BigDecimal premiumPrice,
            BigDecimal standardPrice
    ) {
    }
}