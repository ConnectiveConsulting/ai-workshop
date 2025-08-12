using System;

namespace Pokedex.API.Models
{
    public class CaptureDto
    {
        public int PokemonId { get; set; }
        public int TrainerId { get; set; }
        public DateTime CaptureDate { get; set; }
        
        // Navigation properties
        public PokemonDto? Pokemon { get; set; }
        public TrainerDto? Trainer { get; set; }
    }
}