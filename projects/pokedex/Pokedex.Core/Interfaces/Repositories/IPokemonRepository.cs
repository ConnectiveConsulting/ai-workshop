using Pokedex.Core.Models;
using System.Threading.Tasks;

namespace Pokedex.Core.Interfaces.Repositories
{
    public interface IPokemonRepository : IRepository<Pokemon>
    {
        // Add any Pokemon-specific repository methods here
    }
}