package travel_planner.trip.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriBuilder;
import travel_planner.trip.dto.CitySuggestion;
import travel_planner.trip.dto.GeocodingPlace;
import travel_planner.trip.dto.GeocodingSearchResponse;

import java.util.List;

@Service
public class CitySearchService {

    private static final String GEOCODING_API = "https://geocoding-api.open-meteo.com";
    private final RestClient restClient = RestClient.builder().baseUrl(GEOCODING_API).build();

    public List<CitySuggestion> search(String query) {
        String normalizedQuery = query == null ? "" : query.trim();
        if (normalizedQuery.length() < 3) {
            return List.of();
        }

        GeocodingSearchResponse response = restClient.get()
                .uri(uriBuilder -> buildSearchUri(uriBuilder, normalizedQuery))
                .retrieve()
                .body(GeocodingSearchResponse.class);

        if (response == null || response.results() == null) {
            return List.of();
        }
        return response.results().stream()
                .filter(place -> place.name() != null && place.country() != null)
                .map(CitySearchService::toSuggestion)
                .toList();
    }

    private static java.net.URI buildSearchUri(UriBuilder uriBuilder, String query) {
        return uriBuilder.path("/v1/search")
                .queryParam("name", query)
                .queryParam("count", 100)
                .queryParam("language", "en")
                .queryParam("format", "json")
                .build();
    }

    private static CitySuggestion toSuggestion(GeocodingPlace place) {
        String region = place.admin1();
        String label = place.name();
        if (region != null && !region.isBlank() && !region.equalsIgnoreCase(place.name())) {
            label += ", " + region;
        }
        label += ", " + place.country();
        return new CitySuggestion(place.name(), region, place.country(), label);
    }
}
