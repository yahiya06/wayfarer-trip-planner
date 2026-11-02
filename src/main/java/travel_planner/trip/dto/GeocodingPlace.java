package travel_planner.trip.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GeocodingPlace(
        String name,
        String country,
        String admin1,
        @JsonProperty("feature_code") String featureCode,
        Integer population
) {
}
