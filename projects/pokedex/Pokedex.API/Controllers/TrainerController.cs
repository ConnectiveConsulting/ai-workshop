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
    public class TrainerController : ControllerBase
    {
        private readonly ITrainerService _trainerService;

        public TrainerController(ITrainerService trainerService)
        {
            _trainerService = trainerService;
        }

        // GET: api/Trainer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TrainerDto>>> GetTrainers()
        {
            var trainers = await _trainerService.GetAllTrainersAsync();
            var trainerDtos = new List<TrainerDto>();

            foreach (var trainer in trainers)
            {
                trainerDtos.Add(new TrainerDto
                {
                    Id = trainer.Id,
                    Name = trainer.Name,
                    Region = trainer.Region
                });
            }

            return Ok(trainerDtos);
        }

        // GET: api/Trainer/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TrainerDto>> GetTrainer(int id)
        {
            var trainer = await _trainerService.GetTrainerByIdAsync(id);

            if (trainer == null)
            {
                return NotFound();
            }

            var trainerDto = new TrainerDto
            {
                Id = trainer.Id,
                Name = trainer.Name,
                Region = trainer.Region
            };

            return Ok(trainerDto);
        }

        // POST: api/Trainer
        [HttpPost]
        public async Task<ActionResult<TrainerDto>> CreateTrainer(TrainerDto trainerDto)
        {
            var trainer = new Trainer
            {
                Name = trainerDto.Name,
                Region = trainerDto.Region
            };

            var createdTrainer = await _trainerService.AddTrainerAsync(trainer);

            trainerDto.Id = createdTrainer.Id;

            return CreatedAtAction(nameof(GetTrainer), new { id = trainerDto.Id }, trainerDto);
        }

        // PUT: api/Trainer/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTrainer(int id, TrainerDto trainerDto)
        {
            if (id != trainerDto.Id)
            {
                return BadRequest();
            }

            var trainer = new Trainer
            {
                Id = trainerDto.Id,
                Name = trainerDto.Name,
                Region = trainerDto.Region
            };

            var updatedTrainer = await _trainerService.UpdateTrainerAsync(trainer);

            if (updatedTrainer == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/Trainer/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrainer(int id)
        {
            var result = await _trainerService.DeleteTrainerAsync(id);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}