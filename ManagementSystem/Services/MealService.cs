using ManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static global::ManagementSystem.Controllers.API.MealsController;

namespace ManagementSystem.Services
{
    public class MealService
    {
        private readonly FuzzyLogicManager _fuzzyLogicManager;
        private readonly MyDbContext _context;
        private readonly ILogger<MealService> _logger;

        public MealService(MyDbContext context, ILogger<MealService> logger)
        {
            _fuzzyLogicManager = new FuzzyLogicManager();
            _context = context;
            _logger = logger;
        }

        public async Task<ActionResult<IEnumerable<object>>> SelectMostNutritiousMeals(MealSelectionDto selection)
        {
            try
            {
                var mealsWithIngredients = await _context.Meal
                                                        .Where(m => selection.MealIds.Contains(m.MealId))
                                                        .Include(m => m.MealIngredients)
                                                        .ThenInclude(mi => mi.Ingredient)
                                                        .ToListAsync();

                var evaluatedMeals = new List<MealEvaluationDto>();

                foreach (var meal in mealsWithIngredients)
                {
                    double totalCalories = 0;
                    double totalFat = 0;
                    double totalSalt = 0;
                    decimal totalPrice = 0;

                    foreach (var mi in meal.MealIngredients)
                    {
                        totalCalories += mi.Ingredient.Calories.HasValue ? mi.Ingredient.Calories.Value * (double)mi.Quantity : 0;
                        totalFat += mi.Ingredient.Fat.HasValue ? mi.Ingredient.Fat.Value * (double)mi.Quantity : 0;
                        totalSalt += mi.Ingredient.Salt.HasValue ? mi.Ingredient.Salt.Value * (double)mi.Quantity : 0;
                        totalPrice += mi.Ingredient.Price * mi.Quantity;
                    }

                    string nutritionLabel = _fuzzyLogicManager.EvaluateMealNutrition(totalCalories, totalFat, totalSalt);

                    evaluatedMeals.Add(new MealEvaluationDto
                    {
                        Meal = meal,
                        NutritionLabel = nutritionLabel,
                        Price = totalPrice
                    });
                }

                var affordableAndNutritiousMeals = evaluatedMeals
                    .Where(e => e.Price * selection.MouthsToFeed <= selection.TotalBudget)
                    .OrderByDescending(e => e.NutritionLabel)
                    .ToList();

                decimal budgetUsed = 0;
                List<object> recommendedMeals = new List<object>();
                foreach (var meal in affordableAndNutritiousMeals)
                {
                    decimal costForAll = meal.Price * selection.MouthsToFeed;
                    if (budgetUsed + costForAll <= selection.TotalBudget)
                    {
                        recommendedMeals.Add(new
                        {
                            MealId = meal.Meal.MealId,
                            Name = meal.Meal.Name,
                            NutritionLabel = meal.NutritionLabel,
                            PricePerMeal = meal.Price,
                            TotalPrice = costForAll
                        });
                        budgetUsed += costForAll;
                    }
                    if (recommendedMeals.Count == 3) break; // Limit to 3 most nutritious meals within budget
                }

                return recommendedMeals;
            }
            catch (Exception ex)
            {
                // Log the exception details for debugging purposes
                _logger.LogError(ex, "An error occurred while selecting nutritious meals.");

                // Return a meaningful error message to the client
                return new ObjectResult(new { message = "An error occurred while processing your request." })
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
        }


        // DTO(Data Transfer Object) to hold meal evaluations
        private class MealEvaluationDto
        {
            public Meal Meal { get; set; }
            public string NutritionLabel { get; set; }
            public decimal Price { get; set; }
        }

    }
}


