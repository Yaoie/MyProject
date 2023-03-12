using DAL.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class DbInitializer
    {
        private readonly SchoolContext _context;
        private readonly ILogger<DbInitializer> _logger;

        public DbInitializer(ILogger<DbInitializer> logger, SchoolContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task InitialiseAsync()
        {
            try
            {
                if (_context.Database.IsSqlServer())
                    /*await _context.Database.MigrateAsync();*/
                    await _context.Database.EnsureCreatedAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while initialising the database.");
                throw;
            }
        }

        public async Task SeedAsync(UserManager<User> userManager)
        {
            try
            {
                await CreateUserAsync(userManager); 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while seeding the database.");
                throw;
            }
        }

        

        private async Task CreateUserAsync(UserManager<User> userManager)
        {
            if (!_context.Users.Any())
            {
                var user = new User { UserName = "JL001", Email = "JL@abc.com", EmailConfirmed = true };
                var result = await userManager.CreateAsync(user, "JL@abc.com1");
                await _context.SaveChangesAsync();
            }
        }
    }
}
