package com.truc.eventbooking.booking;

import java.time.OffsetDateTime;

import com.truc.eventbooking.reservation.Reservation;
import jakarta.persistence.*;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingID;

    @OneToOne(optional = false)
    @JoinColumn(name="reservation_id",nullable = false,unique = true)
    private Reservation reservation;

    @Column(name="customer_id",nullable = false)
    private Long CustomerID;

    @Column(name = "ticket_code",nullable = false)
    private String ticketCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status",nullable = false)
    private BookingStatus status;

    @Column(name = "created_at",nullable = false,updatable = false)
    private OffsetDateTime createdAt;

    protected Booking() {}
    public Booking(Reservation reservation, Long CustomerID, String ticketCode) {
        this.reservation = reservation;
        this.CustomerID = CustomerID;
        this.ticketCode = ticketCode;
        this.status = BookingStatus.CONFIRMED;
        this.createdAt = OffsetDateTime.now();
    }
    public Long getBookingID() {
        return bookingID;
    }
    public Reservation getReservation() {
        return reservation;
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
