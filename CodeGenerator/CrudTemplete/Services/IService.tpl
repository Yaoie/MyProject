using System;
using ASL.Common.DataTable;
using DAS.Contract.Commands;
using DAS.Contract.DTO;
using DAS.Contract.Queries;
using System.Collections.Generic;

namespace DAS.Contract.ServiceInterfaces
{
	/// <summary>
    /// {{ModelDescription}} 
    /// </summary>
    public interface I{{ModelClassName}}Service 
    {
        #region 
        {{ModelClassName}}DTO Get{{ModelClassName}}ById({{ModelKeyCodeType}} Id);
        DataTableWrapper<{{ModelClassName}}DTO> GetDataTableRequest(Get{{ModelClassName}}DataTableQuery query);
        //more query code

        {{ModelKeyCodeType}} Create{{ModelClassName}}(Create{{ModelClassName}}Command cmd);
        {{ModelKeyCodeType}} Edit{{ModelClassName}}(Edit{{ModelClassName}}Command cmd);        
        {{ModelKeyCodeType}} Delete{{ModelClassName}}(Delete{{ModelClassName}}Command cmd);        
        #endregion              
    }
}
