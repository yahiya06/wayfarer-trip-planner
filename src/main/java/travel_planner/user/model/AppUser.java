package travel_planner.user.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "app_users", uniqueConstraints = @UniqueConstraint(name = "uk_app_users_email", columnNames = "email"))
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 254)
    private String email;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified;

    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;

    @Column(name = "home_city", length = 100)
    private String homeCity;

    @Column(length = 500)
    private String bio;

    @Column(name = "preferred_budget", length = 30)
    private String preferredBudget;

    @Column(name = "travel_pace", length = 30)
    private String travelPace;

    @Column(name = "accessibility_needs", length = 500)
    private String accessibilityNeeds;

    @Column(name = "avatar_style", nullable = false, length = 20)
    private String avatarStyle = "sage";

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "user_interests", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "interest", nullable = false, length = 40)
    @OrderBy("interest ASC")
    private Set<String> interests = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected AppUser() {
    }

    public AppUser(String name, String email, String passwordHash) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getHomeCity() { return homeCity; }
    public void setHomeCity(String homeCity) { this.homeCity = homeCity; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getPreferredBudget() { return preferredBudget; }
    public void setPreferredBudget(String preferredBudget) { this.preferredBudget = preferredBudget; }
    public String getTravelPace() { return travelPace; }
    public void setTravelPace(String travelPace) { this.travelPace = travelPace; }
    public String getAccessibilityNeeds() { return accessibilityNeeds; }
    public void setAccessibilityNeeds(String accessibilityNeeds) { this.accessibilityNeeds = accessibilityNeeds; }
    public String getAvatarStyle() { return avatarStyle; }
    public void setAvatarStyle(String avatarStyle) { this.avatarStyle = avatarStyle; }
    public Set<String> getInterests() { return interests; }
    public void setInterests(Set<String> interests) { this.interests = new HashSet<>(interests); }
    public Instant getCreatedAt() { return createdAt; }
}
