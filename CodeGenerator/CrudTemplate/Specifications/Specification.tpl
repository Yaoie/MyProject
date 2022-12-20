using System;
using ASL.Common.Specifications;
using DAS.DAL.Models;
using System.Collections.Generic;

namespace DAS.DAL.Specifications
{
	public class {{ModelClassName}}Specification
    { 
        {% if ModelKeyCodeType == 'string' %}
        public static Specification<{{ModelClassName}}> Base => new Specification<{{ModelClassName}}>(x => x.{{ModelKeyName}} != "");
        {% elsif  ModelKeyCodeType == 'int' or ModelKeyCodeType == 'float' or ModelKeyCodeType == 'Decimal' or ModelKeyCodeType == 'long'  %}
        public static Specification<{{ModelClassName}}> Base => new Specification<{{ModelClassName}}>(x => x.{{ModelKeyName}} > 0);{% else %}{% endif %}
        public static Specification<{{ModelClassName}}> Id({{ModelKeyCodeType}} query) => new Specification<{{ModelClassName}}>(x => x.{{ModelKeyName}} == query);
        {% for field in ModelFields %}{% if field.IsPrimarykey == false and field.CodeType !="" %}
        //public static Specification<{{ModelClassName}}> {{field.DbColumnName}} ({{field.CodeType}} query) => new Specification<{{ModelClassName}}>(x => x.{{field.DbColumnName}}  == query );
       {% else %}{% endif %}{% endfor %}
    }
}
