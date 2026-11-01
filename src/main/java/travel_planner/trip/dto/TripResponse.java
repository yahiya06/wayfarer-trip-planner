package travel_planner.trip.dto;

import travel_planner.trip.model.TravelTrip;

import java.time.Instant;
import java.time.LocalDate;

public record TripResponse(
        Long id,
        String source,
        String destination,
        LocalDate startDate,
        LocalDate endDate,
        int travelers,
        Instant createdAt
) {
    public static TripResponse from(TravelTrip trip) {
        return new TripResponse(trip.getId(), trip.getSource(), trip.getDestination(), trip.getStartDate(),
                trip.getEndDate(), trip.getTravelers(), trip.getCreatedAt());
    }
}
