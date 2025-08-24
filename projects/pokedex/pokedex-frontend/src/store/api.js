import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API slice with RTK Query
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5214/api',
    prepareHeaders: (headers, { getState }) => {
      // Add any auth headers or other common headers here
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Pokemon', 'Trainer', 'Capture'],
  endpoints: (builder) => ({
    // Pokemon endpoints
    getAllPokemon: builder.query({
      query: () => '/Pokemon',
      providesTags: ['Pokemon'],
    }),
    
    getPokemonById: builder.query({
      query: (id) => `/Pokemon/${id}`,
      providesTags: (result, error, id) => [{ type: 'Pokemon', id }],
    }),
    
    createPokemon: builder.mutation({
      query: (pokemonData) => ({
        url: '/Pokemon',
        method: 'POST',
        body: pokemonData,
      }),
      invalidatesTags: ['Pokemon'],
      // Optimistic update
      async onQueryStarted(pokemonData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getAllPokemon', undefined, (draft) => {
            // Add temporary pokemon with optimistic ID
            const tempPokemon = {
              ...pokemonData,
              id: Date.now(), // Temporary ID
              __isOptimistic: true,
            };
            draft.push(tempPokemon);
          })
        );
        try {
          const { data: newPokemon } = await queryFulfilled;
          // Replace optimistic update with real data
          dispatch(
            api.util.updateQueryData('getAllPokemon', undefined, (draft) => {
              const index = draft.findIndex(p => p.__isOptimistic);
              if (index !== -1) {
                draft[index] = newPokemon;
                delete draft[index].__isOptimistic;
              }
            })
          );
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
    }),
    
    updatePokemon: builder.mutation({
      query: ({ id, ...pokemonData }) => ({
        url: `/Pokemon/${id}`,
        method: 'PUT',
        body: { id, ...pokemonData },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Pokemon', id },
        'Pokemon',
      ],
      // Optimistic update
      async onQueryStarted({ id, ...pokemonData }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getPokemonById', id, (draft) => {
            Object.assign(draft, pokemonData);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    
    deletePokemon: builder.mutation({
      query: (id) => ({
        url: `/Pokemon/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Pokemon', id },
        'Pokemon',
        'Capture', // Also invalidate captures since pokemon relationships may change
      ],
    }),
    
    // Trainer endpoints
    getAllTrainers: builder.query({
      query: () => '/Trainer',
      providesTags: ['Trainer'],
    }),
    
    getTrainerById: builder.query({
      query: (id) => `/Trainer/${id}`,
      providesTags: (result, error, id) => [{ type: 'Trainer', id }],
    }),
    
    createTrainer: builder.mutation({
      query: (trainerData) => ({
        url: '/Trainer',
        method: 'POST',
        body: trainerData,
      }),
      invalidatesTags: ['Trainer'],
      // Optimistic update
      async onQueryStarted(trainerData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getAllTrainers', undefined, (draft) => {
            const tempTrainer = {
              ...trainerData,
              id: Date.now(),
              __isOptimistic: true,
            };
            draft.push(tempTrainer);
          })
        );
        try {
          const { data: newTrainer } = await queryFulfilled;
          dispatch(
            api.util.updateQueryData('getAllTrainers', undefined, (draft) => {
              const index = draft.findIndex(t => t.__isOptimistic);
              if (index !== -1) {
                draft[index] = newTrainer;
                delete draft[index].__isOptimistic;
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    
    updateTrainer: builder.mutation({
      query: ({ id, ...trainerData }) => ({
        url: `/Trainer/${id}`,
        method: 'PUT',
        body: { id, ...trainerData },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Trainer', id },
        'Trainer',
      ],
      async onQueryStarted({ id, ...trainerData }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getTrainerById', id, (draft) => {
            Object.assign(draft, trainerData);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    
    deleteTrainer: builder.mutation({
      query: (id) => ({
        url: `/Trainer/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Trainer', id },
        'Trainer',
        'Capture', // Also invalidate captures since trainer relationships may change
      ],
    }),
    
    // Capture endpoints
    getAllCaptures: builder.query({
      query: () => '/Capture',
      providesTags: ['Capture'],
    }),
    
    getCaptureByIds: builder.query({
      query: ({ pokemonId, trainerId }) => `/Capture/${pokemonId}/${trainerId}`,
      providesTags: (result, error, { pokemonId, trainerId }) => [
        { type: 'Capture', id: `${pokemonId}-${trainerId}` },
      ],
    }),
    
    getCapturesByTrainerId: builder.query({
      query: (trainerId) => `/Capture/trainer/${trainerId}`,
      providesTags: (result, error, trainerId) => [
        { type: 'Capture', id: `trainer-${trainerId}` },
      ],
    }),
    
    createCapture: builder.mutation({
      query: (captureData) => ({
        url: '/Capture',
        method: 'POST',
        body: captureData,
      }),
      invalidatesTags: ['Capture'],
      async onQueryStarted(captureData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getAllCaptures', undefined, (draft) => {
            const tempCapture = {
              ...captureData,
              captureDate: captureData.captureDate || new Date().toISOString(),
              __isOptimistic: true,
            };
            draft.push(tempCapture);
          })
        );
        try {
          const { data: newCapture } = await queryFulfilled;
          dispatch(
            api.util.updateQueryData('getAllCaptures', undefined, (draft) => {
              const index = draft.findIndex(c => c.__isOptimistic);
              if (index !== -1) {
                draft[index] = newCapture;
                delete draft[index].__isOptimistic;
              }
            })
          );
          // Also update trainer-specific captures if cached
          if (captureData.trainerId) {
            dispatch(
              api.util.updateQueryData('getCapturesByTrainerId', captureData.trainerId, (draft) => {
                draft.push(newCapture);
              })
            );
          }
        } catch {
          patchResult.undo();
        }
      },
    }),
    
    deleteCapture: builder.mutation({
      query: ({ pokemonId, trainerId }) => ({
        url: `/Capture/${pokemonId}/${trainerId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { pokemonId, trainerId }) => [
        { type: 'Capture', id: `${pokemonId}-${trainerId}` },
        { type: 'Capture', id: `trainer-${trainerId}` },
        'Capture',
      ],
      async onQueryStarted({ pokemonId, trainerId }, { dispatch, queryFulfilled }) {
        // Optimistically remove from all captures
        const patchResult1 = dispatch(
          api.util.updateQueryData('getAllCaptures', undefined, (draft) => {
            return draft.filter(c => !(c.pokemonId === pokemonId && c.trainerId === trainerId));
          })
        );
        
        // Optimistically remove from trainer captures
        const patchResult2 = dispatch(
          api.util.updateQueryData('getCapturesByTrainerId', trainerId, (draft) => {
            return draft.filter(c => c.pokemonId !== pokemonId);
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          patchResult1.undo();
          patchResult2.undo();
        }
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  // Pokemon hooks
  useGetAllPokemonQuery,
  useGetPokemonByIdQuery,
  useCreatePokemonMutation,
  useUpdatePokemonMutation,
  useDeletePokemonMutation,
  
  // Trainer hooks
  useGetAllTrainersQuery,
  useGetTrainerByIdQuery,
  useCreateTrainerMutation,
  useUpdateTrainerMutation,
  useDeleteTrainerMutation,
  
  // Capture hooks
  useGetAllCapturesQuery,
  useGetCaptureByIdsQuery,
  useGetCapturesByTrainerIdQuery,
  useCreateCaptureMutation,
  useDeleteCaptureMutation,
} = api;

export default api;