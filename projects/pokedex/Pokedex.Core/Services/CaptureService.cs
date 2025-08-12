using Pokedex.Core.Interfaces;
using Pokedex.Core.Interfaces.Repositories;
using Pokedex.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pokedex.Core.Services
{
    public class CaptureService : ICaptureService
    {
        private readonly ICaptureRepository _captureRepository;

        public CaptureService(ICaptureRepository captureRepository)
        {
            _captureRepository = captureRepository;
        }

        public async Task<IEnumerable<Capture>> GetAllCapturesAsync()
        {
            return await _captureRepository.GetAllAsync();
        }

        public async Task<IEnumerable<Capture>> GetCapturesByTrainerIdAsync(int trainerId)
        {
            return await _captureRepository.GetByTrainerIdAsync(trainerId);
        }

        public async Task<Capture?> GetCaptureAsync(int pokemonId, int trainerId)
        {
            return await _captureRepository.GetAsync(pokemonId, trainerId);
        }

        public async Task<Capture> AddCaptureAsync(Capture capture)
        {
            return await _captureRepository.AddAsync(capture);
        }

        public async Task<bool> DeleteCaptureAsync(int pokemonId, int trainerId)
        {
            return await _captureRepository.DeleteAsync(pokemonId, trainerId);
        }
    }
}