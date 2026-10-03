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

    @Column(name="password_hash")
    private String passwordHash;

    @Column(name = "full_name",nullable = false)
    private String fullName;

    @Column(name = "provider")
    private String provider;

    @Column(name = "provider_id")
    private String providerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, columnDefinition = "varchar(32) not null default 'CUSTOMER'")
    private CustomerRole role = CustomerRole.CUSTOMER;

    @Column(name = "created_at",nullable = false,updatable = false)
    private OffsetDateTime createdAt;

    protected Customer() {}
    public Customer(String email, String passwordHash, String fullName) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.createdAt = OffsetDateTime.now();
    }
    public Customer(String email, String fullName, String provider, String providerId) {
        this.email = email;
        this.fullName = fullName;
        this.provider = provider;
        this.providerId = providerId;
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
    public String getProvider() {
        return provider;
    }
    public String getProviderId() {
        return providerId;
    }
    public void setProvider(String provider) {
        this.provider = provider;
    }
    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }
    public CustomerRole getRole() {
        return role;
    }
    public void setRole(CustomerRole role) {
        this.role = role;
    }
    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}
