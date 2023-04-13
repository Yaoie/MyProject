using Contract.ServicesInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class ConcreteDecorate1 : IDecorate
    {
        private readonly IDecorate _handler;
        public ConcreteDecorate1(IDecorate handler) {
            _handler=handler;
        }
        public void Do()
        {
            System.IO.File.AppendAllText("D:\\test.txt", "11111 ConcreteDecorate1 Do\n");
            _handler.Do();
        }
    }
}
