using ManagementSystem.Controllers.API;
using ManagementSystem.Models;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System.Threading.Tasks;

namespace MSTesting
{
    [TestFixture]
    public class MealTests
    {
        private MyDbContext _context;
        private MealsController _controller;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<MyDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDbForMealActions")
                .Options;

            _context = new MyDbContext(options);
            _controller = new MealsController(_context);

            // initialise the database
            _context.Meal.Add(new Meal { MealId = 1, Name = "Pasta" });
            _context.SaveChanges();
        }

        [Test]
        public async Task DeleteMealTest()
        {
            // Act
            var result = await _controller.DeleteMeal(1);

            // Assert
            var mealFromDb = await _context.Meal.FindAsync(1);
            Assert.IsNull(mealFromDb, "Meal should be deleted from the database.");
        }

        [TearDown]
        public void TearDown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
