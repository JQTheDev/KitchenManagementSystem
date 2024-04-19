﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ManagementSystem.Models;
using ManagementSystem.Services;

namespace ManagementSystem.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class MealsController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly MealService _mealService;

        public MealsController(MyDbContext context)
        {
            _context = context;
            _mealService = new MealService(context);
        }

        // GET: api/Meals
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Meal>>> GetMeal()
        {
            return await _context.Meal.ToListAsync();
        }

        // GET: api/Meals/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Meal>> GetMeal(int id)
        {
            var meal = await _context.Meal.FindAsync(id);

            if (meal == null)
            {
                return NotFound();
            }

            return meal;
        }
        [HttpGet("ValidateMeal/{mealId}")]
        public async Task<IActionResult> ValidateMeal(int mealId)
        {
            var mealIngredients = await _context.MealIngredient
                                                .Where(mi => mi.MealId == mealId)
                                                .Include(mi => mi.Ingredient)
                                                .ToListAsync();

            if (mealIngredients == null || !mealIngredients.Any())
            {
                return NotFound(new { Message = "Meal not found or has no ingredients." });
            }

            foreach (var mi in mealIngredients)
            {
                // Check for null or zero values
                if (mi.Ingredient.Fat == null || mi.Ingredient.Fat <= 0 ||
                    mi.Ingredient.Salt == null || mi.Ingredient.Salt <= 0 ||
                    mi.Ingredient.Calories == null || mi.Ingredient.Calories <= 0)
                {
                    return BadRequest(new { Message = "Meal contains ingredients with incomplete or invalid nutritional data." });
                }
            }

            return Ok(new { Message = "Meal is valid for planning." });
        }

        // PUT: api/Meals/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMeal(int id, Meal meal)
        {
            if (id != meal.MealId)
            {
                return BadRequest();
            }

            _context.Entry(meal).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MealExists(id))
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

        // POST: api/Meals
        [HttpPost]
        public async Task<ActionResult<Meal>> PostMeal(Meal meal)
        {
            _context.Meal.Add(meal);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMeal", new { id = meal.MealId }, meal);
        }

        // DELETE: api/Meals/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMeal(int id)
        {
            var meal = await _context.Meal.FindAsync(id);
            if (meal == null)
            {
                return NotFound();
            }

            _context.Meal.Remove(meal);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MealExists(int id)
        {
            return _context.Meal.Any(e => e.MealId == id);
        }

        [HttpPost("WithIngredients")]
        public async Task<ActionResult<Meal>> PostMealWithIngredients(MealWithIngredientsDto mealWithIngredients)
        {
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                var meal = new Meal
                {
                    Name = mealWithIngredients.Name,
                };

                _context.Meal.Add(meal);
                await _context.SaveChangesAsync();

                foreach (var ingredient in mealWithIngredients.Ingredients)
                {
                    var mealIngredient = new MealIngredient
                    {
                        MealId = meal.MealId,
                        IngredientId = ingredient.IngredientId,
                        Quantity = ingredient.Quantity
                    };
                    _context.MealIngredient.Add(mealIngredient);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return CreatedAtAction("GetMeal", new { id = meal.MealId }, meal);
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        [HttpPost("SelectMeals")]
        public async Task<ActionResult<IEnumerable<Meal>>> SelectMeals([FromBody] MealSelectionDto selection)
        {
            try
            {
                // Call the method to get the most nutritious meals within budget
                var recommendedMeals = await _mealService.SelectMostNutritiousMeals(selection);

                if (recommendedMeals == null || !recommendedMeals.Any())
                {
                    return NotFound("No meals found that meet the criteria.");
                }

                // This returns the recommended meals to the client
                return Ok(recommendedMeals);
            }
            catch (Exception ex)
            {
                // Log the exception details here to debug issues
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }



        public class MealWithIngredientsDto
        {
            public string Name { get; set; }
            public List<IngredientDto> Ingredients { get; set; }
        }

        public class IngredientDto
        {
            public int IngredientId { get; set; }
            public decimal Quantity { get; set; }
        }

        public class MealSelectionDto
        {
            public int MouthsToFeed { get; set; }
            public decimal TotalBudget { get; set; }
            public List<int> MealIds { get; set; }

            public MealSelectionDto()
            {
                MealIds = new List<int>();
            }
        }

    }
}
