## Copilot Instructions for Pokedex Monorepo

### 1. Architecture Overview
- **Backend**: ASP.NET Core Web API (`Pokedex.API/`), using in-memory EF Core (`PokemonDbContext`). Exposes REST endpoints for Pokemon, Trainer, and Capture resources. Service and repository layers are separated for testability and maintainability.
- **Frontend**: React app (`pokedex-frontend/`), bootstrapped with Create React App. Communicates with the backend via Axios (`src/services/api.js`), using RESTful patterns.
- **Data Model**: Core entities are `Pokemon`, `Trainer`, and `Capture` (many-to-many, composite key). See `Pokedex.Core/Models/` and `Pokedex.Data/Context/PokemonDbContext.cs` for relationships.

### 2. Developer Workflows
- **Backend**
	- Run API: `dotnet run` in `Pokedex.API/` (default port: 5214)
	- Endpoints auto-discovered via `[ApiController]` and `[Route]` attributes in `Controllers/`.
	- Uses in-memory DB for local/dev; no persistent storage by default.
- **Frontend**
	- Run app: `npm start` in `pokedex-frontend/`
	- API base URL: `http://localhost:5214/api` (see `src/services/api.js`)
	- All API calls are abstracted in `src/services/*Service.js` files.
- **CORS**: Only `http://localhost:3000` is allowed by default (see `Pokedex.API/Program.cs`).

### 3. Project Conventions & Patterns
- **Service/Repository Pattern**: All business logic in `Pokedex.Core/Services/`, data access in `Pokedex.Data/Repositories/`.
- **DTOs**: API responses use DTOs (`Pokedex.API/Models/*Dto.cs`) to decouple from EF models.
- **Error Handling**: Frontend logs errors to console; backend returns standard HTTP codes (404, 401, 403, 500).
- **No Auth**: No authentication/authorization is implemented by default.
- **Testing**: Frontend uses React Testing Library (`npm test`). Backend test setup not included by default.

### 4. Integration Points
- **Frontend/Backend contract**: All cross-component communication is via REST endpoints. See `src/services/` for usage patterns.
- **Swagger/OpenAPI**: Enabled in dev mode for API docs (`/swagger` endpoint, see `Program.cs`).

### 5. Examples
- **Add a new API endpoint**: Implement in `Controllers/`, add to corresponding Service/Repository, update DTO if needed.
- **Add a new frontend feature**: Add a new React component in `src/components/` or `src/pages/`, use or extend a Service in `src/services/` for API calls.

### 6. Key Files & Directories
- `Pokedex.API/Controllers/` — API endpoints
- `Pokedex.Core/Models/` — Domain models
- `Pokedex.Data/Repositories/` — Data access
- `pokedex-frontend/src/services/` — API integration
- `pokedex-frontend/src/pages/` — Main React pages

---
If any section is unclear or missing, please provide feedback for further iteration.
