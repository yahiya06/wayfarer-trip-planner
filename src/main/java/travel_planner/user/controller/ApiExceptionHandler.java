package travel_planner.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.RestClientException;
import travel_planner.user.service.EmailAlreadyRegisteredException;
import travel_planner.user.service.CurrentPasswordIncorrectException;
import travel_planner.user.service.PasswordTooLongException;
import travel_planner.trip.service.InvalidTripDatesException;
import travel_planner.trip.service.TripNotFoundException;
import travel_planner.trip.service.GeminiNotConfiguredException;
import travel_planner.trip.service.GeminiUnavailableException;
import travel_planner.user.service.VerificationTokenInvalidException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(EmailAlreadyRegisteredException.class)
    ProblemDetail emailAlreadyRegistered(EmailAlreadyRegisteredException exception) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, exception.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    ProblemDetail invalidCredentials(BadCredentialsException exception) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, "Email or password is incorrect.");
    }

    @ExceptionHandler(DisabledException.class)
    ProblemDetail emailNotVerified(DisabledException exception) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, "Verify your email before logging in.");
    }

    @ExceptionHandler(PasswordTooLongException.class)
    ProblemDetail passwordTooLong(PasswordTooLongException exception) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(CurrentPasswordIncorrectException.class)
    ProblemDetail currentPasswordIncorrect(CurrentPasswordIncorrectException exception) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(InvalidTripDatesException.class)
    ProblemDetail invalidTripDates(InvalidTripDatesException exception) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(TripNotFoundException.class)
    ProblemDetail tripNotFound(TripNotFoundException exception) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, exception.getMessage());
    }

    @ExceptionHandler(RestClientException.class)
    ProblemDetail citySearchUnavailable(RestClientException exception) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.SERVICE_UNAVAILABLE,
                "City search is temporarily unavailable. Please try again.");
    }

    @ExceptionHandler(GeminiNotConfiguredException.class)
    ProblemDetail geminiNotConfigured(GeminiNotConfiguredException exception) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.SERVICE_UNAVAILABLE, exception.getMessage());
    }

    @ExceptionHandler(GeminiUnavailableException.class)
    ProblemDetail geminiUnavailable(GeminiUnavailableException exception) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.SERVICE_UNAVAILABLE, exception.getMessage());
    }

    @ExceptionHandler(VerificationTokenInvalidException.class)
    ProblemDetail invalidVerificationToken(VerificationTokenInvalidException exception) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, exception.getMessage());
    }
}
