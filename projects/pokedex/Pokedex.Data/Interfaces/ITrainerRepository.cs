using Pokedex.Core.Models;
using System.Threading.Tasks;

namespace Pokedex.Data.Interfaces
{
    public interface ITrainerRepository : IRepository<Trainer>
    {
        // Add any Trainer-specific repository methods here
    }
}