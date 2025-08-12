using Pokedex.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pokedex.Core.Interfaces
{
    public interface ICaptureService
    {
        Task<IEnumerable<Capture>> GetAllCapturesAsync();
        Task<IEnumerable<Capture>> GetCapturesByTrainerIdAsync(int trainerId);
        Task<Capture?> GetCaptureAsync(int pokemonId, int trainerId);
        Task<Capture> AddCaptureAsync(Capture capture);
        Task<bool> DeleteCaptureAsync(int pokemonId, int trainerId);
    }
}