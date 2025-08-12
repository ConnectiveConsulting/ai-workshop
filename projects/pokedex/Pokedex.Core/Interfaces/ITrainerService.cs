using Pokedex.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pokedex.Core.Interfaces
{
    public interface ITrainerService
    {
        Task<IEnumerable<Trainer>> GetAllTrainersAsync();
        Task<Trainer?> GetTrainerByIdAsync(int id);
        Task<Trainer> AddTrainerAsync(Trainer trainer);
        Task<Trainer?> UpdateTrainerAsync(Trainer trainer);
        Task<bool> DeleteTrainerAsync(int id);
    }
}