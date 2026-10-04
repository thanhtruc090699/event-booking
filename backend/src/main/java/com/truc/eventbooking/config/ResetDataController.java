package com.truc.eventbooking.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class ResetDataController {

    private final DataSeeder dataSeeder;

    public ResetDataController(DataSeeder dataSeeder) {
        this.dataSeeder = dataSeeder;
    }

    @PostMapping("/reset-data")
    public ResponseEntity<String> resetData() {
        dataSeeder.resetAndSeedData();
        return ResponseEntity.ok("Data reset successfully. All events and seats have been re-seeded.");
    }
}
