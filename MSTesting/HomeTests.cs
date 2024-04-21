using ManagementSystem.Controllers.API;
using ManagementSystem.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MSTesting
{
    [TestFixture]
    public class FundingTests
    {
        private MyDbContext _context;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<MyDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDbForFundingUpdate")
                .Options;

            _context = new MyDbContext(options);

            // Seed the database
            _context.Funding.Add(new Funding { FundingId = 1, Amount = 30000 });
            _context.SaveChanges();
        }

        [Test]
        public async Task InputStoresInDBTest()
        {
            // Arrange
            var newAmount = 50000;
            var controller = new FundingController(_context);

            // Act: Fetch the existing entity and update its amount.
            var fundingToUpdate = await _context.Funding.FindAsync(1);
            fundingToUpdate.Amount = newAmount;
            await controller.PutFunding(fundingToUpdate.FundingId, fundingToUpdate);
            await _context.SaveChangesAsync();

            // Assert: Re-fetch the entity to confirm updates.
            var fundingDB = await _context.Funding.FindAsync(1);
            Assert.AreEqual(newAmount, fundingDB.Amount, "Funding amount should be updated in the database.");
        }

    }
}

