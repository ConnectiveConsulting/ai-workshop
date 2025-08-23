import { createSlice, createEntityAdapter, createSelector } from '@reduxjs/toolkit';

// Create entity adapter for normalized state management
const trainerAdapter = createEntityAdapter({
  // Sort by name by default
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

// Initial state using the entity adapter
const initialState = trainerAdapter.getInitialState({
  loading: false,
  error: null,
  selectedTrainer: null,
  filters: {
    region: '',
    searchTerm: '',
  },
});

const trainerSlice = createSlice({
  name: 'trainer',
  initialState,
  reducers: {
    // Loading state management
    setTrainerLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Error state management
    setTrainerError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Clear error
    clearTrainerError: (state) => {
      state.error = null;
    },
    
    // Selected Trainer management
    setSelectedTrainer: (state, action) => {
      state.selectedTrainer = action.payload;
    },
    
    clearSelectedTrainer: (state) => {
      state.selectedTrainer = null;
    },
    
    // Filter management
    setTrainerFilter: (state, action) => {
      const { filterType, value } = action.payload;
      state.filters[filterType] = value;
    },
    
    clearTrainerFilters: (state) => {
      state.filters = {
        region: '',
        searchTerm: '',
      };
    },
    
    // CRUD operations using entity adapter
    addTrainer: trainerAdapter.addOne,
    addManyTrainers: trainerAdapter.addMany,
    updateTrainer: trainerAdapter.updateOne,
    upsertTrainer: trainerAdapter.upsertOne,
    upsertManyTrainers: trainerAdapter.upsertMany,
    removeTrainer: trainerAdapter.removeOne,
    removeManyTrainers: trainerAdapter.removeMany,
    setAllTrainers: trainerAdapter.setAll,
    
    // Batch operations
    trainerOperationStarted: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    trainerOperationSucceeded: (state) => {
      state.loading = false;
      state.error = null;
    },
    
    trainerOperationFailed: (state, action) => {
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
  setTrainerLoading,
  setTrainerError,
  clearTrainerError,
  setSelectedTrainer,
  clearSelectedTrainer,
  setTrainerFilter,
  clearTrainerFilters,
  addTrainer,
  addManyTrainers,
  updateTrainer,
  upsertTrainer,
  upsertManyTrainers,
  removeTrainer,
  removeManyTrainers,
  setAllTrainers,
  trainerOperationStarted,
  trainerOperationSucceeded,
  trainerOperationFailed,
} = trainerSlice.actions;

// Export selectors using entity adapter
export const {
  selectAll: selectAllTrainers,
  selectById: selectTrainerById,
  selectIds: selectTrainerIds,
  selectEntities: selectTrainerEntities,
  selectTotal: selectTotalTrainers,
} = trainerAdapter.getSelectors((state) => state.trainer);

// Custom memoized selectors
export const selectTrainerLoading = (state) => state.trainer.loading;
export const selectTrainerError = (state) => state.trainer.error;
export const selectSelectedTrainer = (state) => state.trainer.selectedTrainer;
export const selectTrainerFilters = (state) => state.trainer.filters;

// Memoized filtered selectors
export const selectFilteredTrainers = createSelector(
  [selectAllTrainers, selectTrainerFilters],
  (trainers, filters) => {
    return trainers.filter((t) => {
      const matchesRegion = !filters.region || t.region?.toLowerCase().includes(filters.region.toLowerCase());
      const matchesSearch = !filters.searchTerm || 
        t.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        t.region?.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      return matchesRegion && matchesSearch;
    });
  }
);

// Selector for Trainers by region
export const selectTrainersByRegion = createSelector(
  [selectAllTrainers, (state, region) => region],
  (trainers, region) => {
    if (!region) return trainers;
    return trainers.filter((t) => t.region?.toLowerCase() === region.toLowerCase());
  }
);

// Selector for Trainer statistics
export const selectTrainerStats = createSelector(
  [selectAllTrainers],
  (trainers) => {
    const regions = {};
    trainers.forEach((t) => {
      if (t.region) {
        regions[t.region] = (regions[t.region] || 0) + 1;
      }
    });
    
    return {
      total: trainers.length,
      regionDistribution: regions,
    };
  }
);

// Export reducer
export default trainerSlice.reducer;