using ManagementSystem.Controllers.API;
using ManagementSystem.Models;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace MSTesting
{
    [TestFixture]
    public class IngredientsTests
    {
        private MyDbContext _context;
        private IngredientsController _controller;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<MyDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDbForIngredientActions")
                .Options;

            _context = new MyDbContext(options);
            _controller = new IngredientsController(_context);

            _context.Ingredient.Add(new Ingredient { IngredientId = 1, Name = "Tomato", Calories = 20, Salt = (float)0.2, Fat = (float)0.2, Quantity = 10 });
            _context.SaveChanges();
        }

        [Test]
        public async Task AddIngredientTest()
        {

            var newIngredient = new Ingredient { Name = "Spinach", Calories = 23, Salt = 0.1f, Fat = 0.1f, Quantity = 20 };
            var result = await _controller.PostIngredient(newIngredient);

            var dbIngredient = _context.Ingredient.FirstOrDefault(x => x.Name == newIngredient.Name);
            Assert.AreEqual(newIngredient, dbIngredient);
            
        }

        [Test]
        public async Task UpdateIngredientTest()
        {
            
            float newSalt = (float)0.3;
            float newFat = (float)0.4;

            var updatedIngredient = await _context.Ingredient.FindAsync(1);
            updatedIngredient.Salt = newSalt;
            updatedIngredient.Fat = newFat;
            var result = await _controller.PutIngredient(updatedIngredient.IngredientId, updatedIngredient);

            var ingredientFromDb = await _context.Ingredient.FindAsync(1);
            Assert.AreEqual(newSalt, ingredientFromDb.Salt);
            Assert.AreEqual(newFat, ingredientFromDb.Fat);

        }

        [Test]
        public async Task DeleteIngredientTest()
        {
            var result = await _controller.DeleteIngredient(1);

            var ingredientFromDb = await _context.Ingredient.FindAsync(1);
            Assert.IsNull(ingredientFromDb);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}

