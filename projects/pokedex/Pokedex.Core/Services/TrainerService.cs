using Pokedex.Core.Interfaces;
using Pokedex.Core.Interfaces.Repositories;
using Pokedex.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pokedex.Core.Services
{
    public class TrainerService : ITrainerService
    {
        private readonly ITrainerRepository _trainerRepository;

        public TrainerService(ITrainerRepository trainerRepository)
        {
            _trainerRepository = trainerRepository;
        }

        public async Task<IEnumerable<Trainer>> GetAllTrainersAsync()
        {
            return await _trainerRepository.GetAllAsync();
        }

        public async Task<Trainer?> GetTrainerByIdAsync(int id)
        {
            return await _trainerRepository.GetByIdAsync(id);
        }

        public async Task<Trainer> AddTrainerAsync(Trainer trainer)
        {
            return await _trainerRepository.AddAsync(trainer);
        }

        public async Task<Trainer?> UpdateTrainerAsync(Trainer trainer)
        {
            return await _trainerRepository.UpdateAsync(trainer);
        }

        public async Task<bool> DeleteTrainerAsync(int id)
        {
            return await _trainerRepository.DeleteAsync(id);
        }
    }
}