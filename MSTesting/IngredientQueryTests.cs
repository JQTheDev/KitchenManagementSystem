using ManagementSystem.Controllers.API;
using ManagementSystem.Models;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System.Threading.Tasks;

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

            // Seed the database
            _context.Ingredient.Add(new Ingredient { IngredientId = 1, Name = "Tomato", Calories = 20, Salt = (float)0.2, Fat = (float)0.2, Quantity = 10 });
            _context.SaveChanges();
        }

        [Test]
        public async Task UpdateIngredientTest()
        {
            // Arrange
            //var updatedIngredient = new Ingredient { IngredientId = 1, Name = "Tomato", Calories = 22, Salt = (float)0.3, Fat = (float)0.25, Quantity = 15 };
            float newSalt = (float)0.3;
            float newFat = (float)0.4;
            // Act
            var updatedIngredient = await _context.Ingredient.FindAsync(1);
            updatedIngredient.Salt = newSalt;
            updatedIngredient.Fat = newFat;
            var result = await _controller.PutIngredient(updatedIngredient.IngredientId, updatedIngredient);

            // Assert
            var ingredientFromDb = await _context.Ingredient.FindAsync(1);
            Assert.AreEqual(newSalt, ingredientFromDb.Salt);
            Assert.AreEqual(newFat, ingredientFromDb.Fat);

        }

        [Test]
        public async Task DeleteIngredientTest()
        {
            // Act
            var result = await _controller.DeleteIngredient(1);

            // Assert
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

