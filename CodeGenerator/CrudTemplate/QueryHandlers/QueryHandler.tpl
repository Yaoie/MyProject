using ASL.Common.DataTable;
using ASL.Common.Queries;
using DAS.Contract.DTO;
using DAS.Contract.ServiceInterfaces;
using DAS.Contract.Queries;
using System.Collections.Generic;

namespace DAS.BLL.QueryHandlers
{
     public class {{ModelClassName}}QueryHandler : ISingleQueryHandler<Get{{ModelClassName}}DataTableQuery, DataTableWrapper<{{ModelClassName}}DTO>>
        , ISingleQueryHandler<Get{{ModelClassName}}ByIdQuery, {{ModelClassName}}DTO>
        //I more query code
    {
        private readonly I{{ModelClassName}}Service {{ModelVarName}}Service;
        public {{ModelClassName}}QueryHandler(I{{ModelClassName}}Service _{{ModelVarName}}Service)
        {
            this.{{ModelVarName}}Service = _{{ModelVarName}}Service;
        }

        public DataTableWrapper<{{ModelClassName}}DTO> Handle(Get{{ModelClassName}}DataTableQuery query)
        {
            return this.{{ModelVarName}}Service.GetDataTableRequest(query);
        }
        public {{ModelClassName}}DTO Handle(Get{{ModelClassName}}ByIdQuery query)
        {
            return this.{{ModelVarName}}Service.Get{{ModelClassName}}ById(query.Id);
        }
        //more query code
    }
}
