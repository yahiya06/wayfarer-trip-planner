package travel_planner.trip.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CreateTripRequest(
        @NotBlank @Size(max = 100) String source,
        @NotBlank @Size(max = 100) String destination,
        @NotNull @FutureOrPresent LocalDate startDate,
        @NotNull @FutureOrPresent LocalDate endDate,
        @Min(1) @Max(20) int travelers
) {
}
