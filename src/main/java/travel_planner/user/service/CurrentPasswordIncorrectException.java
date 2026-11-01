package travel_planner.user.service;

public class CurrentPasswordIncorrectException extends RuntimeException {
    public CurrentPasswordIncorrectException() {
        super("The current password is incorrect.");
    }
}
