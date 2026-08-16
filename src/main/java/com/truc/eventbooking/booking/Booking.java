package com.truc.eventbooking.booking;

import java.time.OffsetDateTime;

public class Booking {
    private final Long bookingID;
    private final Long reservationID;
    private final Long CustomerID;
    private final String ticketCode;
    private BookingStatus status;
    private final OffsetDateTime createdAt;
    public Booking(Long bookingID, Long reservationID, Long CustomerID, String ticketCode) {
        this.bookingID = bookingID;
        this.reservationID = reservationID;
        this.CustomerID = CustomerID;
        this.ticketCode = ticketCode;
        this.status = BookingStatus.CONFIRMED;
        this.createdAt = OffsetDateTime.now();
    }
    public Long getBookingID() {
        return bookingID;
    }
    public Long getReservationID() {
        return reservationID;
    }
    public String getTicketCode() {
        return ticketCode;
    }
    public BookingStatus getStatus() {
        return status;
    }
    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
    public Long getCustomerID() {
        return CustomerID;
    }
    public void setStatus(BookingStatus status) {
        this.status = status;
    }
}
