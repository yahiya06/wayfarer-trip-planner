package travel_planner.user.dto;

import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

import java.util.Set;

public record ProfileRequest(
        @Size(max = 100) String name,
        @Size(max = 100) String homeCity,
        @Size(max = 500) String bio,
        @Size(max = 30) String preferredBudget,
        @Size(max = 30) String travelPace,
        @Size(max = 500) String accessibilityNeeds,
        @Pattern(regexp = "sage|sand|rose|sky|lavender") String avatarStyle,
        @Size(max = 10) Set<@Size(max = 40) String> interests
) {
}
