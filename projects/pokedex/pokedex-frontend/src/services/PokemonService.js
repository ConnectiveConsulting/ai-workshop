import api from './api';

const PokemonService = {
  /**
   * Get all Pokemon
   * @returns {Promise} Promise object representing the API response
   */
  getAllPokemon: async () => {
    try {
      const response = await api.get('/Pokemon');
      return response.data;
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
      throw error;
    }
  },

  /**
   * Get a Pokemon by ID
   * @param {number} id - The Pokemon ID
   * @returns {Promise} Promise object representing the API response
   */
  getPokemonById: async (id) => {
    try {
      const response = await api.get(`/Pokemon/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching Pokemon with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new Pokemon
   * @param {Object} pokemonData - The Pokemon data
   * @returns {Promise} Promise object representing the API response
   */
  createPokemon: async (pokemonData) => {
    try {
      const response = await api.post('/Pokemon', pokemonData);
      return response.data;
    } catch (error) {
      console.error('Error creating Pokemon:', error);
      throw error;
    }
  },

  /**
   * Update a Pokemon
   * @param {number} id - The Pokemon ID
   * @param {Object} pokemonData - The updated Pokemon data
   * @returns {Promise} Promise object representing the API response
   */
  updatePokemon: async (id, pokemonData) => {
    try {
      const response = await api.put(`/Pokemon/${id}`, pokemonData);
      return response.data;
    } catch (error) {
      console.error(`Error updating Pokemon with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a Pokemon
   * @param {number} id - The Pokemon ID
   * @returns {Promise} Promise object representing the API response
   */
  deletePokemon: async (id) => {
    try {
      const response = await api.delete(`/Pokemon/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting Pokemon with ID ${id}:`, error);
      throw error;
    }
  }
};

export default PokemonService;