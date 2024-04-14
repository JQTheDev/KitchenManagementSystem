using Microsoft.EntityFrameworkCore;
using System.Security.AccessControl;
using ManagementSystem.Models;
using Microsoft.VisualStudio.Web.CodeGeneration.EntityFrameworkCore;

namespace ManagementSystem.Models
{
    public class MyDbContext : DbContext
    {
        public DbSet<User> User { get; set; }

        public DbSet<Funding> Funding { get; set; }

        public DbSet<Ingredient> Ingredient { get; set; }

        public DbSet<Meal> Meal { get; set; }

        public DbSet<MealIngredient> MealIngredient { get; set; }
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {
                
        }
    }
}
