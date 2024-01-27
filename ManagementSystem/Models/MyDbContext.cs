using Microsoft.EntityFrameworkCore;
using System.Security.AccessControl;
using ManagementSystem.Models;

namespace ManagementSystem.Models
{
    public class MyDbContext : DbContext
    {
        public DbSet<User> User { get; set; }

        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {
                
        }
    }
}
