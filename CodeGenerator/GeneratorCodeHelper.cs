using Common;
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
        public static byte[] CodeGenerator(string tableName, string tableDescription, List<DbColumnInfo> columns, string fileType)
        {
            //ModelClassName
            //ModelName
            //ModelFields  Name Comment
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
                    //Length = (r.DataType == "nvarchar" && r.Length > 0) ? r.Length / 2 : r.Length,
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
                            //Profile
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Profile.Profile.tpl", "Profile/" + tableName + "Profile.cs");
                            //Respository
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Repositories.RepositoryExtension.tpl", "Repositories/" + tableName + "RepositoryExtension.cs");
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Specifications.Specification.tpl", "Specifications/" + tableName + "Specification.cs");
                            //Handlers   
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.CommandHandlers.CommandHandler.tpl", "CommandHandlers/" + tableName + "CommandHandler.cs");
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.QueryHandlers.QueryHandler.tpl", "QueryHandlers/" + tableName + "QueryHandler.cs");
                            //IServices
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Services.IService.tpl", "ServiceInterfaces/I" + tableName + "Service.cs");
                            //Services
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Services.Service.tpl", "Services/" + tableName + "Service.cs");
                            //Model
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.DTO.DTO.tpl", "DTO/" + tableName + "DTO.cs");
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Commands.Command.tpl", "Commands/" + tableName + "Command.cs");
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Queries.Query.tpl", "Queries/" + tableName + "Query.cs");
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Models.ViewModel.tpl", "Models/" + tableName + "ViewModel.cs");
                            //Controller
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Controllers.Controller.tpl", "Controllers/" + tableName + "Controller.cs");
                            //CreateHtml
                            //EditHtml
                            //DetailsHtml
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Views.Form.tpl", "Views/" + tableName + "/Form.cshtml");
                            //IndexHtml
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Views.Index.tpl", "Views/" + tableName + "/Index.cshtml");
                            break;
                        case "EntityFiles":
                            //Model
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.DTO.DTO.tpl", "DTO/" + tableName + "DTO.cs");
                            break;
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Commands.Command.tpl", "Commands/" + tableName + "Command.cs");
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Queries.Query.tpl", "Queries/" + tableName + "Query.cs");
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Models.ViewModel.tpl", "Models/" + tableName + "ViewModel.cs");
                            break;
                        case "ServicesFiles":
                            //IServices
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Services.IServices.tpl", "ServiceInterfaces/I" + tableName + "Services.cs");
                            //Services
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Services.Services.tpl", "Services/" + tableName + "Services.cs");
                            //Respository
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Repositories.RepositoryExtension.tpl", "Repositories/" + tableName + "RepositoryExtension.cs");
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Specifications.Specification.tpl", "Specifications/" + tableName + "Specification.cs");
                            //Handlers   
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.CommandHandlers.CommandHandler.tpl", "CommandHandlers/" + tableName + "CommandHandler.cs");
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.QueryHandlers.QueryHandler.tpl", "QueryHandlers/" + tableName + "QueryHandler.cs");
                            break;
                        case "ViewFiles":
                            //Controller
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Controllers.Controller.tpl", "Controllers/" + tableName + "Controller.cs");
                            //CreateHtml
                            //EditHtml
                            //DetailsHtml
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Views.Create.tpl", "Views/" + tableName + "/Create.cshtml");
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Views.Edit.tpl", "Views/" + tableName + "/Edit.cshtml");
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Views.View.tpl", "Views/" + tableName + "/View.cshtml");
                            //IndexHtml
                            WriteStream(zip, assembly, obj, _nameSpace + ".CrudTemplete.Views.Index.tpl", "Views/" + tableName + "/Index.cshtml");
                            break;
                    }
                }
                data = ms.ToArray();
            }
            return data;
        }
        /// <summary>
        /// 直接生成到项目目录
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="tableDescription"></param>
        /// <param name="rootPath"></param>
        /// <param name="columns"></param>
        /// <param name="fileType"></param>
        public static void CodeGenerator(string tableName, string tableDescription, string rootPath, List<DbColumnInfo> columns, string fileType)
        {
            //ModelClassName
            //ModelName
            //ModelFields  Name Comment
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
                    //Length = (r.DataType == "nvarchar" && r.Length > 0) ? r.Length / 2 : r.Length,
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
            var rootPathR = rootPath + "DASCore/DAS.DAL/Repositories/";
            var entryNameR = tableName + "RepositoryExtension.cs";
            var rootPathSP = rootPath + "DASCore/DAS.DAL/Specifications/";
            var entryNameSP = tableName + "Specification.cs";
            var rootPathCH = rootPath + "DASCore/DAS.BLL/CommandHandlers/";
            var entryNameCH = tableName + "CommandHandler.cs";
            var rootPathQH = rootPath + "DASCore/DAS.BLL/QueryHandlers/";
            var entryNameQH = tableName + "QueryHandler.cs";
            var rootPathIS = rootPath + "DAS.Contract/ServiceInterfaces/I";
            var entryNameIS = tableName + "Service.cs";
            var rootPathS = rootPath + "DASCore/DAS.BLL/Services/";
            var entryNameS = tableName + "Service.cs";
            var rootPathD = rootPath + "DAS.Contract/DTO/";
            var entryNameD = tableName + "DTO.cs";
            var rootPathC = rootPath + "DAS.Contract/Commands/";
            var entryNameC = tableName + "Command.cs";
            var rootPathQ = rootPath + "DAS.Contract/Queries/";
            var entryNameQ = tableName + "Query.cs";
            var rootPathM = rootPath + "DAS.WebApp/Models/";
            var entryNameM = tableName + "ViewModel.cs";
            var rootPathCO = rootPath + "DAS.WebApp/Controllers/";
            var entryNameCO = tableName + "Controller.cs";
            var rootPathVI = rootPath + "DAS.WebApp/Views/" + tableName + "/";
            var entryNameVI = "Index.cshtml";
            var rootPathVF = rootPath + "DAS.WebApp/Views/" + tableName + "/";
            var entryNameVF1 = "Create.cshtml";
            var entryNameVF2 = "Edit.cshtml";
            var entryNameVF3 = "View.cshtml";
            var rootPathDas = rootPath + "DASCore/DAS.DAL/Tools/UnitOfWorkDAS.cs";
            var rootPathBus = rootPath + "DASCore/DAS.BLL/BusinessLogicBootstrapper.cs";
            var rootPathMap1 = rootPath + "DASCore/DAS.BLL/Mapper/DASBLLAutoMapperProfile.cs";
            var rootPathMap2 = rootPath + "DAS.WebApp/Common/DASWebAutoMapperProfile.cs";
            string retract = "    ";
            string retract2 = retract + retract;
            string retract3 = retract + retract2;
            var DasContent = $"{retract2}public DASDBRepository<{obj.ModelName}> {obj.ModelName} => DIContainer.Instance.GetInstance<DASDBRepository<{obj.ModelName}>>();  ";
            var BusContent = $"{retract3}container.Register<I{obj.ModelName}Service, {obj.ModelName}Service>(Lifestyle.Scoped); ";
            var Map1Content = new string[] { $"{retract3}CreateMap<{obj.ModelName}, {obj.ModelName}DTO>(); ", $"{retract3}CreateMap<DataTableWrapper<{obj.ModelName}>, DataTableWrapper<{obj.ModelName}DTO>>(); " };
            var Map2Content = $"{retract3}CreateMap<{obj.ModelName}DTO,{obj.ModelName}ViewModel>(); ";
            var Region = "//more code";
            //FileHelper.RemoveFile(entryNameR, rootPathR);
            //FileHelper.RemoveFile(entryNameQ, rootPathQ);
            //FileHelper.RemoveFile(entryNameC, rootPathC);
            //FileHelper.RemoveFile(entryNameD, rootPathD);
            //FileHelper.RemoveFile(entryNameS, rootPathS);
            //FileHelper.RemoveFile(entryNameSP, rootPathSP);
            //FileHelper.RemoveFile(entryNameCH, rootPathCH);
            //FileHelper.RemoveFile(entryNameQH, rootPathQH);
            switch (fileType)
            {
                case "ServicesFiles":
                    //    if (!File.Exists(rootPathR + entryNameR) && !File.Exists(rootPathSP + entryNameSP) && !File.Exists(rootPathCH + entryNameCH) && !File.Exists(rootPathQH + entryNameQH)
                    //&& !File.Exists(rootPathIS + entryNameIS) && !File.Exists(rootPathS + entryNameS) && !File.Exists(rootPathD + entryNameD) && !File.Exists(rootPathC + entryNameC)
                    //&& !File.Exists(rootPathQ + entryNameQ))
                    //    {
                    //Respository
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Repositories.RepositoryExtension.tpl", rootPathR, entryNameR);
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Specifications.Specification.tpl", rootPathSP, entryNameSP);
                    //Handlers   
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.CommandHandlers.CommandHandler.tpl", rootPathCH, entryNameCH);
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.QueryHandlers.QueryHandler.tpl", rootPathQH, entryNameQH);
                    //IServices
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Services.IService.tpl", rootPathIS, entryNameIS);
                    //Services
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Services.Service.tpl", rootPathS, entryNameS);
                    //Model
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.DTO.DTO.tpl", rootPathD, entryNameD);
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Commands.Command.tpl", rootPathC, entryNameC);
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Queries.Query.tpl", rootPathQ, entryNameQ);
                    //}
                    AddCodeToProfile(rootPathDas, DasContent, Region);
                    AddCodeToProfile(rootPathBus, BusContent, Region);
                    AddCodeToProfile(rootPathMap1, Map1Content, Region);
                    break;
                case "ViewFiles":
                    //if (!File.Exists(rootPathCO + entryNameCO) && !File.Exists(rootPathM + entryNameM) && !File.Exists(rootPathVI + entryNameVI) && !File.Exists(rootPathVF + entryNameVF))
                    //{
                    //Model
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Models.ViewModel.tpl", rootPathM, entryNameM);
                    //Controller
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Controllers.Controller.tpl", rootPathCO, entryNameCO);
                    //CreateHtml
                    //EditHtml
                    //DetailsHtml
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Views.Create.tpl", rootPathVF, entryNameVF1);
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Views.Edit.tpl", rootPathVF, entryNameVF2);
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Views.View.tpl", rootPathVF, entryNameVF3);
                    //IndexHtml
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Views.Index.tpl", rootPathVI, entryNameVI);
                    //}
                    AddCodeToProfile(rootPathMap2, Map2Content, Region);
                    break;
                case "AllFiles":
                default:
                    //    if (!File.Exists(rootPathR + entryNameR) && !File.Exists(rootPathSP + entryNameSP) && !File.Exists(rootPathCH + entryNameCH) && !File.Exists(rootPathQH + entryNameQH)
                    //&& !File.Exists(rootPathIS + entryNameIS) && !File.Exists(rootPathS + entryNameS) && !File.Exists(rootPathD + entryNameD) && !File.Exists(rootPathC + entryNameC)
                    //&& !File.Exists(rootPathQ + entryNameQ))
                    //    {
                    //Respository
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Repositories.RepositoryExtension.tpl", rootPathR, entryNameR);
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Specifications.Specification.tpl", rootPathSP, entryNameSP);
                    //Handlers   
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.CommandHandlers.CommandHandler.tpl", rootPathCH, entryNameCH);
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.QueryHandlers.QueryHandler.tpl", rootPathQH, entryNameQH);
                    //IServices
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Services.IService.tpl", rootPathIS, entryNameIS);
                    //Services
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Services.Service.tpl", rootPathS, entryNameS);
                    //Model
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.DTO.DTO.tpl", rootPathD, entryNameD);
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Commands.Command.tpl", rootPathC, entryNameC);
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Queries.Query.tpl", rootPathQ, entryNameQ);
                    //}
                    //if (!File.Exists(rootPathCO + entryNameCO) && !File.Exists(rootPathM + entryNameM) && !File.Exists(rootPathVI + entryNameVI) && !File.Exists(rootPathVF + entryNameVF))
                    //{
                    //Model
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Models.ViewModel.tpl", rootPathM, entryNameM);
                    //Controller
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Controllers.Controller.tpl", rootPathCO, entryNameCO);
                    //CreateHtml
                    //EditHtml
                    //DetailsHtml
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Views.Create.tpl", rootPathVF, entryNameVF1);
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Views.Edit.tpl", rootPathVF, entryNameVF2);
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Views.View.tpl", rootPathVF, entryNameVF3);
                    //IndexHtml
                    WriteFile(assembly, obj, _nameSpace + ".CrudTemplete.Views.Index.tpl", rootPathVI, entryNameVI);
                    //}
                    AddCodeToProfile(rootPathDas, DasContent, Region);
                    AddCodeToProfile(rootPathBus, BusContent, Region);
                    AddCodeToProfile(rootPathMap1, Map1Content, Region);
                    AddCodeToProfile(rootPathMap2, Map2Content, Region);
                    break;
            }
        }
        private static void WriteFile(Assembly assembly, object obj, string tpl, string rootPath, string entryName)
        {
            using (var reader = new StreamReader(assembly.GetManifestResourceStream(tpl), Encoding.UTF8))
            {
                var file = reader.ReadToEnd();
                var template = Template.Parse(file);
                var result = template.Render(Hash.FromAnonymousObject(obj));
                var path = rootPath + entryName;
                if (!File.Exists(path))
                {
                    FileHelper.WriteFile(entryName, rootPath, Encoding.UTF8.GetBytes(result));
                }
            }
        }
        private static void AddCodeToProfile(string txtFilePath, string[] contents, string region)
        {
            List<string> txtList = new List<string>();
            bool hasRegion = false;
            FileStream fs = new FileStream(txtFilePath, FileMode.Open);
            using (StreamReader sr = new StreamReader(fs, Encoding.Default))
            {
                while (!sr.EndOfStream)
                {
                    string s = sr.ReadLine().ToString();
                    txtList.Add(s);
                    if (s.IndexOf(region) >= 0)
                    {
                        hasRegion = true;
                        foreach (string content in contents)
                        {
                            txtList.Add(content);
                        }
                    }
                }
            }
            fs.Close();
            if (hasRegion)
            {
                File.Delete(txtFilePath);
                FileStream wfs = File.Open(txtFilePath, FileMode.Create, FileAccess.Write);
                using (StreamWriter sw = new StreamWriter(wfs))
                {
                    for (int i = 0; i < txtList.Count; i++)
                    {
                        //开始写入
                        sw.WriteLine(txtList[i]);
                    }
                }
                wfs.Close();
            }
        }
        private static void AddCodeToProfile(string txtFilePath, string content, string region)
        {
            List<string> txtList = new List<string>();
            bool hasRegion = false;
            FileStream fs = new FileStream(txtFilePath, FileMode.Open);
            using (StreamReader sr = new StreamReader(fs, Encoding.Default))
            {
                while (!sr.EndOfStream)
                {
                    string s = sr.ReadLine().ToString();
                    txtList.Add(s);
                    if (s.IndexOf(region) >= 0)
                    {
                        hasRegion = true;
                        txtList.Add(content);
                    }
                }
            }
            fs.Close();
            if (hasRegion)
            {
                File.Delete(txtFilePath);
                FileStream wfs = File.Open(txtFilePath, FileMode.Create, FileAccess.Write);
                using (StreamWriter sw = new StreamWriter(wfs))
                {
                    for (int i = 0; i < txtList.Count; i++)
                    {
                        //开始写入
                        sw.WriteLine(txtList[i]);
                    }
                }
                wfs.Close();
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
