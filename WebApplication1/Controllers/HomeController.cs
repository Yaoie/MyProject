using Common;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
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
    }
}