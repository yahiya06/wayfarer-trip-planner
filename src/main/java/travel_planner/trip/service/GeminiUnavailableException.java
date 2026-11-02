package travel_planner.trip.service;

public class GeminiUnavailableException extends RuntimeException {
    public GeminiUnavailableException() {
        super("AI route suggestions are temporarily unavailable. Please try again later.");
    }
}
