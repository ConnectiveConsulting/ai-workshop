using Pokedex.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pokedex.Core.Interfaces.Repositories
{
    public interface ICaptureRepository
    {
        Task<IEnumerable<Capture>> GetAllAsync();
        Task<IEnumerable<Capture>> GetByTrainerIdAsync(int trainerId);
        Task<Capture?> GetAsync(int pokemonId, int trainerId);
        Task<Capture> AddAsync(Capture capture);
        Task<bool> DeleteAsync(int pokemonId, int trainerId);
    }
}