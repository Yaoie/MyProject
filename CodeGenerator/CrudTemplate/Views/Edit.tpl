@model {{ModelClassName}}ViewModel
@using DAS.WebApp.Constant
@using DAS.WebApp.Constant.Enums
@using DAS.WebApp.Common
@section Css
{
<!-- BEGIN VENDOR CSS-->
<link rel="stylesheet" type="text/css" href="~/Rubust/vendors/css/forms/selects/select2.min.css">
<!-- END VENDOR CSS-->
}
<div class="content-wrapper">
    <div class="content-header row">
        @await Component.InvokeAsync("Breadcrumbs",Model.breadcrumbs)
        <div class="content-header-right col-md-4 col-12">
        </div>
    </div>
    <div class="content-body">
        <!-- Basic form layout section start -->
        <section id="horizontal-form-layouts">
            <div class="row">
                <div class="col-md-12">
                    <das-card>
                         <form id="{{ModelClassName}}Form" class="form form-horizontal" method="post">
                             <div asp-validation-summary=All class="text-danger"></div>
                             <div class="form-body">
                                 <input hidden asp-for={{ModelKeyName}} />
                                 <h4 class="form-section"><i class="fa fa-eye"></i>Basic Info</h4>
                                 @* TO Revise*@
                                 @*<div class="row">
                                     <div class="form-group col-md-6">
                                         <span class="red">*</span><label asp-for=UserName class="label-control"></label>
                                         <input asp-for=UserName class="form-control" />
                                         <span asp-validation-for="UserName" class="text-danger"></span>
                                     </div>
                                     <div class="form-group col-md-6">
                                         <span class="red">*</span><label asp-for=FullName class="label-control"></label>
                                         <input asp-for=FullName class="form-control" />
                                         <span asp-validation-for="FullName" class="text-danger"></span>
                                     </div>
                                 </div>*@                                                       
                             </div>
                             <div class="form-actions right">
                                 <button id="btnCancel" type="button" class="btn btn-warning mr-1"><i class="ft-x"></i>Cancel</button>
                                 <button id="btnSubmit" type="button" class="btn btn-primary"><i class="fa fa-check-square-o"></i>Save</button>
                             </div>
                         </form>
                    </das-card>
                </div>
            </div>
        </section>
        <!-- // Basic form layout section end -->
    </div>
</div>

@section Scripts{
<partial name="_ValidationScriptsPartial" />
<script src="~/Rubust/vendors/js/forms/select/select2.full.min.js"></script>
<script>
    $(document).ready(function () {
        $(".select2").select2();
        $("#btnSubmit").click(function () {           
            var validateResult = $('#{{ModelClassName}}Form').validate().form();
            var postData=dasFormTool.serializeToObject($('#{{ModelClassName}}Form').serialize())
            //console.log('{{ModelClassName}} Edit PostData:',postData)
            var saveUrl ="/{{ModelClassName}}/Edit";
            if (validateResult) {
                $.ajax({
                    method: "POST",
                    url: saveUrl,
                    data: postData,
                    success: function (data) {
                        if (data.ERROR_CODE == "") {
                            var url = '/{{ModelClassName}}';
                            dasAlert.showMessageAndRedirect('Save Successfully.',url);
                        } else {
                            dasAlert.showError(data.MESSAGE);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        dasAlert.showError('Error');
                    }
                })
            }
        });
        $(document).on("click", "#btnCancel",function (){ window.location.href = "/{{ModelClassName}}"; })
    });

</script>
}


