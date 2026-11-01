
# AI Travel Planner — Project Instructions

## 1. Project Overview
We are building a full-stack AI Travel Planner.
Users should be able to:
- Create an account and log in securely.
- Search flights and trains between source and destination.
- Search and compare hotels.
- Get AI-powered travel recommendations.
- Chat with an AI travel assistant.
- Generate personalized travel itineraries.
- Save, edit, and manage their travel plans.

## 2. Technology Stack
- Language: Java 21
- Backend: Spring Boot
- Frontend: React (planned)
- Database: PostgreSQL
- ORM: Spring Data JPA / Hibernate
- Security: Spring Security
- AI: Spring AI
- Build Tool: Maven
- Testing: JUnit 5, Mockito
- Deployment: Docker

## 3. Architecture
- Use a layered architecture.
- Controller: Handle HTTP requests and responses.
- Service: Implement business logic.
- Repository: Handle database operations.
- Entity: Represent database tables.
- DTO: Handle API request and response data.
- Config: Application configuration.

## 4. Coding Standards
- Follow Java naming conventions.
- Write clean, readable, maintainable code.
- Apply SOLID principles where appropriate.
- Avoid unnecessary complexity.
- Avoid duplicate code.
- Use constructor injection.
- Handle exceptions properly.
- Validate incoming requests.
- Never hardcode passwords, API keys, or secrets.

## 5. AI-Assisted Development Rules
- Work on one feature at a time.
- Explain the purpose of generated classes and important methods.
- Explain important architectural decisions.
- Do not generate the entire application at once.
- Do not modify unrelated files.
- Ask before making major architectural changes.
- Do not introduce dependencies without explaining why.
- Never assume generated code is correct.

## 6. Database Rules
- Use PostgreSQL.
- Use JPA and Hibernate.
- Design proper entity relationships.
- Use database migrations when introduced.
- Keep user-specific data isolated.
- Never expose passwords or sensitive information.

## 7. Security Rules
- Hash passwords securely.
- Use Spring Security for authentication and authorization.
- Validate and sanitize user input.
- Protect user-specific APIs.
- Store secrets in environment variables.
- Never expose private user data.

## 8. Testing Rules
- Write unit tests for service-layer logic.
- Write integration tests for important APIs.
- Test successful and failure scenarios.
- Run tests after implementing features.
- Do not ignore failing tests.

## 9. Git Rules
- Use meaningful commit messages.
- Keep changes focused.
- Never commit secrets or credentials.
- Do not push changes without user approval.

## 10. Development Workflow
For every feature:
1. Understand the requirement.
2. Propose the implementation approach.
3. Identify required classes and changes.
4. Implement the feature.
5. Explain important code.
6. Write and run tests.
7. Review the implementation.
8. Summarize completed work and remaining tasks.

## 11. Important Instructions
This is a learning and portfolio project.
The developer wants to understand the complete implementation.

Prioritize understanding over speed.
Do not blindly generate code.
Do not invent flight, train, or hotel availability.
Use real provider APIs for live travel information.
Clearly distinguish AI-generated estimates from verified information.
