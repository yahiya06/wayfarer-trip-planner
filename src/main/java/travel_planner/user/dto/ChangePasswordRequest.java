package travel_planner.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import travel_planner.user.validation.StrongPassword;

public record ChangePasswordRequest(
        @NotBlank @Size(max = 72) String currentPassword,
        @NotBlank @Size(max = 72) @StrongPassword String newPassword
) {
}
