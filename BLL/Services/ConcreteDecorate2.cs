using Contract.ServicesInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class ConcreteDecorate2 : IDecorate
    {
        private readonly IDecorate _handler;
        public ConcreteDecorate2(IDecorate handler)
        {
            _handler = handler;
        }
        public void Do()
        {
            System.IO.File.AppendAllText("D:\\test.txt", "22222 ConcreteDecorate2 Do\n");
            _handler.Do();
        }
    }
}
