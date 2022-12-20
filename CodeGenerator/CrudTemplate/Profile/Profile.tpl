namespace DAS.DAL.Tools
{
    public class UnitOfWorkDAS
    {
         public DASDBRepository<{{ModelClassName}}> {{ModelClassName}} => DIContainer.Instance.GetInstance<DASDBRepository<{{ModelClassName}}>>();         
    }
    public class BusinessLogicBootstrapper
    {
         container.Register<I{{ModelClassName}}Service, {{ModelClassName}}Service>(Lifestyle.Scoped);
    }
    public class DASBLLAutoMapperProfile
    {
         CreateMap<{{ModelClassName}}, {{ModelClassName}}DTO>();
         CreateMap<DataTableWrapper<{{ModelClassName}}>, DataTableWrapper<{{ModelClassName}}DTO>>();
    }
    public class DASWebAutoMapperProfile
    {
        CreateMap<{{ModelClassName}}DTO,{{ModelClassName}}ViewModel>();
    }
}
