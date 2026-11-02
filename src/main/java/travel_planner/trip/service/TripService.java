package travel_planner.trip.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import travel_planner.trip.dto.CreateTripRequest;
import travel_planner.trip.dto.TripResponse;
import travel_planner.trip.model.TravelTrip;
import travel_planner.trip.repository.TravelTripRepository;
import travel_planner.user.model.AppUser;
import travel_planner.user.repository.AppUserRepository;

import java.util.List;

@Service
public class TripService {

    private final TravelTripRepository tripRepository;
    private final AppUserRepository userRepository;

    public TripService(TravelTripRepository tripRepository, AppUserRepository userRepository) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TripResponse create(String email, CreateTripRequest request) {
        if (request.endDate().isBefore(request.startDate())) {
            throw new InvalidTripDatesException();
        }
        AppUser owner = findOwner(email);
        TravelTrip trip = new TravelTrip(owner, request.source().trim(), request.destination().trim(),
                request.startDate(), request.endDate(), request.travelers());
        return TripResponse.from(tripRepository.save(trip));
    }

    @Transactional(readOnly = true)
    public List<TripResponse> getMine(String email) {
        AppUser owner = findOwner(email);
        return tripRepository.findAllByUser_IdOrderByCreatedAtDesc(owner.getId()).stream()
                .map(TripResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public TripResponse getMine(String email, Long tripId) {
        AppUser owner = findOwner(email);
        TravelTrip trip = tripRepository.findByIdAndUser_Id(tripId, owner.getId())
                .orElseThrow(TripNotFoundException::new);
        return TripResponse.from(trip);
    }

    @Transactional
    public void delete(String email, Long tripId) {
        AppUser owner = findOwner(email);
        TravelTrip trip = tripRepository.findByIdAndUser_Id(tripId, owner.getId())
                .orElseThrow(TripNotFoundException::new);
        tripRepository.delete(trip);
    }

    private AppUser findOwner(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Authenticated account was not found."));
    }
}
