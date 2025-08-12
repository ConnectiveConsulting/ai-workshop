using System;

namespace Pokedex.Core.Models
{
    public class Capture
    {
        public int PokemonId { get; set; }
        public int TrainerId { get; set; }
        public DateTime CaptureDate { get; set; }
        
        // Navigation properties
        public Pokemon? Pokemon { get; set; }
        public Trainer? Trainer { get; set; }
    }
}