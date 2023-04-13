using Contract.ServicesInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class ConcreteDecorate : IDecorate
    { 
        public void Do()
        {
            System.IO.File.AppendAllText("D:\\test.txt", "ConcreteDecorate Do\n");
        }
    }
}
