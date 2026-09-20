package com.truc.eventbooking.payment;

import com.truc.eventbooking.reservation.Reservation;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private  PaymentProviderType provider;

    private String providerOrderId;

    private  String providerCaptureId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    protected Payment() {}

    public Payment(Reservation reservation,
                   PaymentProviderType provider,
                   BigDecimal amount,
                   String currency) {
        this.reservation = reservation;
        this.provider = provider;
        this.amount = amount;
        this.currency = currency;
        this.status = PaymentStatus.PENDING;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    public Long getId() {
        return id;
    }
    public Reservation getReservation() {
        return reservation;
    }
    public PaymentProviderType getProvider() {
        return provider;
    }
    public String getProviderOrderId() {
        return providerOrderId;
    }
    public String getProviderCaptureId() {
        return providerCaptureId;
    }
    public BigDecimal getAmount() {
        return amount;
    }
    public String getCurrency() {
        return currency;
    }
    public PaymentStatus getStatus() {
        return status;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public PaymentStatus setStatus(PaymentStatus status) {
        this.updatedAt = LocalDateTime.now();
        return this.status = status;
    }
    public void setProviderOrderId(String providerOrderId) {
        this.providerOrderId = providerOrderId;
    }

    public void setProviderCaptureId(String providerCaptureId) {
        this.providerCaptureId = providerCaptureId;
    }

}
