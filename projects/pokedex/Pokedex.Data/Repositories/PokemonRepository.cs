using Pokedex.Core.Interfaces.Repositories;
using Pokedex.Core.Models;
using Pokedex.Data.Context;

namespace Pokedex.Data.Repositories
{
    public class PokemonRepository : Repository<Pokemon>, IPokemonRepository
    {
        public PokemonRepository(PokemonDbContext context) : base(context)
        {
        }

        // Add any Pokemon-specific repository methods here
    }
}