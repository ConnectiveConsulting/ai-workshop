using Microsoft.EntityFrameworkCore;
using Pokedex.Core.Models;

namespace Pokedex.Data.Context
{
    public class PokemonDbContext : DbContext
    {
        public PokemonDbContext(DbContextOptions<PokemonDbContext> options) : base(options)
        {
        }

        public DbSet<Pokemon> Pokemons { get; set; } = null!;
        public DbSet<Trainer> Trainers { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // No additional configuration needed
        }
    }
}