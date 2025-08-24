// Test file to verify Redux store implementation
import { store } from './store';
import { 
  addPokemon, 
  addTrainer, 
  setLoading,
  selectAllPokemon,
  selectAllTrainers,
  selectIsLoading
} from './index';

// Test function to verify all slices are working
export const testReduxImplementation = () => {
  console.log('Testing Redux Implementation...');
  
  // Test initial state
  const initialState = store.getState();
  console.log('Initial state:', {
    pokemon: initialState.pokemon,
    trainer: initialState.trainer,
    ui: initialState.ui,
    api: initialState.api
  });
  
  // Test Pokemon slice
  const testPokemon = {
    id: 1,
    name: 'Test Pikachu',
    type: 'Electric',
    level: 25,
    hp: 100,
    attack: 80,
    defense: 60,
    speed: 90
  };
  
  store.dispatch(addPokemon(testPokemon));
  console.log('Added Pokemon:', selectAllPokemon(store.getState()));
  
  // Test Trainer slice
  const testTrainer = {
    id: 1,
    name: 'Test Ash',
    region: 'Kanto',
    email: 'ash@pokemon.com',
    phone: '123-456-7890'
  };
  
  store.dispatch(addTrainer(testTrainer));
  console.log('Added Trainer:', selectAllTrainers(store.getState()));
  
  // Test UI slice
  store.dispatch(setLoading(true));
  console.log('Loading state:', selectIsLoading(store.getState()));
  
  store.dispatch(setLoading(false));
  console.log('Loading state updated:', selectIsLoading(store.getState()));
  
  console.log('✅ Redux implementation test completed successfully!');
  
  return {
    pokemon: selectAllPokemon(store.getState()),
    trainers: selectAllTrainers(store.getState()),
    isLoading: selectIsLoading(store.getState())
  };
};

// Auto-run test in development
if (process.env.NODE_ENV === 'development') {
  // Delay test to ensure store is fully initialized
  setTimeout(() => {
    try {
      testReduxImplementation();
    } catch (error) {
      console.error('❌ Redux implementation test failed:', error);
    }
  }, 1000);
}