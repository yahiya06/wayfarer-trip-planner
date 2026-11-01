# Wayfarer — Travel Planner

**A full-stack travel planner with secure accounts, personalized traveler profiles, saved trips, and email verification.** Built with Spring Boot, React, and PostgreSQL.

Wayfarer helps travelers keep their trip details and preferences together. The project is being built in stages: users can create and save trips today; searching live transport schedules and fares is planned for a later stage and will require real provider data.

## Current features

- Account registration, login, logout, and email verification
- Strong password checks, password changes, and account deletion
- Editable traveler profile with home city, interests, budget, travel pace, and accessibility needs
- Selectable initials avatars; profile photos are not uploaded or stored
- Light and dark themes
- Create, view, and delete saved trips
- PostgreSQL schema managed with Flyway migrations

## Technology

- **Backend:** Java 21, Spring Boot, Spring Security, Spring Data JPA, Flyway
- **Frontend:** React, Vite
- **Database:** PostgreSQL
- **Build tools:** Maven and npm

## Requirements

- JDK 21 or newer
- PostgreSQL
- Node.js and npm

## Run locally

### 1. Create the database

Create a PostgreSQL database named `travel_planner`:

```sql
CREATE DATABASE travel_planner;
```

The backend defaults to `localhost:5432`, username `postgres`, and an empty password. Override these with environment variables if your local PostgreSQL setup differs:

```powershell
$env:DB_URL = 'jdbc:postgresql://localhost:5432/travel_planner'
$env:DB_USERNAME = 'postgres'
$env:DB_PASSWORD = 'your-local-postgres-password'
```

### 2. Start the backend

From the project root, open a terminal and run:

```powershell
.\mvnw.cmd spring-boot:run
```

The API starts at `http://localhost:8080`. Flyway applies database migrations when the application starts.

### 3. Start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`. Vite proxies `/api` requests to the backend on port 8080.

## Email verification

By default, the application uses local console mode. After registration, the verification link is printed in the Spring Boot terminal; open it in a browser. Links expire after 24 hours.

For SMTP delivery, configure environment variables before starting the backend:

| Variable | Purpose |
| --- | --- |
| `EMAIL_MODE` | Set to `smtp` to send email; default is `console` |
| `MAIL_HOST` / `MAIL_PORT` | SMTP server address and port |
| `MAIL_USERNAME` / `MAIL_PASSWORD` | SMTP credentials, when required |
| `MAIL_SMTP_AUTH` | Enable SMTP authentication if required |
| `MAIL_SMTP_STARTTLS` | Enable STARTTLS if required |
| `MAIL_FROM` | Sender address |
| `FRONTEND_URL` | Public frontend URL used in verification links |

Do not commit credentials. Set them in your local environment or deployment secret manager.

## Roadmap

- Search train, bus, and flight options for a saved trip’s dates
- Show return options and compare schedules, journey times, and provider fares
- Suggest connected routes when there is no direct service
- Add itinerary planning and travel recommendations

Live schedules, availability, and fares must come from transport providers; they are not currently implemented and should not be treated as available in this application.

## Repository description

> A full-stack travel planner with secure accounts, personalized profiles, and saved trips. Built with Spring Boot, React, and PostgreSQL.
