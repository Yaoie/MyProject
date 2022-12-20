using System;

namespace Contract.DTO
{
    public class {{ModelClassName}}DTO 
    {
        {% for field in ModelFields %}{% if field.DataType == 'nvarchar' or field.DataType == 'varchar'  or field.DataType == 'text' %}
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
    }
}
