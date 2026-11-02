package travel_planner.trip.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GeocodingSearchResponse(List<GeocodingPlace> results) {
}
