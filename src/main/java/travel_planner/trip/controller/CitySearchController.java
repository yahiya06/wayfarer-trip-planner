package travel_planner.trip.controller;

import jakarta.validation.constraints.Size;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import travel_planner.trip.dto.CitySuggestion;
import travel_planner.trip.service.CitySearchService;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/locations")
public class CitySearchController {

    private final CitySearchService citySearchService;

    public CitySearchController(CitySearchService citySearchService) {
        this.citySearchService = citySearchService;
    }

    @GetMapping("/search")
    public List<CitySuggestion> search(@RequestParam("q") @Size(min = 3, max = 100) String query) {
        return citySearchService.search(query);
    }
}
