using Common;
using Contract.ServicesInterface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Linq.Expressions;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IDecorate _decorate;
        public HomeController(ILogger<HomeController> logger, IDecorate decorate)
        {
            _logger = logger;
            _decorate = decorate;
        }

        public IActionResult Index()
        {
            _decorate.Do();
            return View();
        }
        public IActionResult D3()
        {
            return View();
        }
        public IActionResult D3Transformation()
        {
            return View();
        }
        public IActionResult CreatePdf()
        {
            PdfHelper pdfHelper = new PdfHelper();
            pdfHelper.CreatePdf();
            string content = pdfHelper.ReadPdf();
            ViewBag.Content = content;
            return View();
        }
        public IActionResult XssTest()
        {
            return View();
        }
        public IActionResult ClearFixTest()
        {
            return View();
        }
        public IActionResult CustomerTag()
        {
            return View();
        }
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        public IActionResult FileUploadTest()
        {
            return View();
        }
        public IActionResult Upload([FromForm]IFormFileCollection files)
        {
            return Json(new { files = new List<Object>() { new { name = "test" } } });
        }
        [HttpGet]
        public IActionResult ExpressionTest()
        {
            Expression<Func<int, int>> expression = (int a) => a * a;
            var lambda = expression.Compile();
            var el = expression.Parameters.Single();
            ViewData["lambdaResult"] = lambda(5);
            String str = "hell9";
            _logger.LogInformation("is :"+str.Equals("hell9").ToString()); ;
            Type type = str.GetType();
            var mymethod =  type.GetMethod("op_Equality");//   op_Equality
            var ret = mymethod.Invoke(null,new object[] { "hell9",str });
            ViewData["ret"] = ret;
            foreach (var method in type.GetMethods()) {
                if (method.Name.IndexOf("Equ") >= 0) { 
                _logger.LogInformation(method.Name);
                _logger.LogInformation(method.IsPublic.ToString());
                }
            }
            return View();
        }
        [HttpGet]
        public IActionResult FontAwesome()
        {
            ViewBag.UserName = User.Identity?.Name;
            return View();
        }
            [HttpGet]
        public IActionResult SelectManyTest()
        {
            List<Person> personList = new List<Person>
            {
                new Person
                {
                    Name = "P1", Age = 18, Gender = "Male",
                    Dogs = new Dog[]
                    {
                        new Dog { Name = "D1" },
                        new Dog { Name = "D2" }
                    }
                },
                new Person
                {
                    Name = "P2", Age = 19, Gender = "Male",
                    Dogs = new Dog[]
                    {
                        new Dog { Name = "D3" }
                    }
                },
                new Person
                {
                    Name = "P3", Age = 17,Gender = "Female",
                    Dogs = new Dog[]
                    {
                        new Dog { Name = "D4" },
                        new Dog { Name = "D5" },
                        new Dog { Name = "D6" }
                    }
                }
            };
            var dogs = personList.SelectMany(p => p.Dogs);
            foreach (var dog in dogs)
            {
                Console.WriteLine(dog.Name);
            }
            return Ok();
        }
    }
    public class Person
    {
        public string Name { set; get; }
        public int Age { set; get; }
        public string Gender { set; get; }
        public Dog[] Dogs { set; get; }
    }
    public class Dog
    {
        public string Name { set; get; }
    }
}