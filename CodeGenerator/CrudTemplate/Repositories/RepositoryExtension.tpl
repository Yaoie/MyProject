using ASL.Common.DataTable;
using ASL.Common.Linq;
using ASL.Common.Mappers;
using ASL.Common.Repositories;
using DAS.Contract.Queries;
using DAS.DAL.Models;
using DAS.DAL.Specifications;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DAS.DAL.Repositories
{
	public static class {{ModelClassName}}RepositoryExtension
    {
        private static string includeStr = "";
        public static {{ModelClassName}} ExGetById(this IRepositoryBase<{{ModelClassName}}> repository, {{ModelKeyCodeType}} Id)
        {
            var predicate = {{ModelClassName}}Specification.Id(Id);
            return repository.GetQueryable(predicate.Predicate, null, includeStr).FirstOrDefault();
        }
        public static DataTableWrapper<{{ModelClassName}}> ExGetDataTableResult(this IRepositoryBase<{{ModelClassName}}> repository, Get{{ModelClassName}}DataTableQuery query)
        {
            string keyField = new Reflection().GetPropertyName<{{ModelClassName}}>(o => o.{{ModelKeyName}});
            var predicate = {{ModelClassName}}Specification.Base;
            //To Revise
            //if (!string.IsNullOrEmpty(query.Name))
            //{
            //    predicate = predicate & {{ModelClassName}}Specification.Name(query.Name);
            //}
            (string order, bool desc, int draw, int skip, int take) = query.model.GetDTParameter();
            var recordsTotal = repository.Count();
            var filteredList = repository.GetDbSet().Where(predicate.Predicate);
            var recordsFiltered = filteredList.Count();
            var orderby = filteredList.GetOrderBy(order, desc, keyField);
            var list = repository.GetDataTable(take, skip, predicate.Predicate, orderby, includeStr).ToList();
            var dto = new DataTableWrapper<{{ModelClassName}}> { draw = draw, recordsTotal = recordsTotal, recordsFiltered = recordsFiltered, data = list };
            return dto;
        }
        //more query code
    }
}
