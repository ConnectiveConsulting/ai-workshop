using Pokedex.Core.Interfaces.Repositories;
using Pokedex.Core.Models;
using Pokedex.Data.Context;

namespace Pokedex.Data.Repositories
{
    public class TrainerRepository : Repository<Trainer>, ITrainerRepository
    {
        public TrainerRepository(PokemonDbContext context) : base(context)
        {
        }

        // Add any Trainer-specific repository methods here
    }
}