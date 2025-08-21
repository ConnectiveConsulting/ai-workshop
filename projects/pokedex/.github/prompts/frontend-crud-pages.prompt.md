---
mode: agent
---


# Pokedex Frontend CRUD Pages Playbook

This playbook guides AI coding agents to implement fully functional CRUD (Create, Read, Update, Delete) list and detail pages in the `pokedex-frontend` React app, following established project conventions and patterns.

## General Process

1. **Clarify the Entity and API**
	- Ask the user which entity (e.g., Pokémon, Trainer, Capture) the CRUD pages are for.
	- If not specified, prompt for the API controller or endpoint path (e.g., `/Pokemon`, `/Trainer`).
	- Confirm the expected fields for the entity (names, types, required/optional, etc.).

2. **File Structure**
	- Place new list and detail pages in `pokedex-frontend/src/pages/` (e.g., `MyEntityListPage.js`, `MyEntityDetailPage.js`).
	- Place reusable components in `pokedex-frontend/src/components/[entity]/` (e.g., `MyEntityList.js`, `MyEntityDetail.js`).
	- Add or update a service in `pokedex-frontend/src/services/` (e.g., `MyEntityService.js`) to handle API calls.

3. **API Integration**
	- Use the corresponding service (see `PokemonService.js`, `TrainerService.js`) to abstract all API calls.
	- Services use the shared Axios instance in `src/services/api.js` (base URL: `http://localhost:5214/api`).
	- Implement standard CRUD methods: `getAll`, `getById`, `create`, `update`, `delete`.

4. **List Page Pattern**
	- See `PokemonListPage.js` and `components/pokemon/PokemonList.js` for reference.
	- Fetch all entities on mount (`useEffect`).
	- Display a grid/list of cards, each with key info and actions (View, Delete).
	- Include a button to show/hide a creation form at the top of the list.
	- On create, POST to the API, reset the form, and refresh the list.
	- On delete, confirm with the user, then DELETE and refresh the list.

5. **Detail Page Pattern**
	- See `PokemonDetailPage.js` and `components/pokemon/PokemonDetail.js` for reference.
	- Fetch entity details by ID from the URL (`useParams`).
	- Show entity info, with Edit and Delete actions.
	- Edit toggles a form pre-filled with current values; on submit, PUT to the API and update state.
	- Delete confirms, then deletes and navigates back to the list.

6. **Form Handling**
	- Use controlled components for forms (`useState` for form data).
	- Validate required fields in the form.
	- Show loading and error states as in the reference components.

7. **Navigation**
	- Use `react-router-dom`'s `Link` for navigation between list and detail pages.
	- After delete, navigate back to the list page.

8. **Styling**
	- Use existing class names and structure for consistency (see `pokemon-list`, `pokemon-card`, `btn btn-primary`, etc.).
	- Place new CSS in `src/assets/css/` if needed, but prefer reusing existing styles.

## Key Files & Examples

- List Page: `src/pages/PokemonListPage.js`, `src/components/pokemon/PokemonList.js`
- Detail Page: `src/pages/PokemonDetailPage.js`, `src/components/pokemon/PokemonDetail.js`
- Service: `src/services/PokemonService.js`, `src/services/api.js`
- Routing: `src/pages/index.js`

## User Clarification Prompts

- "Which entity do you want to generate CRUD pages for? (e.g., Pokémon, Trainer, Capture)"
- "What is the API endpoint/controller for this entity? (e.g., /Pokemon, /Trainer)"
- "What fields should be included in the form? Please specify names, types, and which are required."

## Success Criteria

- List and detail pages are created in the correct locations and follow the project’s patterns.
- All CRUD operations work using the appropriate service and API endpoints.
- UI matches the look and feel of existing pages (see Pokémon and Trainer pages for reference).
- Loading, error, and empty states are handled as in the reference components.

---
Use this playbook as a step-by-step guide for generating or updating CRUD UI pages in the Pokedex frontend. Always reference real project patterns and ask for clarification if any required information is missing.