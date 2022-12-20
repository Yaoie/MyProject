using ASL.Common;
using ASL.Common.DataTable;
using ASL.Common.Queries;
using ASL.Common.Providers;
using DAS.Contract.Commands;
using DAS.Contract.DTO;
using DAS.Contract.Queries;
using DAS.Contract.Queries.User;
using DAS.WebApp.Models;
using DAS.WebApp.Common;
using DAS.WebApp.Tools;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

using DAS.WebApp.Constant;

namespace DAS.WebApp.Controllers
{
    [Authorize]
    public class {{ModelClassName}}Controller : BaseController
    {
        private readonly string IndexTitle = "{{ModelClassName}}";
        public {{ModelClassName}}Controller(IQueryProcessor queryProcessor, IWebCommandBus commandBus, IConfiguration configuration) : base(queryProcessor, commandBus)
        {
        }
        #region View
        [HttpGet]
        public IActionResult Index()
        {
            var vm = new {{ModelClassName}}ViewModel();
            vm.breadcrumbs = CommonService.ProduceBreadcrumbs(IndexTitle);
            vm.TableHeadList = new List<string> { "Title1.", "Title2", "Title3", "Action" };
            return View(vm);
        }
        [HttpGet]
        public IActionResult Create()
        {
            var vm = new {{ModelClassName}}ViewModel();
            vm.breadcrumbs = CommonService.ProduceBreadcrumbs($"Create {IndexTitle}", IndexTitle, "/{{ModelClassName}}");
            return View(vm);
        }
        [HttpGet]
        public IActionResult Edit({{ModelKeyCodeType}} Id)
        {
            var dto = this.QueryProcessor.ProcessSingleQuery(new Get{{ModelClassName}}ByIdQuery() { Id = Id });
            var vm =  MapperProvider.Instance.Map<{{ModelClassName}}ViewModel>(dto);
            vm.breadcrumbs = CommonService.ProduceBreadcrumbs($"Edit {IndexTitle}", IndexTitle, "/{{ModelClassName}}");
            return View(vm);
        }
        [HttpGet]
        public IActionResult View({{ModelKeyCodeType}} Id)
        {
            var dto = this.QueryProcessor.ProcessSingleQuery(new Get{{ModelClassName}}ByIdQuery() { Id = Id });
            var vm =  MapperProvider.Instance.Map<{{ModelClassName}}ViewModel>(dto);
            vm.breadcrumbs = CommonService.ProduceBreadcrumbs($"View {IndexTitle}", IndexTitle, "/{{ModelClassName}}");
            vm.Readonly = true;
            return View(vm);
        }
        #endregion
        
        #region Api
        [HttpPost]
        public IActionResult Grid(Get{{ModelClassName}}DataTableQuery query)
        {
            var result = this.QueryProcessor.ProcessSingleQuery(query);
            return Json(result);
        }
        [HttpPost]
        public IActionResult Create(Create{{ModelClassName}}Command command)
        {
            var result = this.CommandBus.SubmitAndReturnJsonResult(command);
            return Content(result, "application/json");
        }
        [HttpPost]
        public IActionResult Edit(Edit{{ModelClassName}}Command command)
        {
            var result = this.CommandBus.SubmitAndReturnJsonResult(command);
            return Content(result, "application/json");
        }
        [HttpPost]
        public IActionResult Delete(Delete{{ModelClassName}}Command command)
        {
            var result = this.CommandBus.SubmitAndReturnJsonResult(command);
            return Content(result, "application/json");
        }
         #endregion
    }
}
