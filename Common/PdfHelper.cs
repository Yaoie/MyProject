using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class PdfHelper
    {
        public void CreatePdf() {
            using (Document document = new Document(PageSize.A4)) { 

                PdfWriter writer = PdfWriter.GetInstance(document, new FileStream(@"D:\" + Guid.NewGuid().ToString("N") + ".pdf", FileMode.Create));
                //先打开文档，往里写一段内容，最后关闭文档
                document.Open();
                //document.Add(new iTextSharp.text.Paragraph("Hello World! Hello People! Hello Sky! Hello Sun! Hello Moon! Hello Stars!"));
                BaseFont bfTimes = BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, false);
                Font times = new Font(bfTimes, 12, iTextSharp.text.Font.ITALIC, iTextSharp.text.BaseColor.RED);
                document.Add(new iTextSharp.text.Paragraph("Hello World!", times));
                document.Add(new iTextSharp.text.Paragraph("Hello World2!", times));
                document.AddTitle("这里是标题");
                document.AddSubject("主题");
                document.AddKeywords("关键字");
                document.AddCreator("创建者");
                document.AddAuthor("作者");
                document.Close();
                writer.Close();
            }
        }
        public string ReadPdf() {
            string pdfPath = "C:\\Users\\25142\\Desktop\\Application_form_A22119-1-9.pdf";
            PdfReader reader = new PdfReader(pdfPath);
            StringWriter output = new StringWriter();
            for (int i = 1; i <= reader.NumberOfPages; i++)
                output.WriteLine(PdfTextExtractor.GetTextFromPage(reader, i, new SimpleTextExtractionStrategy()));
            return output.ToString(); 
        }
    }
}
