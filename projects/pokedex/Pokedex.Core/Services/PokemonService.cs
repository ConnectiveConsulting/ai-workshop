using Pokedex.Core.Interfaces;
using Pokedex.Core.Interfaces.Repositories;
using Pokedex.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pokedex.Core.Services
{
    public class PokemonService : IPokemonService
    {
        private readonly IPokemonRepository _pokemonRepository;

        public PokemonService(IPokemonRepository pokemonRepository)
        {
            _pokemonRepository = pokemonRepository;
        }

        public async Task<IEnumerable<Pokemon>> GetAllPokemonAsync()
        {
            return await _pokemonRepository.GetAllAsync();
        }

        public async Task<Pokemon?> GetPokemonByIdAsync(int id)
        {
            return await _pokemonRepository.GetByIdAsync(id);
        }

        public async Task<Pokemon> AddPokemonAsync(Pokemon pokemon)
        {
            return await _pokemonRepository.AddAsync(pokemon);
        }

        public async Task<Pokemon?> UpdatePokemonAsync(Pokemon pokemon)
        {
            return await _pokemonRepository.UpdateAsync(pokemon);
        }

        public async Task<bool> DeletePokemonAsync(int id)
        {
            return await _pokemonRepository.DeleteAsync(id);
        }
    }
}