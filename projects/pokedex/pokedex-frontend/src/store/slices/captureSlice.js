import { createSlice, createEntityAdapter, createSelector } from '@reduxjs/toolkit';

// Create entity adapter for normalized state management with composite key
const captureAdapter = createEntityAdapter({
  // Use composite key (pokemonId-trainerId) as the unique identifier
  selectId: (capture) => `${capture.pokemonId}-${capture.trainerId}`,
  // Sort by capture date (most recent first)
  sortComparer: (a, b) => new Date(b.captureDate) - new Date(a.captureDate),
});

// Initial state using the entity adapter
const initialState = captureAdapter.getInitialState({
  loading: false,
  error: null,
  selectedCapture: null,
  filters: {
    pokemonId: null,
    trainerId: null,
    dateRange: {
      start: null,
      end: null,
    },
  },
});

const captureSlice = createSlice({
  name: 'capture',
  initialState,
  reducers: {
    // Loading state management
    setCaptureLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Error state management
    setCaptureError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Clear error
    clearCaptureError: (state) => {
      state.error = null;
    },
    
    // Selected Capture management
    setSelectedCapture: (state, action) => {
      state.selectedCapture = action.payload;
    },
    
    clearSelectedCapture: (state) => {
      state.selectedCapture = null;
    },
    
    // Filter management
    setCaptureFilter: (state, action) => {
      const { filterType, value } = action.payload;
      if (filterType === 'dateRange') {
        state.filters.dateRange = { ...state.filters.dateRange, ...value };
      } else {
        state.filters[filterType] = value;
      }
    },
    
    clearCaptureFilters: (state) => {
      state.filters = {
        pokemonId: null,
        trainerId: null,
        dateRange: {
          start: null,
          end: null,
        },
      };
    },
    
    // CRUD operations using entity adapter
    addCapture: captureAdapter.addOne,
    addManyCaptures: captureAdapter.addMany,
    upsertCapture: captureAdapter.upsertOne,
    upsertManyCaptures: captureAdapter.upsertMany,
    removeCapture: captureAdapter.removeOne,
    removeManyCaptures: captureAdapter.removeMany,
    setAllCaptures: captureAdapter.setAll,
    
    // Custom capture operations
    removeCaptureByIds: (state, action) => {
      const { pokemonId, trainerId } = action.payload;
      const compositeId = `${pokemonId}-${trainerId}`;
      captureAdapter.removeOne(state, compositeId);
    },
    
    removeCapturesByPokemonId: (state, action) => {
      const pokemonId = action.payload;
      const idsToRemove = Object.keys(state.entities).filter(id => 
        id.startsWith(`${pokemonId}-`)
      );
      captureAdapter.removeMany(state, idsToRemove);
    },
    
    removeCapturesByTrainerId: (state, action) => {
      const trainerId = action.payload;
      const idsToRemove = Object.keys(state.entities).filter(id => 
        id.endsWith(`-${trainerId}`)
      );
      captureAdapter.removeMany(state, idsToRemove);
    },
    
    // Batch operations
    captureOperationStarted: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    captureOperationSucceeded: (state) => {
      state.loading = false;
      state.error = null;
    },
    
    captureOperationFailed: (state, action) => {
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
  setCaptureLoading,
  setCaptureError,
  clearCaptureError,
  setSelectedCapture,
  clearSelectedCapture,
  setCaptureFilter,
  clearCaptureFilters,
  addCapture,
  addManyCaptures,
  upsertCapture,
  upsertManyCaptures,
  removeCapture,
  removeManyCaptures,
  setAllCaptures,
  removeCaptureByIds,
  removeCapturesByPokemonId,
  removeCapturesByTrainerId,
  captureOperationStarted,
  captureOperationSucceeded,
  captureOperationFailed,
} = captureSlice.actions;

// Export selectors using entity adapter
export const {
  selectAll: selectAllCaptures,
  selectById: selectCaptureById,
  selectIds: selectCaptureIds,
  selectEntities: selectCaptureEntities,
  selectTotal: selectTotalCaptures,
} = captureAdapter.getSelectors((state) => state.capture);

// Custom memoized selectors
export const selectCaptureLoading = (state) => state.capture.loading;
export const selectCaptureError = (state) => state.capture.error;
export const selectSelectedCapture = (state) => state.capture.selectedCapture;
export const selectCaptureFilters = (state) => state.capture.filters;

// Selector for capture by Pokemon and Trainer IDs
export const selectCaptureByIds = createSelector(
  [selectCaptureEntities, (state, pokemonId, trainerId) => ({ pokemonId, trainerId })],
  (entities, { pokemonId, trainerId }) => {
    const compositeId = `${pokemonId}-${trainerId}`;
    return entities[compositeId] || null;
  }
);

// Selector for captures by Pokemon ID
export const selectCapturesByPokemonId = createSelector(
  [selectAllCaptures, (state, pokemonId) => pokemonId],
  (captures, pokemonId) => {
    if (!pokemonId) return [];
    return captures.filter((capture) => capture.pokemonId === pokemonId);
  }
);

// Selector for captures by Trainer ID
export const selectCapturesByTrainerId = createSelector(
  [selectAllCaptures, (state, trainerId) => trainerId],
  (captures, trainerId) => {
    if (!trainerId) return [];
    return captures.filter((capture) => capture.trainerId === trainerId);
  }
);

// Memoized filtered selectors
export const selectFilteredCaptures = createSelector(
  [selectAllCaptures, selectCaptureFilters],
  (captures, filters) => {
    return captures.filter((capture) => {
      const matchesPokemon = !filters.pokemonId || capture.pokemonId === filters.pokemonId;
      const matchesTrainer = !filters.trainerId || capture.trainerId === filters.trainerId;
      
      let matchesDateRange = true;
      if (filters.dateRange.start || filters.dateRange.end) {
        const captureDate = new Date(capture.captureDate);
        if (filters.dateRange.start) {
          matchesDateRange = matchesDateRange && captureDate >= new Date(filters.dateRange.start);
        }
        if (filters.dateRange.end) {
          matchesDateRange = matchesDateRange && captureDate <= new Date(filters.dateRange.end);
        }
      }
      
      return matchesPokemon && matchesTrainer && matchesDateRange;
    });
  }
);

// Selector for capture statistics
export const selectCaptureStats = createSelector(
  [selectAllCaptures],
  (captures) => {
    const pokemonCounts = {};
    const trainerCounts = {};
    const dailyCounts = {};
    
    captures.forEach((capture) => {
      // Pokemon capture counts
      pokemonCounts[capture.pokemonId] = (pokemonCounts[capture.pokemonId] || 0) + 1;
      
      // Trainer capture counts
      trainerCounts[capture.trainerId] = (trainerCounts[capture.trainerId] || 0) + 1;
      
      // Daily capture counts
      const date = new Date(capture.captureDate).toDateString();
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });
    
    return {
      total: captures.length,
      pokemonCounts,
      trainerCounts,
      dailyCounts,
      uniquePokemon: Object.keys(pokemonCounts).length,
      uniqueTrainers: Object.keys(trainerCounts).length,
    };
  }
);

// Helper selector to check if a Pokemon is captured by a specific Trainer
export const selectIsPokemonCapturedByTrainer = createSelector(
  [selectCaptureEntities, (state, pokemonId, trainerId) => ({ pokemonId, trainerId })],
  (entities, { pokemonId, trainerId }) => {
    const compositeId = `${pokemonId}-${trainerId}`;
    return !!entities[compositeId];
  }
);

// Export reducer
export default captureSlice.reducer;