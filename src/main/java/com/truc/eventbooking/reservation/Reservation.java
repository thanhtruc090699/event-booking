package com.truc.eventbooking.reservation;

import com.truc.eventbooking.auth.Customer;
import com.truc.eventbooking.seat.Seat;
import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Entity
@Table(name="reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Long reservationId;

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name="seat_id",nullable = false,unique = true)
    private Seat seat;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id",nullable = false)
    private Customer customer;

    @Enumerated(EnumType.STRING)
    @Column(name = "reservation_status",nullable = false, updatable = false)
    private ReservationStatus status;

    @Column(name = "reserved_at", nullable = false, updatable = false)
    private OffsetDateTime reservedAt;

    @Column(nullable = false)
    private OffsetDateTime expiryDate;

    protected Reservation(){}

    public Reservation(Seat seat, Customer customer) {
        this.seat = seat;
        this.customer = customer;
        this.status = ReservationStatus.ACTIVE;
        this.expiryDate = OffsetDateTime.now().plusMinutes(5);
        this.reservedAt = OffsetDateTime.now();
    }

    public Long getReservationId() {
        return reservationId;
    }
    public Seat getSeat() {
        return seat;
    }
    public Customer getCustomer() {
        return customer;
    }
    public ReservationStatus getStatus() {
        return status;
    }
    public OffsetDateTime getExpiryDate() {
        return expiryDate;
    }
    public OffsetDateTime getReservedAt() {
        return reservedAt;
    }
    public void setStatus(ReservationStatus status) {
        this.status = status;
    }

}
