using Microsoft.AspNetCore.Mvc;

namespace Project.Controllers
{
    public class HangmanController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
