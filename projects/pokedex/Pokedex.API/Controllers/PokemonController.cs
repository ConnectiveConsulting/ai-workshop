using Microsoft.AspNetCore.Mvc;
using Pokedex.API.Models;
using Pokedex.Core.Interfaces;
using Pokedex.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pokedex.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PokemonController : ControllerBase
    {
        private readonly IPokemonService _pokemonService;

        public PokemonController(IPokemonService pokemonService)
        {
            _pokemonService = pokemonService;
        }

        // GET: api/Pokemon
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PokemonDto>>> GetPokemons()
        {
            var pokemons = await _pokemonService.GetAllPokemonAsync();
            var pokemonDtos = new List<PokemonDto>();

            foreach (var pokemon in pokemons)
            {
                pokemonDtos.Add(new PokemonDto
                {
                    Id = pokemon.Id,
                    Name = pokemon.Name,
                    Type = pokemon.Type,
                    ImageUrl = pokemon.ImageUrl
                });
            }

            return Ok(pokemonDtos);
        }

        // GET: api/Pokemon/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PokemonDto>> GetPokemon(int id)
        {
            var pokemon = await _pokemonService.GetPokemonByIdAsync(id);

            if (pokemon == null)
            {
                return NotFound();
            }

            var pokemonDto = new PokemonDto
            {
                Id = pokemon.Id,
                Name = pokemon.Name,
                Type = pokemon.Type,
                ImageUrl = pokemon.ImageUrl
            };

            return Ok(pokemonDto);
        }

        // POST: api/Pokemon
        [HttpPost]
        public async Task<ActionResult<PokemonDto>> CreatePokemon(PokemonDto pokemonDto)
        {
            var pokemon = new Pokemon
            {
                Name = pokemonDto.Name,
                Type = pokemonDto.Type,
                ImageUrl = pokemonDto.ImageUrl
            };

            var createdPokemon = await _pokemonService.AddPokemonAsync(pokemon);

            pokemonDto.Id = createdPokemon.Id;

            return CreatedAtAction(nameof(GetPokemon), new { id = pokemonDto.Id }, pokemonDto);
        }

        // PUT: api/Pokemon/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePokemon(int id, PokemonDto pokemonDto)
        {
            Console.WriteLine($"Received PUT request for Pokemon ID: {id}");
            Console.WriteLine($"Request body Pokemon ID: {pokemonDto.Id}");
            Console.WriteLine($"Request body data: Name={pokemonDto.Name}, Type={pokemonDto.Type}, ImageUrl={pokemonDto.ImageUrl}");
            
            if (id != pokemonDto.Id)
            {
                Console.WriteLine($"ID mismatch: URL ID {id} != Body ID {pokemonDto.Id}");
                return BadRequest();
            }

            var pokemon = new Pokemon
            {
                Id = pokemonDto.Id,
                Name = pokemonDto.Name,
                Type = pokemonDto.Type,
                ImageUrl = pokemonDto.ImageUrl
            };

            var updatedPokemon = await _pokemonService.UpdatePokemonAsync(pokemon);

            if (updatedPokemon == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/Pokemon/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePokemon(int id)
        {
            var result = await _pokemonService.DeletePokemonAsync(id);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}