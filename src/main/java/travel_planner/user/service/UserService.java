package travel_planner.user.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import travel_planner.user.dto.ProfileRequest;
import travel_planner.user.dto.RegisterRequest;
import travel_planner.user.dto.UserResponse;
import travel_planner.user.model.AppUser;
import travel_planner.user.repository.AppUserRepository;

import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(AppUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AppUser register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        validatePasswordLength(request.password());
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyRegisteredException();
        }

        AppUser user = new AppUser(request.name().trim(), email, passwordEncoder.encode(request.password()));
        try {
            return userRepository.saveAndFlush(user);
        } catch (DataIntegrityViolationException exception) {
            // The database unique constraint also protects against concurrent registrations.
            throw new EmailAlreadyRegisteredException();
        }
    }

    @Transactional(readOnly = true)
    public UserResponse getProfile(String email) {
        return UserResponse.from(findByEmail(email));
    }

    @Transactional
    public UserResponse updateProfile(String email, ProfileRequest request) {
        AppUser user = findByEmail(email);
        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name().trim());
        }
        user.setHomeCity(cleanOptional(request.homeCity()));
        user.setBio(cleanOptional(request.bio()));
        user.setPreferredBudget(cleanOptional(request.preferredBudget()));
        user.setTravelPace(cleanOptional(request.travelPace()));
        user.setAccessibilityNeeds(cleanOptional(request.accessibilityNeeds()));
        if (request.avatarStyle() != null) {
            user.setAvatarStyle(request.avatarStyle());
        }
        user.setInterests(request.interests() == null ? java.util.Set.of() : request.interests());
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public Optional<AppUser> findForVerification(String email) {
        return userRepository.findByEmail(normalizeEmail(email));
    }

    @Transactional
    public void changePassword(String email, String currentPassword, String newPassword) {
        AppUser user = findByEmail(email);
        verifyCurrentPassword(user, currentPassword);
        validatePasswordLength(newPassword);
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void deleteAccount(String email, String currentPassword) {
        AppUser user = findByEmail(email);
        verifyCurrentPassword(user, currentPassword);
        userRepository.delete(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AppUser user = findByEmail(email);
        return User.withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .roles("USER")
                .disabled(!user.isEmailVerified())
                .build();
    }

    private AppUser findByEmail(String email) {
        return userRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(() -> new UsernameNotFoundException("User account was not found."));
    }

    private static String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private static String cleanOptional(String value) {
        if (value == null || value.isBlank()) return null;
        return value.trim();
    }

    private static void validatePasswordLength(String password) {
        if (password.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new PasswordTooLongException();
        }
    }

    private void verifyCurrentPassword(AppUser user, String currentPassword) {
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new CurrentPasswordIncorrectException();
        }
    }
}
