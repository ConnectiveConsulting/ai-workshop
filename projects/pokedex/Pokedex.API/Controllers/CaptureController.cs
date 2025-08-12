using Microsoft.AspNetCore.Mvc;
using Pokedex.API.Models;
using Pokedex.Core.Interfaces;
using Pokedex.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pokedex.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CaptureController : ControllerBase
    {
        private readonly ICaptureService _captureService;
        private readonly IPokemonService _pokemonService;
        private readonly ITrainerService _trainerService;

        public CaptureController(
            ICaptureService captureService,
            IPokemonService pokemonService,
            ITrainerService trainerService)
        {
            _captureService = captureService;
            _pokemonService = pokemonService;
            _trainerService = trainerService;
        }

        // GET: api/Capture
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CaptureDto>>> GetCaptures()
        {
            var captures = await _captureService.GetAllCapturesAsync();
            var captureDtos = new List<CaptureDto>();

            foreach (var capture in captures)
            {
                captureDtos.Add(MapToCaptureDto(capture));
            }

            return Ok(captureDtos);
        }

        // GET: api/Capture/trainer/5
        [HttpGet("trainer/{trainerId}")]
        public async Task<ActionResult<IEnumerable<CaptureDto>>> GetCapturesByTrainer(int trainerId)
        {
            var captures = await _captureService.GetCapturesByTrainerIdAsync(trainerId);
            var captureDtos = new List<CaptureDto>();

            foreach (var capture in captures)
            {
                captureDtos.Add(MapToCaptureDto(capture));
            }

            return Ok(captureDtos);
        }

        // GET: api/Capture/5/3
        [HttpGet("{pokemonId}/{trainerId}")]
        public async Task<ActionResult<CaptureDto>> GetCapture(int pokemonId, int trainerId)
        {
            var capture = await _captureService.GetCaptureAsync(pokemonId, trainerId);

            if (capture == null)
            {
                return NotFound();
            }

            return Ok(MapToCaptureDto(capture));
        }

        // POST: api/Capture
        [HttpPost]
        public async Task<ActionResult<CaptureDto>> CreateCapture(CaptureDto captureDto)
        {
            // Verify Pokemon exists
            var pokemon = await _pokemonService.GetPokemonByIdAsync(captureDto.PokemonId);
            if (pokemon == null)
            {
                return BadRequest("Pokemon not found");
            }

            // Verify Trainer exists
            var trainer = await _trainerService.GetTrainerByIdAsync(captureDto.TrainerId);
            if (trainer == null)
            {
                return BadRequest("Trainer not found");
            }

            var capture = new Capture
            {
                PokemonId = captureDto.PokemonId,
                TrainerId = captureDto.TrainerId,
                CaptureDate = captureDto.CaptureDate
            };

            var createdCapture = await _captureService.AddCaptureAsync(capture);

            return CreatedAtAction(
                nameof(GetCapture), 
                new { pokemonId = createdCapture.PokemonId, trainerId = createdCapture.TrainerId }, 
                MapToCaptureDto(createdCapture));
        }

        // DELETE: api/Capture/5/3
        [HttpDelete("{pokemonId}/{trainerId}")]
        public async Task<IActionResult> DeleteCapture(int pokemonId, int trainerId)
        {
            var result = await _captureService.DeleteCaptureAsync(pokemonId, trainerId);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        private CaptureDto MapToCaptureDto(Capture capture)
        {
            var captureDto = new CaptureDto
            {
                PokemonId = capture.PokemonId,
                TrainerId = capture.TrainerId,
                CaptureDate = capture.CaptureDate
            };

            if (capture.Pokemon != null)
            {
                captureDto.Pokemon = new PokemonDto
                {
                    Id = capture.Pokemon.Id,
                    Name = capture.Pokemon.Name,
                    Type = capture.Pokemon.Type,
                    ImageUrl = capture.Pokemon.ImageUrl
                };
            }

            if (capture.Trainer != null)
            {
                captureDto.Trainer = new TrainerDto
                {
                    Id = capture.Trainer.Id,
                    Name = capture.Trainer.Name,
                    Region = capture.Trainer.Region
                };
            }

            return captureDto;
        }
    }
}