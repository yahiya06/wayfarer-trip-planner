package travel_planner.trip.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import travel_planner.trip.dto.CreateTripRequest;
import travel_planner.trip.dto.TripResponse;
import travel_planner.trip.service.TripService;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TripResponse createTrip(Authentication authentication,
                                   @Valid @RequestBody CreateTripRequest request) {
        return tripService.create(authentication.getName(), request);
    }

    @GetMapping
    public List<TripResponse> myTrips(Authentication authentication) {
        return tripService.getMine(authentication.getName());
    }

    @DeleteMapping("/{tripId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTrip(Authentication authentication, @PathVariable Long tripId) {
        tripService.delete(authentication.getName(), tripId);
    }
}
