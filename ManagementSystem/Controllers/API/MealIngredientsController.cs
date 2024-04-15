using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ManagementSystem.Models;

namespace ManagementSystem.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class MealIngredientsController : ControllerBase
    {
        private readonly MyDbContext _context;

        public MealIngredientsController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/MealIngredients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MealIngredient>>> GetMealIngredient()
        {
            return await _context.MealIngredient.ToListAsync();
        }

        // GET: api/MealIngredients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MealIngredient>> GetMealIngredient(int id)
        {
            var mealIngredient = await _context.MealIngredient.FindAsync(id);

            if (mealIngredient == null)
            {
                return NotFound();
            }

            return mealIngredient;
        }

        // GET: api/MealIngredients/ByMeal/5
        [HttpGet("ByMeal/{mealId}")]
        public async Task<ActionResult<IEnumerable<MealIngredient>>> GetIngredientsByMeal(int mealId)
        {
            var mealIngredients = await _context.MealIngredient
                                                .Where(mi => mi.MealId == mealId)
                                                .Include(mi => mi.Ingredient)
                                                .ToListAsync();

            if (mealIngredients == null || mealIngredients.Count == 0)
            {
                return NotFound();
            }

            return mealIngredients;
        }

        // PUT: api/MealIngredients/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMealIngredient(int id, MealIngredient mealIngredient)
        {
            if (id != mealIngredient.MealIngredientId)
            {
                return BadRequest();
            }

            _context.Entry(mealIngredient).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MealIngredientExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/MealIngredients
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<MealIngredient>> PostMealIngredient(MealIngredient mealIngredient)
        {
            _context.MealIngredient.Add(mealIngredient);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMealIngredient", new { id = mealIngredient.MealIngredientId }, mealIngredient);
        }

        // DELETE: api/MealIngredients/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMealIngredient(int id)
        {
            var mealIngredient = await _context.MealIngredient.FindAsync(id);
            if (mealIngredient == null)
            {
                return NotFound();
            }

            _context.MealIngredient.Remove(mealIngredient);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MealIngredientExists(int id)
        {
            return _context.MealIngredient.Any(e => e.MealIngredientId == id);
        }
    }
}
