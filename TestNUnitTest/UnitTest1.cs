using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualBasic.FileIO;
using Microsoft.VisualStudio.Web.CodeGeneration;
using SqlSugar;

namespace TestNUnitTest
{
    public class Tests
    {
        private ISqlSugarClient sqlSugarClient;
        [SetUp]
        public void Setup()
        {
            
        }
        public Tests() {
            IServiceCollection services = new ServiceCollection();
            services.AddSingleton<ISqlSugarClient, SqlSugarClient>();
            services.AddSqlSugarSetup();
            IServiceProvider serviceProvider = services.BuildServiceProvider();
            this.sqlSugarClient = serviceProvider.GetService<ISqlSugarClient>();
        }

        [TestCase("Students", "EntityFiles")]
        public void CodeGenDown(string tableName, string fileType)
        {
            SqlSugarClient _sqlSugarClient =sqlSugarClient as SqlSugarClient;
            var columns = _sqlSugarClient.DbMaintenance.GetColumnInfosByTableName("Students", false);
            var  data =CodeGenerator.GeneratorCodeHelper.CodeGenerator(tableName, "tests",columns, fileType);
            Assert.IsNotNull(data);
            if (data != null)
            {
                var rootPath = "C:/codeGenerator/";
                var filePath = tableName + "-" + fileType + ".zip";
                Common.FileHelper.WriteFile(filePath, rootPath, data);
            }
            else
            {
                Console.WriteLine($"{tableName}��ȡ���ݿ��ֶ�ʧ��");
            }
            Assert.Pass();
        }
    }
    public static class SqlSugarSetup
    {
        public static void AddSqlSugarSetup(this IServiceCollection services)
        {
            if (services == null) throw new ArgumentNullException(nameof(services));
            string connectionString = "Data Source=localhost;Initial Catalog=SchoolContext-0e9;User Id=sa;Password=123456;Encrypt=True;TrustServerCertificate=True;MultipleActiveResultSets=true";

            var connectionConfig = new ConnectionConfig()
            {
                ConnectionString = connectionString, //����
                DbType = DbType.SqlServer, //����
                IsAutoCloseConnection = false,
                InitKeyType = InitKeyType.Attribute,
            };


            services.AddScoped<ISqlSugarClient>(o =>
            {

                var db = new SqlSugarClient(connectionConfig); //Ĭ��SystemTable  
                db.Aop.OnError = (exp) =>//ִ��SQL �����¼�
                {
                };
                return db;
            });

        }
    }
}