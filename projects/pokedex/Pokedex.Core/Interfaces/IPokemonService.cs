using Pokedex.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pokedex.Core.Interfaces
{
    public interface IPokemonService
    {
        Task<IEnumerable<Pokemon>> GetAllPokemonAsync();
        Task<Pokemon?> GetPokemonByIdAsync(int id);
        Task<Pokemon> AddPokemonAsync(Pokemon pokemon);
        Task<Pokemon?> UpdatePokemonAsync(Pokemon pokemon);
        Task<bool> DeletePokemonAsync(int id);
    }
}