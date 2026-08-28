package com.truc.eventbooking.security;

import com.truc.eventbooking.auth.Customer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomerUserPrincipal implements UserDetails {
    private final Long customerId;
    private final String email;
    private final String fullName;
    private final String passwordHash;
    public CustomerUserPrincipal(Customer customer) {
        this.customerId = customer.getCustomerId();
        this.email = customer.getEmail();
        this.fullName = customer.getFullName();
        this.passwordHash = customer.getPasswordHash();
    }
    public Long getCustomerId() {
        return customerId;
    }
    public String getEmail() {
        return email;
    }
    public String getFullName() {
        return fullName;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }



}
