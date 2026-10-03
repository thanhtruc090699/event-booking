package com.truc.eventbooking;

import com.truc.eventbooking.auth.AuthService;
import com.truc.eventbooking.auth.Customer;
import com.truc.eventbooking.auth.CustomerRole;
import com.truc.eventbooking.auth.AuthRepository;
import com.truc.eventbooking.auth.dto.RegisterRequest;
import com.truc.eventbooking.security.CustomerUserPrincipal;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class CustomerRoleTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthRepository authRepository;

    @Test
    void bootstrapAdminEmailIsPromotedToAdmin() {
        String email = "test-admin@example.com";
        register(email, "StrongPass1!");

        Customer customer = authRepository.findByEmail(email).orElseThrow();

        assertEquals(CustomerRole.ADMIN, customer.getRole());
        assertEquals(Set.of("ROLE_ADMIN"), authoritiesOf(email));
    }

    @Test
    void otherCustomersStayCustomers() {
        String email = "regular-" + System.nanoTime() + "@example.com";
        register(email, "StrongPass1!");

        Customer customer = authRepository.findByEmail(email).orElseThrow();

        assertEquals(CustomerRole.CUSTOMER, customer.getRole());
        assertEquals(Set.of("ROLE_CUSTOMER"), authoritiesOf(email));
    }

    @Test
    void adminAlsoKeepsCustomerCapabilities() {
        // An admin is a superset: the authorities list carries the admin role, and
        // the admin endpoint rules are checked before the authenticated ones.
        Set<String> authorities = authoritiesOf("test-admin@example.com");
        assertTrue(authorities.contains("ROLE_ADMIN"));
        assertTrue(authorities.size() == 1, "expected a single authority, got " + authorities);
    }

    private void register(String email, String password) {
        if (authRepository.existsByEmail(email)) {
            return;
        }
        authService.register(new RegisterRequest(email, password, "Role Test"));
    }

    private Set<String> authoritiesOf(String email) {
        Customer customer = authRepository.findByEmail(email).orElseThrow();
        return new CustomerUserPrincipal(customer)
                .getAuthorities()
                .stream()
                .map(authority -> authority.getAuthority())
                .collect(Collectors.toSet());
    }
}
