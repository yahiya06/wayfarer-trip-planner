package travel_planner.trip.service;

public class InvalidTripDatesException extends RuntimeException {
    public InvalidTripDatesException() {
        super("The return date must be the same as or later than the departure date.");
    }
}
