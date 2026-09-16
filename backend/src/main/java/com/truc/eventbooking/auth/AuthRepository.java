package com.truc.eventbooking.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(String email);
    Optional<Customer> findByProviderAndProviderId(String provider, String providerId);
    Boolean existsByEmail(String email);
}
