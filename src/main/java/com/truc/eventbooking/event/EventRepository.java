package com.truc.eventbooking.event;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.time.OffsetDateTime;


@Repository
public class EventRepository {
    private final List<Event> events = List.of(
            new Event(
                    1L,
                    "Rock Concert Berlin",
                    "Live concert in Berlin",
                    "Berlin Arena",
                    OffsetDateTime.parse("2026-09-20T19:00:00Z")
            ),
            new Event(
                    2L,
                    "Tech Conference Munich",
                    "Software engineering conference in Munich",
                    "Munich Messe",
                    OffsetDateTime.parse("2026-10-05T09:00:00Z")
            )
    );
    public List<Event> findAll() {
        return events;
    }
    public Optional<Event> findById(Long id) {
        return events.stream()
                .filter(event -> event.getId()==id)
                .findFirst();    }
}
