package travel_planner.user.dto;

import travel_planner.user.model.AppUser;

import java.time.Instant;
import java.util.Set;

public record UserResponse(
        Long id,
        String name,
        String email,
        boolean emailVerified,
        String homeCity,
        String bio,
        String preferredBudget,
        String travelPace,
        String accessibilityNeeds,
        String avatarStyle,
        Set<String> interests,
        Instant createdAt
) {
    public static UserResponse from(AppUser user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.isEmailVerified(), user.getHomeCity(),
                user.getBio(), user.getPreferredBudget(), user.getTravelPace(), user.getAccessibilityNeeds(),
                user.getAvatarStyle(), Set.copyOf(user.getInterests()), user.getCreatedAt());
    }
}
