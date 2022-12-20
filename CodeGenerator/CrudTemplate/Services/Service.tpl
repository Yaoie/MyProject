using ASL.Common;
using ASL.Common.DataTable;
using ASL.Common.Events;
using ASL.Common.Providers;
using DAS.Contract.Commands;
using DAS.Contract.Queries;
using DAS.Contract.DTO;
using DAS.Contract.ServiceInterfaces;
using DAS.DAL.Models;
using DAS.DAL.Repositories;
using DAS.DAL.Tools;
using System;
using System.Linq;
using System.Collections.Generic;

namespace DAS.BLL.Services
{
    /// <summary>
    /// {{ModelDescription}} 
    /// </summary>
    public class {{ModelClassName}}Service :  I{{ModelClassName}}Service
    {
        private readonly UnitOfWorkDAS unitOfWork;
        private readonly IEventBus eventBus;

        public {{ModelClassName}}Service(UnitOfWorkDAS unitOfWork, IEventBus eventBus)
        {
            this.unitOfWork = unitOfWork;
            this.eventBus = eventBus;
        }

        #region 

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public {{ModelClassName}}DTO Get{{ModelClassName}}ById({{ModelKeyCodeType}} Id)
        {
            var r = this.unitOfWork.{{ModelClassName}}.ExGetById(Id);
            var result = MapperProvider.Instance.Map<{{ModelClassName}}DTO>(r);
            return result;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        public DataTableWrapper<{{ModelClassName}}DTO> GetDataTableRequest(Get{{ModelClassName}}DataTableQuery query)
        {
            var r = this.unitOfWork.{{ModelClassName}}.ExGetDataTableResult(query);
            var result = MapperProvider.Instance.Map<DataTableWrapper<{{ModelClassName}}DTO>>(r);
            return result;
        }

        //more query code

        /// <summary>
        /// 
        /// </summary>
        /// <param name="cmd"></param>
        /// <returns></returns>
        public {{ModelKeyCodeType}} Create{{ModelClassName}}(Create{{ModelClassName}}Command cmd)
        {
            {{ModelClassName}} entity = this.GetCreate{{ModelClassName}}(cmd);
            this.unitOfWork.{{ModelClassName}}.Add(entity);
            this.unitOfWork.Save();
            return entity.{{ModelKeyName}};
        }
       
        /// <summary>
        /// 
        /// </summary>
        /// <param name="cmd"></param>
        /// <returns></returns>
        public {{ModelKeyCodeType}} Edit{{ModelClassName}}(Edit{{ModelClassName}}Command cmd)
        {           
            {{ModelClassName}} entity = this.unitOfWork.{{ModelClassName}}.ExGetById(cmd.{{ModelKeyName}});
            entity = this.GetEdit{{ModelClassName}}(cmd,entity);
            this.unitOfWork.Save();
            return entity.{{ModelKeyName}};
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public {{ModelKeyCodeType}} Delete{{ModelClassName}}(Delete{{ModelClassName}}Command cmd)
        {
            {{ModelClassName}} entity = this.unitOfWork.{{ModelClassName}}.ExGetById(cmd.Id);
            this.unitOfWork.{{ModelClassName}}.Delete(entity);
            this.unitOfWork.Save();
            return cmd.Id;
        }       
      
        #endregion        

    }
    public static class I{{ModelClassName}}Extension
    {
        public static {{ModelClassName}} GetCreate{{ModelClassName}}(this I{{ModelClassName}}Service i{{ModelClassName}}Service, Create{{ModelClassName}}Command cmd, {{ModelClassName}} entity = null)
        {
            if (entity == null)
                entity = new {{ModelClassName}}();
         {% for field in ModelFields %}{% if field.IsPrimarykey == false %}
            if (cmd.{{field.DbColumnName}} != default)
                entity.{{field.DbColumnName}} = cmd.{{field.DbColumnName}};{% endif %}{% endfor %}
            return entity;
        }
        public static {{ModelClassName}} GetEdit{{ModelClassName}}(this I{{ModelClassName}}Service i{{ModelClassName}}Service, Edit{{ModelClassName}}Command cmd, {{ModelClassName}} entity = null)
        {
            if (entity == null)
                entity = new {{ModelClassName}}();
         {% for field in ModelFields %}{% if field.IsPrimarykey == false %}
            if (cmd.{{field.DbColumnName}} != default)
                entity.{{field.DbColumnName}} = cmd.{{field.DbColumnName}};{% endif %}{% endfor %}
            return entity;
        }
        public static List<{{ModelClassName}}> GetCreate{{ModelClassName}}s(this I{{ModelClassName}}Service i{{ModelClassName}}Service, List<Create{{ModelClassName}}Command> cmds)
        {
            var entitys = new List<{{ModelClassName}}>();
            foreach (var cmd in cmds)
            {
                var entity = new {{ModelClassName}}();
                {% for field in ModelFields %}{% if field.IsPrimarykey == false %}
                if (cmd.{{field.DbColumnName}} != default)
                    entity.{{field.DbColumnName}} = cmd.{{field.DbColumnName}};{% endif %}{% endfor %}
                entitys.Add(entity);
            }
            return entitys;
        }
        public static List<{{ModelClassName}}> GetEdit{{ModelClassName}}s(this I{{ModelClassName}}Service i{{ModelClassName}}Service, List<Edit{{ModelClassName}}Command> cmds)
        {
            var entitys = new List<{{ModelClassName}}>();
            foreach (var cmd in cmds)
            {
                var entity = new {{ModelClassName}}();
                entity.{{ModelKeyName}} = cmd.{{ModelKeyName}};
                {% for field in ModelFields %}{% if field.IsPrimarykey == false %}
                if (cmd.{{field.DbColumnName}} != default)
                    entity.{{field.DbColumnName}} = cmd.{{field.DbColumnName}};{% endif %}{% endfor %}
                entitys.Add(entity);
            }
            return entitys;
        }
    }
}
