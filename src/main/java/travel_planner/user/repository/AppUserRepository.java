package travel_planner.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import travel_planner.user.model.AppUser;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);
    boolean existsByEmail(String email);
}
