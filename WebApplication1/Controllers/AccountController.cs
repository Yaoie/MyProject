using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace WebApplication1.Controllers
{
    public class LoginViewModel { }
    public class AccountController : Controller
    {
        TokenGenerator tokenGenerator;
        public AccountController(IConfiguration Configuration)
        {
            this.tokenGenerator = new TokenGenerator(Configuration);
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Privacy2() {
            return Content($"{ClaimTypes.Name}-{ClaimTypes.NameIdentifier}");
        }
        [Authorize]
        public IActionResult Privacy()
        {

    //        var value = HttpContext.User?.Claims
    //?.FirstOrDefault(x => x.Type == "Name")
    //?.Value;
            var value2 = User.Identity?.Name;
            //        var value3 = HttpContext.User?.Claims
            //?.FirstOrDefault(x => x.Type == ClaimTypes.Name)
            //?.Value;
            //        var auth = HttpContext.AuthenticateAsync().Result.Principal.Claims;
            //        var userName = auth.FirstOrDefault(t => t.Type.Equals(ClaimTypes.NameIdentifier))?.Value;
            // return Content("hello-"+ value??"" +"-"+ value2+"-"+value3+"-"+ userName);
            return Content("hello-" + value2 );
        }
        public IActionResult Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Email or Password can not be empty");
            }
            var token = tokenGenerator.CreateToken();
            return Ok(token);
        }

    }//https://www.cnblogs.com/superstar/p/16491428.html
    public class JWTOptions
    {
        public static string Position = "JWT";

        public string SecretKey { get; set; } = String.Empty;
        public string Issuer { get; set; } = String.Empty;
        public int Expires { get; set; }
        public string Audience { get; set; } = String.Empty;
    }
    public class TokenGenerator
    {
        private readonly IConfiguration Configuration;
        public JWTOptions jWTOptions { get; private set; }
        public TokenGenerator(IConfiguration configuration)
        {
            Configuration = configuration;
            ;
        }
        public string CreateToken()
        {
            // 1. 定义需要使用到的Claims
            var claims = new[]
            {
                //new Claim("Id", "9527"),
                //new Claim("Name", "Admin"),
               //new Claim(ClaimTypes.NameIdentifier,"ClaimTypes.NameIdentifier"),
                new Claim(ClaimTypes.Name,"ClaimTypes.Name"),
                 new Claim(ClaimTypes.Expiration, DateTime.Now.AddSeconds(3600).ToString())

            };

            // 2. 从 appsettings.json 中读取SecretKey
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:SecretKey"]));

            // 3. 选择加密算法
            var algorithm = SecurityAlgorithms.HmacSha256;

            // 4. 生成Credentials
            var signingCredentials = new SigningCredentials(secretKey, algorithm);

            // 5. 从 appsettings.json 中读取Expires
            var expires = Convert.ToDouble(Configuration["JWT:Expires"]);

            // 6. 根据以上，生成token
            var token = new JwtSecurityToken(
                Configuration["JWT:Issuer"],     //Issuer
                Configuration["JWT:Audience"],   //Audience
                claims,                          //Claims,
                DateTime.Now,                    //notBefore
                DateTime.Now.AddDays(expires),   //expires
                signingCredentials               //Credentials
            );

            // 7. 将token变为string
            var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

            return jwtToken;
        }

    }
}
