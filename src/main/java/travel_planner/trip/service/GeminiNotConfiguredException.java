package travel_planner.trip.service;

public class GeminiNotConfiguredException extends RuntimeException {
    public GeminiNotConfiguredException() {
        super("AI route suggestions are not configured yet.");
    }
}
