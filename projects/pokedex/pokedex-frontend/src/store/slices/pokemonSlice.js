import { createSlice, createEntityAdapter, createSelector } from '@reduxjs/toolkit';

// Create entity adapter for normalized state management
const pokemonAdapter = createEntityAdapter({
  // Sort by name by default
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

// Initial state using the entity adapter
const initialState = pokemonAdapter.getInitialState({
  loading: false,
  error: null,
  selectedPokemon: null,
  filters: {
    type: '',
    searchTerm: '',
  },
});

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    // Loading state management
    setPokemonLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Error state management
    setPokemonError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Clear error
    clearPokemonError: (state) => {
      state.error = null;
    },
    
    // Selected Pokemon management
    setSelectedPokemon: (state, action) => {
      state.selectedPokemon = action.payload;
    },
    
    clearSelectedPokemon: (state) => {
      state.selectedPokemon = null;
    },
    
    // Filter management
    setPokemonFilter: (state, action) => {
      const { filterType, value } = action.payload;
      state.filters[filterType] = value;
    },
    
    clearPokemonFilters: (state) => {
      state.filters = {
        type: '',
        searchTerm: '',
      };
    },
    
    // CRUD operations using entity adapter
    addPokemon: pokemonAdapter.addOne,
    addManyPokemon: pokemonAdapter.addMany,
    updatePokemon: pokemonAdapter.updateOne,
    upsertPokemon: pokemonAdapter.upsertOne,
    upsertManyPokemon: pokemonAdapter.upsertMany,
    removePokemon: pokemonAdapter.removeOne,
    removeManyPokemon: pokemonAdapter.removeMany,
    setAllPokemon: pokemonAdapter.setAll,
    
    // Batch operations
    pokemonOperationStarted: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    pokemonOperationSucceeded: (state) => {
      state.loading = false;
      state.error = null;
    },
    
    pokemonOperationFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add cases for async thunks and API calls here
    // These will be used when RTK Query endpoints are implemented
  },
});

// Export actions
export const {
  setPokemonLoading,
  setPokemonError,
  clearPokemonError,
  setSelectedPokemon,
  clearSelectedPokemon,
  setPokemonFilter,
  clearPokemonFilters,
  addPokemon,
  addManyPokemon,
  updatePokemon,
  upsertPokemon,
  upsertManyPokemon,
  removePokemon,
  removeManyPokemon,
  setAllPokemon,
  pokemonOperationStarted,
  pokemonOperationSucceeded,
  pokemonOperationFailed,
} = pokemonSlice.actions;

// Export selectors using entity adapter
export const {
  selectAll: selectAllPokemon,
  selectById: selectPokemonById,
  selectIds: selectPokemonIds,
  selectEntities: selectPokemonEntities,
  selectTotal: selectTotalPokemon,
} = pokemonAdapter.getSelectors((state) => state.pokemon);

// Custom memoized selectors
export const selectPokemonLoading = (state) => state.pokemon.loading;
export const selectPokemonError = (state) => state.pokemon.error;
export const selectSelectedPokemon = (state) => state.pokemon.selectedPokemon;
export const selectPokemonFilters = (state) => state.pokemon.filters;

// Memoized filtered selectors
export const selectFilteredPokemon = createSelector(
  [selectAllPokemon, selectPokemonFilters],
  (pokemon, filters) => {
    return pokemon.filter((p) => {
      const matchesType = !filters.type || p.type?.toLowerCase().includes(filters.type.toLowerCase());
      const matchesSearch = !filters.searchTerm || 
        p.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        p.type?.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      return matchesType && matchesSearch;
    });
  }
);

// Selector for Pokemon by type
export const selectPokemonByType = createSelector(
  [selectAllPokemon, (state, type) => type],
  (pokemon, type) => {
    if (!type) return pokemon;
    return pokemon.filter((p) => p.type?.toLowerCase() === type.toLowerCase());
  }
);

// Selector for Pokemon statistics
export const selectPokemonStats = createSelector(
  [selectAllPokemon],
  (pokemon) => {
    const types = {};
    pokemon.forEach((p) => {
      if (p.type) {
        types[p.type] = (types[p.type] || 0) + 1;
      }
    });
    
    return {
      total: pokemon.length,
      typeDistribution: types,
    };
  }
);

// Export reducer
export default pokemonSlice.reducer;