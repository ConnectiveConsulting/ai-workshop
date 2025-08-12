import api from './api';

const CaptureService = {
  /**
   * Get all Captures
   * @returns {Promise} Promise object representing the API response
   */
  getAllCaptures: async () => {
    try {
      const response = await api.get('/Capture');
      return response.data;
    } catch (error) {
      console.error('Error fetching Captures:', error);
      throw error;
    }
  },

  /**
   * Get a Capture by Pokemon ID and Trainer ID
   * @param {number} pokemonId - The Pokemon ID
   * @param {number} trainerId - The Trainer ID
   * @returns {Promise} Promise object representing the API response
   */
  getCaptureByIds: async (pokemonId, trainerId) => {
    try {
      const response = await api.get(`/Capture/${pokemonId}/${trainerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching Capture with Pokemon ID ${pokemonId} and Trainer ID ${trainerId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new Capture
   * @param {Object} captureData - The Capture data (pokemonId, trainerId, captureDate)
   * @returns {Promise} Promise object representing the API response
   */
  createCapture: async (captureData) => {
    try {
      const response = await api.post('/Capture', captureData);
      return response.data;
    } catch (error) {
      console.error('Error creating Capture:', error);
      throw error;
    }
  },

  /**
   * Update a Capture
   * @param {number} pokemonId - The Pokemon ID
   * @param {number} trainerId - The Trainer ID
   * @param {Object} captureData - The updated Capture data
   * @returns {Promise} Promise object representing the API response
   */
  updateCapture: async (pokemonId, trainerId, captureData) => {
    try {
      // Note: The backend doesn't have a PUT endpoint for captures
      throw new Error('Update capture operation is not supported by the API');
    } catch (error) {
      console.error(`Error updating Capture with Pokemon ID ${pokemonId} and Trainer ID ${trainerId}:`, error);
      throw error;
    }
  },

  /**
   * Delete a Capture
   * @param {number} pokemonId - The Pokemon ID
   * @param {number} trainerId - The Trainer ID
   * @returns {Promise} Promise object representing the API response
   */
  deleteCapture: async (pokemonId, trainerId) => {
    try {
      const response = await api.delete(`/Capture/${pokemonId}/${trainerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting Capture with Pokemon ID ${pokemonId} and Trainer ID ${trainerId}:`, error);
      throw error;
    }
  },

  /**
   * Get all Captures for a specific Pokemon
   * @param {number} pokemonId - The Pokemon ID
   * @returns {Promise} Promise object representing the API response
   */
  getCapturesByPokemonId: async (pokemonId) => {
    try {
      // Note: The backend doesn't have an endpoint for getting captures by Pokemon ID
      throw new Error('Getting captures by Pokemon ID is not supported by the API');
    } catch (error) {
      console.error(`Error fetching Captures for Pokemon with ID ${pokemonId}:`, error);
      throw error;
    }
  },

  /**
   * Get all Captures for a specific Trainer
   * @param {number} trainerId - The Trainer ID
   * @returns {Promise} Promise object representing the API response
   */
  getCapturesByTrainerId: async (trainerId) => {
    try {
      const response = await api.get(`/Capture/trainer/${trainerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching Captures for Trainer with ID ${trainerId}:`, error);
      throw error;
    }
  }
};

export default CaptureService;