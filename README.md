# UserDirectory

This repository contains a simple User Directory web application with:

- Backend: ASP.NET Core Web API (C#) using Entity Framework Core with SQLite
- Frontend: React + TypeScript (Vite)
- Authentication: Auth0 (JWT)

This repo has been refactored for clarity, maintainability, and testability. The main improvements include:

- Centralized configuration and environment variable support
- Service layer (IUserService/UserService) following SOLID principles
- Global exception middleware for consistent error responses
- Serilog logging configuration
- Unit tests for backend services (xUnit + EF Core InMemory)
- Frontend tests (Vitest + Testing Library)
- CI workflow (GitHub Actions) to build and test backend and frontend

## Quickstart (development)

Prerequisites:
- .NET 8 SDK
- Node.js 20+ and npm
- Optional: Auth0 developer account for authentication

1. Clone the repository

   git clone https://github.com/RambabuBudigelli/UserDirectory.git
   cd UserDirectory

2. Backend configuration

- Copy `backend/UserDirectory.Api/appsettings.json` or set environment variables.
- For local development, you can set Auth0 values as environment variables (recommended):
  - `Auth0__Domain` (e.g. `https://dev-xxx.us.auth0.com/`)
  - `Auth0__Audience` (e.g. `https://userdirectory-api`)

- To run migrations and create the local SQLite DB:

  dotnet tool install --global dotnet-ef --version 8.0.0
  cd backend/UserDirectory.Api
  dotnet ef database update

- Start the backend:

  dotnet run --project backend/UserDirectory.Api

3. Frontend configuration

- Copy `frontend/.env.example` to `frontend/.env` and set the following values:

  VITE_AUTH0_DOMAIN=your-auth0-domain
  VITE_AUTH0_CLIENT_ID=your-client-id
  VITE_AUTH0_AUDIENCE=https://userdirectory-api
  VITE_API_URL=http://localhost:5047/api/Users

- Start the frontend dev server:

  cd frontend
  npm install
  npm run dev

Open your browser at http://localhost:5173 (or the port Vite uses).

## Running tests

### Backend (xUnit)

From repository root:

  dotnet test backend/tests/UserDirectory.Api.Tests/UserDirectory.Api.Tests.csproj

_Note:_ If a running instance of the backend app locks build artifacts, stop it before running tests.

### Frontend (Vitest)

  cd frontend
  npm test

## CI

A GitHub Actions workflow is included at `.github/workflows/ci.yml` to build and test backend and frontend on push/PR to `main`.

## Notes & Recommendations

- Do not commit secrets (Auth0 client secrets, production DB connection strings). Use environment variables or a secret store in CI/CD.
- For production, prefer a managed relational database (PostgreSQL, SQL Server) instead of SQLite.
- Consider adding integration tests for controllers using `WebApplicationFactory` and mocked authentication.
- Add additional monitoring and structured logging sinks (Seq, Application Insights) as appropriate.

## Project Structure (high level)

- backend/UserDirectory.Api - ASP.NET Core Web API
  - Controllers
  - Data
  - DTOs
  - Models
  - Services
  - Middleware
  - Migrations

- frontend - React + TypeScript (Vite)
  - src/api - API clients
  - src/pages - page components
  - src/components - reusable UI components (if added)
  - src/types - TypeScript types

If you want, I can also:
- Add integration tests and authentication mocking for controller tests
- Replace SQLite with Postgres for production configurations
- Add a PR with a step-by-step migration guide for team members

---

This README was generated as part of a refactor to improve code quality and project structure. If you'd like a shorter or more detailed developer guide, tell me which sections to expand.