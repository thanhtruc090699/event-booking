package com.truc.eventbooking.event;

import java.time.OffsetDateTime;

public class Event {
    private final Long id;
    private final String name;
    private final String description;
    private final String venueName;
    private final OffsetDateTime startTime;

    public Event(Long id, String name, String description, String venueName, OffsetDateTime startTime) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.venueName = venueName;
        this.startTime = startTime;
    }
    public long getId() {
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
