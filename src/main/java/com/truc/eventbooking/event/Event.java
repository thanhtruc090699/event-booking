package com.truc.eventbooking.event;

import java.time.OffsetDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "venue_name", nullable = false)
    private String venueName;

    @Column(name = "start_time", nullable = false)
    private OffsetDateTime startTime;

    protected Event() {}

    public Event(String name, String description, String venueName, OffsetDateTime startTime) {
        this.name = name;
        this.description = description;
        this.venueName = venueName;
        this.startTime = startTime;
    }
    public Long getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public String getDescription() {
        return description;
    }
    public String getVenueName() {
        return venueName;
    }
    public OffsetDateTime getStartTime() {
        return startTime;
    }

}
