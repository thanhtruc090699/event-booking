package com.truc.eventbooking.reservation;

import java.time.OffsetDateTime;

public class Reservation {
    private final Long reservationId;
    private final Long seatId;
    private final Long CustomerId;
    private ReservationStatus status;
    private final OffsetDateTime reservedAt;
    private final OffsetDateTime expiryDate;

    public Reservation(Long reservationId, Long seatId, Long CustomerId) {
        this.reservationId = reservationId;
        this.seatId = seatId;
        this.CustomerId = CustomerId;
        this.status = ReservationStatus.ACTIVE;
        this.expiryDate = OffsetDateTime.now().plusDays(5);
        this.reservedAt = OffsetDateTime.now();
    }

    public Long getReservationId() {
        return reservationId;
    }
    public Long getSeatId() {
        return seatId;
    }
    public Long getCustomerId() {
        return CustomerId;
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
