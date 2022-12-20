using ASL.Common.Commands;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DAS.Contract.Commands
{
    public class Create{{ModelClassName}}Command : ICommand<{{ModelKeyCodeType}}>
    {
        {% for field in ModelFields %}{% if field.IsPrimarykey == false and field.CodeType != "" %}
        public {{field.CodeType}} {{field.DbColumnName}}  { get; set; }
        {% else %}{% endif %}{% endfor %}
    }
    public class Edit{{ModelClassName}}Command :  ICommand<{{ModelKeyCodeType}}>
    {
        public {{ModelKeyCodeType}} {{ModelKeyName}}  { get; set; }
        {% for field in ModelFields %}{% if field.IsPrimarykey == false and field.CodeType != "" %}
        public {{field.CodeType}} {{field.DbColumnName}}  { get; set; }
        {% else %}{% endif %}{% endfor %}
    }
    public class Delete{{ModelClassName}}Command : ICommand<{{ModelKeyCodeType}}>
    {
        //{{ModelKeyName}}
        public {{ModelKeyCodeType}} Id { get; set; }
    }   
}
