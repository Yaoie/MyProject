using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DAL;

public static class ConfigureServices
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        if (configuration.GetValue<bool>("UseInMemoryDatabase"))
            services.AddDbContext<SchoolContext>(options =>
                options.UseInMemoryDatabase("LocalDb"));
        else
            /*services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                    builder => builder.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));*/
            services.AddDbContext<SchoolContext>(options =>
            {
                //options.EnableSensitiveDataLogging(false);
                options.LogTo(Console.WriteLine);
                options.UseSqlServer(configuration.GetConnectionString("SchoolContext"),
                    x => x.EnableRetryOnFailure());
                
            });

        /*services.AddScoped(provider => provider.GetRequiredService<ApplicationDbContext>());*/
        services.AddScoped<DbInitializer>();
        //services.AddScoped<UserManager<User>>();

        return services;
    }
}