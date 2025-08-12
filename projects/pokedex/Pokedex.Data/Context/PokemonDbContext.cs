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
        public DbSet<Capture> Captures { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure Capture as a composite key
            modelBuilder.Entity<Capture>()
                .HasKey(c => new { c.PokemonId, c.TrainerId });

            // Configure relationships
            modelBuilder.Entity<Capture>()
                .HasOne(c => c.Pokemon)
                .WithMany()
                .HasForeignKey(c => c.PokemonId);

            modelBuilder.Entity<Capture>()
                .HasOne(c => c.Trainer)
                .WithMany()
                .HasForeignKey(c => c.TrainerId);
        }
    }
}