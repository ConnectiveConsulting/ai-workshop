import api from './api';

const TrainerService = {
  /**
   * Get all Trainers
   * @returns {Promise} Promise object representing the API response
   */
  getAllTrainers: async () => {
    try {
      const response = await api.get('/Trainer');
      return response.data;
    } catch (error) {
      console.error('Error fetching Trainers:', error);
      throw error;
    }
  },

  /**
   * Get a Trainer by ID
   * @param {number} id - The Trainer ID
   * @returns {Promise} Promise object representing the API response
   */
  getTrainerById: async (id) => {
    try {
      const response = await api.get(`/Trainer/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching Trainer with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new Trainer
   * @param {Object} trainerData - The Trainer data
   * @returns {Promise} Promise object representing the API response
   */
  createTrainer: async (trainerData) => {
    try {
      const response = await api.post('/Trainer', trainerData);
      return response.data;
    } catch (error) {
      console.error('Error creating Trainer:', error);
      throw error;
    }
  },

  /**
   * Update a Trainer
   * @param {number} id - The Trainer ID
   * @param {Object} trainerData - The updated Trainer data
   * @returns {Promise} Promise object representing the API response
   */
  updateTrainer: async (id, trainerData) => {
    try {
      const response = await api.put(`/Trainer/${id}`, trainerData);
      return response.data;
    } catch (error) {
      console.error(`Error updating Trainer with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a Trainer
   * @param {number} id - The Trainer ID
   * @returns {Promise} Promise object representing the API response
   */
  deleteTrainer: async (id) => {
    try {
      const response = await api.delete(`/Trainer/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting Trainer with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get all Pokemon captured by a Trainer
   * @param {number} id - The Trainer ID
   * @returns {Promise} Promise object representing the API response
   */
  getTrainerPokemon: async (id) => {
    try {
      const response = await api.get(`/Capture/trainer/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching Pokemon for Trainer with ID ${id}:`, error);
      throw error;
    }
  }
};

export default TrainerService;