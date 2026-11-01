package travel_planner.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import travel_planner.user.model.EmailVerificationToken;

import java.util.Optional;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {
    Optional<EmailVerificationToken> findByTokenHash(String tokenHash);
    void deleteByUser_Id(Long userId);
}
