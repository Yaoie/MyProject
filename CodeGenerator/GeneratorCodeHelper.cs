using DotLiquid;
using SqlSugar;
using System;
using System.Collections.Generic;
using System.IO.Compression;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace CodeGenerator
{
    public static class GeneratorCodeHelper
    {
        private static string _nameSpace = "CodeGenerator";
        /// <summary>
        /// 单表生成对应数据
        /// </summary>
        /// <param name="tableName">表名称</param>
        /// <param name="tableDescription">表说明</param>
        /// <param name="columns">表字段</param>
        public static void CodeGenerator(string tableName, string tableDescription, List<DbColumnInfo> columns, string fileType)
        {
            var dt = DateTime.Now;
            byte[] data;
            var obj = new
            {
                ModelCreateTime = dt,
                ModelName = tableName,
                ModelDescription = tableDescription,
                ModelClassName = tableName,
                ModelVarName = Str.FirstLower(tableName),
                ModelKeyName = columns.FirstOrDefault(x => x.IsPrimarykey).DbColumnName,
                ModelKeyCodeType = GetCodeType(columns.FirstOrDefault(x => x.IsPrimarykey).DataType, false),
                ModelFields = columns.Select(r => new
                {
                    r.DbColumnName,
                    r.ColumnDescription,
                    r.DataType,
                    CodeType = GetCodeType(r.DataType, r.IsNullable),
                    r.DecimalDigits,
                    r.DefaultValue,
                    r.IsIdentity,
                    r.IsNullable,
                    r.IsPrimarykey,
                    r.Length,
                    r.PropertyName,
                    r.PropertyType,
                    r.Scale,
                    r.TableId,
                    r.TableName,
                    r.Value
                }).ToArray()
            };
            var assembly = IntrospectionExtensions.GetTypeInfo(typeof(GeneratorCodeHelper)).Assembly;
            using (MemoryStream ms = new MemoryStream())
            {
                using (ZipArchive zip = new ZipArchive(ms, ZipArchiveMode.Create, false))
                {
                    switch (fileType)
                    {
                        case "AllFiles":
                              break;
                        case "EntityFiles":
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplate.Dto.DTO.tpl", "DTO/" + tableName + "DTO.cs");
                            break;
                         case "ServicesFiles":
                            break;
                        case "ViewFiles": 
                            break;
                    }
                }
                data = ms.ToArray();
                if (data != null)
                {
                    var rootPath = "C:/codeGenerator/";
                    var filePath = tableName + "-" + fileType + ".zip";
                    WriteFile(filePath, rootPath, data);              
                }
                else
                {
                    Console.WriteLine($"{tableName}获取数据库字段失败");
                }
            }
        }
        private static void WriteStream(ZipArchive zip, Assembly assembly, object obj, string tpl, string entryName)
        {
            using (var reader = new StreamReader(assembly.GetManifestResourceStream(tpl), Encoding.UTF8))
            {
                var file = reader.ReadToEnd();
                var template = Template.Parse(file);
                var result = template.Render(Hash.FromAnonymousObject(obj));
                ZipArchiveEntry entry = zip.CreateEntry(entryName);
                using (StreamWriter entryStream = new StreamWriter(entry.Open()))
                {
                    entryStream.Write(result);
                }
            }
        }
        public static void WriteFile(string fileName, string rootPath, byte[] buffer)
        {
            if (!Directory.Exists(rootPath))
            {
                Directory.CreateDirectory(rootPath);
            }
            string path = GetFilePath(fileName, rootPath); 
            FileInfo file = new FileInfo(path);
            FileStream fs = file.Create();
            fs.Write(buffer, 0, buffer.Length);
            fs.Close();
        }
        public static string GetFilePath(string fileName, string rootPath)
        {
            return rootPath + fileName;
        }
        private static string GetCodeType(string dataType, bool isNullable)
        {
            switch (dataType)
            {
                case "bigint":
                    if (isNullable)
                        return "long?";
                    else
                        return "long";
                case "int":
                    if (isNullable)
                        return "int?";
                    else
                        return "int";
                case "float":
                    if (isNullable)
                        return "float?";
                    else
                        return "float";
                case "bit":
                    if (isNullable)
                        return "Boolean?";
                    else
                        return "Boolean";
                case "uniqueidentifier":
                    if (isNullable)
                        return "Guid?";
                    else
                        return "Guid";
                case "decimal":
                case "numeric":
                    if (isNullable)
                        return "Decimal?";
                    else
                        return "Decimal";
                case "nvarchar":
                case "varchar":
                case "text":
                    return "string";
                case "datetime":
                case "datetime2":
                case "date":
                    if (isNullable)
                        return "DateTime?";
                    else
                        return "DateTime";
                default:
                    return "";
            }
        }

    }
    public static class Str
    {
        /// <summary>
        /// 将值的首字母小写
        /// </summary>
        /// <param name="value">值</param>
        /// <returns></returns>
        public static string FirstLower(string value)
        {
            string firstChar = value.Substring(0, 1).ToLower();
            return firstChar + value.Substring(1, value.Length - 1);
        }
    }
    }
