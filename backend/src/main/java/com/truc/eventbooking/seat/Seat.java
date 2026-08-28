package com.truc.eventbooking.seat;

import com.truc.eventbooking.event.Event;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name="event_seats")
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id")
    private Long seatId;

    @ManyToOne(optional=false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false)
    private String section;

    @Column(name = "row_label", nullable = false)
    private String rowLabel;

    @Column(name = "seat_number", nullable = false)
    private String seatNumber;

    @Column(name = "seat_price", nullable = false)
    private BigDecimal seatPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "seat_status", nullable = false)
    private SeatStatus seatStatus;

    protected Seat() {}

    public Seat (Event event, String section, String rowLabel, String seatNumber, BigDecimal seatPrice, SeatStatus status) {
        this.event = event;
        this.section = section;
        this.rowLabel = rowLabel;
        this.seatNumber = seatNumber;
        this.seatPrice = seatPrice;
        this.seatStatus = status;
    }
    public Event getEvent() {
        return event;
    }
    public Long getSeatId() {
        return seatId;
    }
    public String getSection() {
        return section;
    }
    public String getRowLabel() {
        return rowLabel;
    }
    public String getSeatNumber() {
        return seatNumber;
    }
    public BigDecimal getSeatPrice() {
        return seatPrice;
    }
    public SeatStatus getSeatStatus() {
        return seatStatus;
    }
    public void setSeatStatus(SeatStatus seatStatus) {
        this.seatStatus = seatStatus;
    }



}
