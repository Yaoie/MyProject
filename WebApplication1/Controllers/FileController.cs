using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace WebApplication1.Controllers
{
    public class FileController : Controller
    {
        public IActionResult Test()
        {
            return View();
        }
        [HttpPost]
        public IActionResult Upload([FromForm] IFormFileCollection files)
        { 
            List < FileModel > list = new List<FileModel>();
            foreach (var file in files)
            {
                list.Add(new FileModel { 
                    Name= file.Name,
                });
            }
            return Json(new { files = list });
        }
        public IActionResult MagicNumber()
        {
            return View();
        }
    }
    public class FileModel {
        public string Name { get; set; }
    }
}
