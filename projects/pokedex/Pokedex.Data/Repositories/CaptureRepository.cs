using Microsoft.EntityFrameworkCore;
using Pokedex.Core.Interfaces.Repositories;
using Pokedex.Core.Models;
using Pokedex.Data.Context;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pokedex.Data.Repositories
{
    public class CaptureRepository : ICaptureRepository
    {
        private readonly PokemonDbContext _context;

        public CaptureRepository(PokemonDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Capture>> GetAllAsync()
        {
            return await _context.Captures
                .Include(c => c.Pokemon)
                .Include(c => c.Trainer)
                .ToListAsync();
        }

        public async Task<IEnumerable<Capture>> GetByTrainerIdAsync(int trainerId)
        {
            return await _context.Captures
                .Include(c => c.Pokemon)
                .Include(c => c.Trainer)
                .Where(c => c.TrainerId == trainerId)
                .ToListAsync();
        }

        public async Task<Capture?> GetAsync(int pokemonId, int trainerId)
        {
            return await _context.Captures
                .Include(c => c.Pokemon)
                .Include(c => c.Trainer)
                .FirstOrDefaultAsync(c => c.PokemonId == pokemonId && c.TrainerId == trainerId);
        }

        public async Task<Capture> AddAsync(Capture capture)
        {
            await _context.Captures.AddAsync(capture);
            await _context.SaveChangesAsync();
            return capture;
        }

        public async Task<bool> DeleteAsync(int pokemonId, int trainerId)
        {
            var capture = await GetAsync(pokemonId, trainerId);
            if (capture == null)
                return false;

            _context.Captures.Remove(capture);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}