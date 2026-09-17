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

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String category;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private boolean hot;

    protected Event() {}

    public Event(String name, String description, String venueName, OffsetDateTime startTime, String city, String category, String imageUrl, boolean hot) {
        this.name = name;
        this.description = description;
        this.venueName = venueName;
        this.startTime = startTime;
        this.city = city;
        this.category = category;
        this.imageUrl = imageUrl;
        this.hot = hot;
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
    public String getCity() {
        return city;
    }
    public String getCategory() {
        return category;
    }
    public String getImageUrl() {
        return imageUrl;
    }
    public boolean isHot() {
        return hot;
    }

}
