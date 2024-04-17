using ManagementSystem.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ManagementSystem.Controllers
{
    public class StockController : Controller
    {
        private readonly MyDbContext _context;

        public StockController(MyDbContext context)
        {
            _context = context;
        }
        public ActionResult IngredientQuery()
        {
            return View();
        }

        public ActionResult MealQuery()
        {
            return View();
        }

        public ActionResult AddMeal()
        {
            return View();
        }

        public ActionResult MealPlanner() 
        {
            return View();
        }

    }
}
