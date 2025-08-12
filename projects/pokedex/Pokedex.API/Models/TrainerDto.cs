namespace Pokedex.API.Models
{
    public class TrainerDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Region { get; set; } = string.Empty;
    }
}