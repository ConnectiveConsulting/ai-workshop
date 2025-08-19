using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Project.Models;

namespace Project.Controllers
{
    public class GameStateStorage
    {
        private const string CacheKey = "HangmanGame";
        private MemoryCache _cache;

        public GameStateStorage()
        {
            _cache = new MemoryCache(Options.Create(new MemoryCacheOptions()));
        }

        public void SetGameState(HangmanGame value)
        {
            _cache.Set(CacheKey, System.Text.Json.JsonSerializer.Serialize(value));
        }

        public HangmanGame GetGameState()
        {
            var strValue = _cache.Get<string>(CacheKey);

            if (string.IsNullOrEmpty(strValue))
            {
                var newValue = new HangmanGame();
                SetGameState(newValue);
                return newValue;
            }

            var value = System.Text.Json.JsonSerializer.Deserialize<HangmanGame>(strValue);
            return value ?? new HangmanGame();
        }
    }
}
