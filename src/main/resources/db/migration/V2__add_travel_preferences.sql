ALTER TABLE app_users
    ADD COLUMN preferred_budget VARCHAR(30),
    ADD COLUMN travel_pace VARCHAR(30),
    ADD COLUMN accessibility_needs VARCHAR(500);
