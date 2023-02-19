using Microsoft.AspNetCore.Razor.TagHelpers;

namespace WebApplication1.TagHelpers
{
    public class BsCard: TagHelper
    {
        public async override Task ProcessAsync(TagHelperContext context, TagHelperOutput output) { 
            output.TagName= "div";
            // output.Attributes.SetAttribute("class", "card");
            output.Attributes.SetAttribute("style", "background:#896969;color:#fff;");
            //output.Content.SetContent("This is from progress!");//会覆盖content
            //output.Content.Append("Content's Append method");//也会覆盖content

            var content =await output.GetChildContentAsync();
            //output.Content.SetHtmlContent(" this is new content from process " + content.GetContent() );
            output.PreContent.AppendHtml("<div>preContent1 !</div>");
            output.PreContent.AppendHtml("<div>preContent2 !</div>");
            output.PostContent.AppendHtml("<div>PostContent1</div>");
            output.PostContent.AppendHtml("<div>PostContent2</div>");

        }
    }
}
