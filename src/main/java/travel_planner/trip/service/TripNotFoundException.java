package travel_planner.trip.service;

public class TripNotFoundException extends RuntimeException {
    public TripNotFoundException() {
        super("Trip was not found.");
    }
}
