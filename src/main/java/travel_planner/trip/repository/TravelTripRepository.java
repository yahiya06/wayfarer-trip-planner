package travel_planner.trip.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import travel_planner.trip.model.TravelTrip;

import java.util.List;
import java.util.Optional;

public interface TravelTripRepository extends JpaRepository<TravelTrip, Long> {
    List<TravelTrip> findAllByUser_IdOrderByCreatedAtDesc(Long userId);
    Optional<TravelTrip> findByIdAndUser_Id(Long id, Long userId);
}
