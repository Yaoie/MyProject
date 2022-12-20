using ASL.Common.Commands;
using DAS.Contract.Commands;
using DAS.Contract.ServiceInterfaces;

namespace DAS.BLL.CommandHandlers
{
    public class {{ModelClassName}}CommandHandler : ICommandHandler<Create{{ModelClassName}}Command, {{ModelKeyCodeType}}>,
        ICommandHandler<Delete{{ModelClassName}}Command, {{ModelKeyCodeType}}>,
        ICommandHandler<Edit{{ModelClassName}}Command, {{ModelKeyCodeType}}>
    {
        private readonly I{{ModelClassName}}Service {{ModelVarName}}Service;
        public {{ModelClassName}}CommandHandler(I{{ModelClassName}}Service _{{ModelVarName}}Service)
        {
            this.{{ModelVarName}}Service = _{{ModelVarName}}Service;
        }
        public {{ModelKeyCodeType}} Handle(Create{{ModelClassName}}Command cmd)
        {
            var id = this.{{ModelVarName}}Service.Create{{ModelClassName}}(cmd);
            return id;
        }
        public {{ModelKeyCodeType}} Handle(Delete{{ModelClassName}}Command cmd)
        {
            var id = this.{{ModelVarName}}Service.Delete{{ModelClassName}}(cmd);
            return id;
        }
        public {{ModelKeyCodeType}} Handle(Edit{{ModelClassName}}Command cmd)
        {
            var id = this.{{ModelVarName}}Service.Edit{{ModelClassName}}(cmd);
            return id;
        }
    }
}
