using Microsoft.AspNetCore.Mvc;
using Project.Models;

namespace Project.Controllers
{
    public class HangmanController : Controller
    {
        private static GameStateStorage _stateStorage;

        static HangmanController()
        {
            _stateStorage = new GameStateStorage();
        }

        public IActionResult Index()
        {
            var game = _stateStorage.GetGameState();
            return View(game);
        }

        [HttpPost]
        public IActionResult Guess(string letter)
        {
            var game = _stateStorage.GetGameState();
            if (!string.IsNullOrEmpty(letter) && char.IsLetter(letter[0]))
                game.Guess(letter[0]);
            _stateStorage.SetGameState(game);
            return RedirectToAction("Index");
        }

        public IActionResult NewGame()
        {
            var game = new HangmanGame();
            _stateStorage.SetGameState(game);
            return RedirectToAction("Index");
        }
    }
}
