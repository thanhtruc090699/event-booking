package com.truc.eventbooking.seat;

import com.truc.eventbooking.event.Event;

public class Seat {
    private final Long eventId;
    private final Long seatId;
    private final String section;
    private final String rowLabel;
    private final String seatNumber;
    private final Double seatPrice;
    private final SeatStatus seatStatus;

    public Seat (Long eventId, Long seatId, String section, String rowLabel, String seatNumber, Double seatPrice, SeatStatus status) {
        this.eventId = eventId;
        this.seatId = seatId;
        this.section = section;
        this.rowLabel = rowLabel;
        this.seatNumber = seatNumber;
        this.seatPrice = seatPrice;
        this.seatStatus = status;
    }
    public Long getEventId() {
        return eventId;
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
    public Double getSeatPrice() {
        return seatPrice;
    }
    public SeatStatus getSeatStatus() {
        return seatStatus;
    }
    public void setSeatStatus(SeatStatus seatStatus) {
        seatStatus = seatStatus;
    }



}
