
using Microsoft.AspNetCore.Http;
using Project.Models;

namespace Project.Controllers
{
    public class GameStateStorage
    {
        private const string SessionKey = "HangmanGame";
        private readonly ISession _session;

        public GameStateStorage(IHttpContextAccessor httpContextAccessor)
        {
            _session = httpContextAccessor.HttpContext.Session;
        }

        public void SetGameState(HangmanGame value)
        {
            var json = System.Text.Json.JsonSerializer.Serialize(value);
            _session.SetString(SessionKey, json);
        }

        public HangmanGame GetGameState()
        {
            var strValue = _session.GetString(SessionKey);
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
