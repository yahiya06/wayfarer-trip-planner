package travel_planner.trip.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import travel_planner.trip.dto.RouteSuggestionResponse;
import travel_planner.trip.dto.TripResponse;

import java.util.Map;

@Service
public class GeminiRouteSuggestionService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiRouteSuggestionService.class);
    private static final String GEMINI_API = "https://generativelanguage.googleapis.com";
    private static final String DISCLAIMER = "AI-generated route idea only. It is not checked against live transport schedules, fares, or availability. Verify all travel details with official providers.";

    private final RestClient restClient = RestClient.builder().baseUrl(GEMINI_API).build();
    private final String apiKey;
    private final String model;

    public GeminiRouteSuggestionService(
            @Value("${app.ai.gemini.api-key:}") String apiKey,
            @Value("${app.ai.gemini.model:gemini-3.8-flash}") String model
    ) {
        this.apiKey = apiKey;
        this.model = model;
    }

    public RouteSuggestionResponse suggest(TripResponse trip) {
        if (apiKey.isBlank()) {
            throw new GeminiNotConfiguredException();
        }

        String prompt = """
                You are Wayfarer, a careful travel-planning assistant. Suggest a few high-level route ideas for this trip.
                No live transport data, search tools, schedules, fares, or availability are connected.
                Do not claim that a specific flight, train, bus, route, or connection operates on these dates.
                You may mention possible transport modes or intermediate cities only as unverified ideas, and tell the traveler to check them with official providers.
                Never invent prices, departure times, journey durations, seat availability, or bookings.
                Keep the response practical and concise. Include one or two route concepts, what to verify, and a short note that these are suggestions only.

                Trip:
                Starting city: %s
                Destination: %s
                Departure date: %s
                Return date: %s
                Travelers: %d
                """.formatted(trip.source(), trip.destination(), trip.startDate(), trip.endDate(), trip.travelers());

        Map<String, Object> request = Map.of(
                "model", model,
                "input", prompt,
                "store", false
        );

        try {
            Map<String, Object> response = restClient.post()
                    .uri("/v1beta/interactions")
                    .header("x-goog-api-key", apiKey)
                    .body(request)
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {});
            return new RouteSuggestionResponse(extractText(response), DISCLAIMER);
        } catch (RestClientResponseException exception) {
            logger.warn("Gemini API returned HTTP status {}.", exception.getStatusCode().value());
            throw new GeminiUnavailableException();
        } catch (RestClientException exception) {
            logger.warn("Gemini API request failed before receiving a response ({}).",
                    exception.getClass().getSimpleName());
            throw new GeminiUnavailableException();
        }
    }

    private String extractText(Map<String, Object> response) {
        if (response == null || !"completed".equals(response.get("status"))) {
            logger.warn("Gemini API returned no completed interaction (status: {}).",
                    response == null ? "no response body" : response.get("status"));
            throw new GeminiUnavailableException();
        }
        if (!(response.get("steps") instanceof Iterable<?> steps)) {
            logger.warn("Gemini API completed response did not contain interaction steps.");
            throw new GeminiUnavailableException();
        }
        for (Object stepValue : steps) {
            if (!(stepValue instanceof Map<?, ?> step) || !"model_output".equals(step.get("type"))) continue;
            if (!(step.get("content") instanceof Iterable<?> contents)) continue;
            for (Object contentValue : contents) {
                if (contentValue instanceof Map<?, ?> content && "text".equals(content.get("type"))
                        && content.get("text") instanceof String text && !text.isBlank()) {
                    return text.trim();
                }
            }
        }
        logger.warn("Gemini API response contained no text output.");
        throw new GeminiUnavailableException();
    }
}
