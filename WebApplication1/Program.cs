using BLL.Services;
using Contract.ServicesInterface;
using DAL;
using DAL.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using SimpleInjector;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;




// 1. Create a new Simple Injector container
var container = new Container();



var logConfig = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
//Initialize Logger    
Log.Logger = new LoggerConfiguration().ReadFrom.Configuration(logConfig)
    .Enrich.FromLogContext()
    .CreateLogger();

Log.Information("Starting web application");
    var builder = WebApplication.CreateBuilder();
    builder.Host.UseSerilog();
    builder.Services.AddInfrastructureServices(builder.Configuration);

    IServiceCollection services = builder.Services;

services.AddDbContext<SchoolContext>(opt =>
    {
        string connStr = builder.Configuration.GetConnectionString("SchoolContext");
        opt.UseSqlServer(connStr);
    });
    services.AddIdentity<User, SysRole>();// AddIdentityCore 仅注册 UserManager
    var idBuilder = new IdentityBuilder(typeof(User), typeof(SysRole), services);
    idBuilder.AddEntityFrameworkStores<SchoolContext>()
        .AddDefaultTokenProviders()
        .AddRoleManager<RoleManager<SysRole>>()
        .AddUserManager<UserManager<User>>();


    builder.Services.AddRazorPages();
    builder.Services.AddControllersWithViews();
    builder.Services.AddMvc().AddRazorRuntimeCompilation();

    // Sets up the basic configuration that for integrating Simple Injector with
    // ASP.NET Core by setting the DefaultScopedLifestyle, and setting up auto
    // cross wiring.
    services.AddSimpleInjector(container, options =>
    {
        // AddAspNetCore() wraps web requests in a Simple Injector scope and
        // allows request-scoped framework services to be resolved.
        options.AddAspNetCore()

            // Ensure activation of a specific framework type to be created by
            // Simple Injector instead of the built-in configuration system.
            // All calls are optional. You can enable what you need. For instance,
            // ViewComponents, PageModels, and TagHelpers are not needed when you
            // build a Web API.
            .AddControllerActivation()
            .AddViewComponentActivation()
            .AddPageModelActivation()
            .AddTagHelperActivation();

        // Optionally, allow application components to depend on the non-generic
        // ILogger (Microsoft.Extensions.Logging) or IStringLocalizer
        // (Microsoft.Extensions.Localization) abstractions.
        options.AddLogging();
        //options.AddLocalization();
      
    });
    // 2. Configure the container (register)
    // See below for more configuration examples
    container.Register<IDecorate, ConcreteDecorate>(Lifestyle.Scoped);
    container.RegisterDecorator<IDecorate, ConcreteDecorate1>(Lifestyle.Scoped);
    container.RegisterDecorator<IDecorate, ConcreteDecorate2>(Lifestyle.Scoped);
    //builder.Services.AddSimpleInjector(container); 

