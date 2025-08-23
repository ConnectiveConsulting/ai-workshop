import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import pokemonSlice from './slices/pokemonSlice';
import trainerSlice from './slices/trainerSlice';
import captureSlice from './slices/captureSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    // RTK Query API slice
    [api.reducerPath]: api.reducer,
    
    // Feature slices - fully implemented with createEntityAdapter
    pokemon: pokemonSlice,
    trainer: trainerSlice,
    capture: captureSlice,
    ui: uiSlice,
  },
  
  // Add the API middleware to enable caching, invalidation, polling, and other useful features
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore these action types
          'persist/PERSIST',
          'persist/REHYDRATE',
        ],
      },
    }).concat(api.middleware),
  
  // Enable Redux DevTools Extension in development
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;