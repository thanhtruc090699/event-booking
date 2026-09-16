package com.truc.eventbooking;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EventBookingApplication {

	public static void main(String[] args) {
		loadDotenv();
		SpringApplication.run(EventBookingApplication.class, args);
	}

	private static void loadDotenv() {
		Dotenv dotenv = Dotenv.configure()
				.directory(".")
				.filename(".env")
				.load();

		dotenv.entries().forEach(entry ->
				System.setProperty(entry.getKey(), entry.getValue())
		);

		System.out.println("JWT_SECRET loaded = "
				+ (System.getProperty("JWT_SECRET") != null));
	}
}