/*
//builder.Services.AddDefaultIdentity<User>();
//获取JWT参数，并注入到服务容器
var jwtConfig = new JWTConfig();
builder.Configuration.GetSection("JWT").Bind(jwtConfig);
builder.Services.AddSingleton(jwtConfig);
//添加JJWT方式的身份认证和授权，
builder.Services
    .AddAuthorization()
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, opt =>
    {
        opt.RequireHttpsMetadata = false;
        opt.TokenValidationParameters = JwtToken.CreateTokenValidationParameters(jwtConfig);
    });
*/
var app = builder.Build();
app.Services.UseSimpleInjector(container);
// 3. Verify the container's configuration.
container.Verify();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
    {
        app.UseExceptionHandler("/Home/Error");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }
    else
    {
        app.UseDeveloperExceptionPage();

        using var scope = app.Services.CreateScope();
        var initializer = scope.ServiceProvider.GetRequiredService<DbInitializer>();
        await initializer.InitialiseAsync();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        await initializer.SeedAsync(userManager);
    }


    app.UseHttpsRedirection();
    app.UseStaticFiles();
    //使用身份认证和授权的中间件
    app.UseAuthentication();
    app.UseAuthorization();
    /*
    #region 中间件

    app.MapGet("/hellosystem", (ILogger<Program> logger, HttpContext context) =>
    {
        var message = $"hello,system,{context.User?.Identity?.Name}";
        logger.LogInformation(message);

        return message;
    }).RequireAuthorization(new RoleData { Roles = "system" });

    app.MapGet("/helloadmin", (ILogger<Program> logger, HttpContext context) =>
    {
        var message = $"hello,admin,{context.User?.Identity?.Name}";
        logger.LogInformation(message);
        return message;
    }).RequireAuthorization(new RoleData { Roles = "admin" });

    app.MapGet("/helloall", (ILogger<Program> logger, HttpContext context) =>
    {
        var message = $"hello,all roles,{context.User?.Identity?.Name}";
        logger.LogInformation(message);
        return message;
    }).RequireAuthorization(new RoleData { Roles = "admin,system" });


    //登录成功，并分发Token
    app.MapPost("/login", [AllowAnonymous] (ILogger<Program> logger, LoginModel login, JWTConfig jwtConfig) =>
    {
        logger.LogInformation("login");
        if (login.UserName == "gsw" && login.Password == "111111")
        {
            var now = DateTime.UtcNow;
            var claims = new Claim[] {
                    new Claim(ClaimTypes.Role, "admin"),
                    new Claim(ClaimTypes.Name, "桂素伟"),
                    new Claim(ClaimTypes.Sid, login.UserName),
                    new Claim(ClaimTypes.Expiration, now.AddSeconds(jwtConfig.Expires).ToString())
                    };
            var token = JwtToken.BuildJwtToken(claims, jwtConfig);
            return token;
        }
        else if (login.UserName == "jerry" && login.Password == "111111")
        {
            var now = DateTime.UtcNow;
            var claims = new Claim[] {
                    new Claim(ClaimTypes.Role, "admin"),
                    new Claim(ClaimTypes.Name, "姚杰"),
                    new Claim(ClaimTypes.Sid, login.UserName),
                    new Claim(ClaimTypes.Expiration, now.AddSeconds(jwtConfig.Expires).ToString())
                    };
            var token = JwtToken.BuildJwtToken(claims, jwtConfig);
            return token;
        }
        else
        {
            return "username or password is error";
        }
    });
    #endregion
    */
    app.MapDefaultControllerRoute();
    app.MapRazorPages();
    app.Run();

//登录实体
public class LoginModel
{
    public string? UserName { get; set; }
    public string? Password { get; set; }
}
//JWT配置
public class JWTConfig
{
    public string? Secret { get; set; }
    public string? Issuer { get; set; }
    public string? Audience { get; set; }
    public int Expires { get; set; }
}
//JWT操作类型
public class JwtToken
{
    //获取Token
    public static dynamic BuildJwtToken(Claim[] claims, JWTConfig jwtConfig)
    {
        var now = DateTime.UtcNow;
        var jwt = new JwtSecurityToken(
            issuer: jwtConfig.Issuer,
            audience: jwtConfig.Audience,
            claims: claims,
            notBefore: now,
            expires: now.AddSeconds(jwtConfig.Expires),
            signingCredentials: GetSigningCredentials(jwtConfig)
        );
        var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
        var response = new
        {
            Status = true,
            AccessToken = encodedJwt,
            ExpiresIn = now.AddSeconds(jwtConfig.Expires),
            TokenType = "Bearer"
        };
        return response;
    }

    static SigningCredentials GetSigningCredentials(JWTConfig jwtConfig)
    {
        var keyByteArray = Encoding.ASCII.GetBytes(jwtConfig?.Secret!);
        var signingKey = new SymmetricSecurityKey(keyByteArray);
        return new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
    }
    //验证Token的参数
    public static TokenValidationParameters CreateTokenValidationParameters(JWTConfig jwtConfig)
    {
        var keyByteArray = Encoding.ASCII.GetBytes(jwtConfig?.Secret!);
        var signingKey = new SymmetricSecurityKey(keyByteArray);
        return new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = signingKey,
            ValidateIssuer = true,
            ValidIssuer = jwtConfig?.Issuer,
            ValidateAudience = true,
            ValidAudience = jwtConfig?.Audience,
            ClockSkew = TimeSpan.Zero,
            RequireExpirationTime = true,
        };
    }
}
//mini api添加验证授权的参数类型
public class RoleData : IAuthorizeData
{
    public string? Policy { get; set; }
    public string? Roles { get; set; }
    public string? AuthenticationSchemes { get; set; }
}