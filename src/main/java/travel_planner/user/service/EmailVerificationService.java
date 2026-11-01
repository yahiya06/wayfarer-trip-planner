package travel_planner.user.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import travel_planner.user.model.AppUser;
import travel_planner.user.model.EmailVerificationToken;
import travel_planner.user.repository.EmailVerificationTokenRepository;
import travel_planner.user.repository.AppUserRepository;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class EmailVerificationService {

    private static final Duration TOKEN_LIFETIME = Duration.ofHours(24);
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final EmailVerificationTokenRepository tokenRepository;
    private final AppUserRepository userRepository;

    public EmailVerificationService(EmailVerificationTokenRepository tokenRepository,
                                    AppUserRepository userRepository) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public String issue(AppUser user) {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        tokenRepository.deleteByUser_Id(user.getId());
        tokenRepository.save(new EmailVerificationToken(user, hash(rawToken), Instant.now().plus(TOKEN_LIFETIME)));
        return rawToken;
    }

    @Transactional
    public String verify(String rawToken) {
        EmailVerificationToken verificationToken = tokenRepository.findByTokenHash(hash(rawToken))
                .orElseThrow(VerificationTokenInvalidException::new);
        if (verificationToken.getExpiresAt().isBefore(Instant.now())) {
            throw new VerificationTokenInvalidException();
        }

        AppUser user = userRepository.findById(verificationToken.getUser().getId())
                .orElseThrow(VerificationTokenInvalidException::new);
        user.setEmailVerified(true);
        tokenRepository.delete(verificationToken);
        return user.getEmail();
    }

    private static String hash(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable.", exception);
        }
    }
}
