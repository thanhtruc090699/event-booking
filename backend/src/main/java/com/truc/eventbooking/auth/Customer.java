package com.truc.eventbooking.auth;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Entity
@Table(name="customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="customer_id")
    private Long customerId;

    @Column(name = "email",nullable = false, unique = true)
    private String email;

    @Column(name="password_hash",nullable = false)
    private String passwordHash;

    @Column(name = "full_name",nullable = false)
    private String fullName;

    @Column(name = "created_at",nullable = false,updatable = false)
    private OffsetDateTime createdAt;

    protected Customer() {}
    public Customer(String email, String passwordHash, String fullName) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.createdAt = OffsetDateTime.now();
    }
    public Long getCustomerId() {
        return customerId;
    }
    public String getEmail() {
        return email;
    }
    public String getPasswordHash() {
        return passwordHash;
    }
    public String getFullName() {
        return fullName;
    }
    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}
