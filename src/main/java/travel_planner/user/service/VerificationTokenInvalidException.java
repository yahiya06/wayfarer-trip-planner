package travel_planner.user.service;

public class VerificationTokenInvalidException extends RuntimeException {
    public VerificationTokenInvalidException() {
        super("This verification link is invalid or has expired. Request a new link and try again.");
    }
}
