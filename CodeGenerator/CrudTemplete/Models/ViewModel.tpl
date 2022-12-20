using System;
using DAS.Contract.DTO;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using DAS.DAL.Models;

namespace DAS.WebApp.Models
{
    public class {{ModelClassName}}ViewModel : BaseViewModel
    {
        {% for field in ModelFields %}{% if field.DataType == 'nvarchar' or field.DataType == 'varchar' or field.DataType == 'text' %}
        public string {{field.DbColumnName}}  { get; set; }
        {% elsif  field.DataType == 'int' and field.IsNullable == false  %}
        public int {{field.DbColumnName}}  { get; set; }
        {% elsif  field.DataType == 'int' and field.IsNullable == true %}
        public int? {{field.DbColumnName}}  { get; set; }
        {% elsif  field.DataType == 'bigint' and field.IsNullable == false  %}
        public long {{field.DbColumnName}}  { get; set; }
        {% elsif  field.DataType == 'bigint' and field.IsNullable == true %}
        public long? {{field.DbColumnName}}  { get; set; }
        {% elsif  field.DataType == 'float' and field.IsNullable == false  %}
        public float {{field.DbColumnName}}  { get; set; }
        {% elsif  field.DataType == 'float' and field.IsNullable == true %}
        public float? {{field.DbColumnName}}  { get; set; }
        {% elsif  field.DataType == 'bit' and field.IsNullable == false %}
        public Boolean {{field.DbColumnName}}  { get; set; }
        {% elsif  field.DataType == 'bit' and field.IsNullable == true %}
        public Boolean? {{field.DbColumnName}}  { get; set; }
        {% elsif  field.DataType == 'datetime' and field.IsNullable == false %}
        public DateTime {{field.DbColumnName}}  { get; set; }
        {% elsif  field.DataType == 'datetime' and field.IsNullable == true %}
        public DateTime? {{field.DbColumnName}}  { get; set; }
        {% elsif  field.DataType == 'datetime2' and field.IsNullable == false %}
        public DateTime {{field.DbColumnName}}  { get; set; }
        {% elsif  field.DataType == 'datetime2' and field.IsNullable == true %}
        public DateTime? {{field.DbColumnName}}  { get; set; }
        {% elsif  field.DataType == 'date' and field.IsNullable == false %}
        public DateTime {{field.DbColumnName}}  { get; set; }
        {% elsif  field.DataType == 'date' and field.IsNullable == true %}
        public DateTime? {{field.DbColumnName}}  { get; set; }
        {% elsif  field.DataType == 'uniqueidentifier' and field.IsNullable == false %}
        public Guid {{field.DbColumnName}}  { get; set; }
        {% elsif  field.DataType == 'uniqueidentifier' and field.IsNullable == true %}
        public Guid? {{field.DbColumnName}}  { get; set; }
        {% elsif  field.DataType == 'decimal' and field.IsNullable == false %}
        public Decimal {{field.DbColumnName}}  { get; set; }
        {% elsif  field.DataType == 'decimal' and field.IsNullable == true %}
        public Decimal? {{field.DbColumnName}}  { get; set; }
        {% elsif  field.DataType == 'numeric' and field.IsNullable == false %}
        public Decimal {{field.DbColumnName}}  { get; set; }
        {% elsif  field.DataType == 'numeric' and field.IsNullable == true %}
        public Decimal? {{field.DbColumnName}}  { get; set; }{% else %}{% endif %}{% endfor %}
        public List<string> TableHeadList { get; set; } = new List<string>();
    }
}
