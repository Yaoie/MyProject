@model {{ModelClassName}}ViewModel
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
                             <div class="form-body">
                                 <h4 class="form-section"><i class="fa fa-eye"></i>Basic Info</h4>
                                 @* TO Revise*@
                                 @*<div class="row">
                                     <div class="form-group col-md-6">
                                         <span class="red">*</span><label asp-for=UserName class="label-control"></label>
                                          <label class="form-control"></label>
                                     </div>
                                     <div class="form-group col-md-6">
                                         <span class="red">*</span><label asp-for=FullName class="label-control"></label>
                                        <label class="form-control"></label>
                                     </div>
                                 </div>*@                                                       
                             </div>
                             <div class="form-actions right">
                                 <button id="btnBack" type="button" class="btn btn-warning mr-1"><i class="ft-x"></i>Back</button>
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
<script>
    $('#btnBack').click(function () {
        window.location.href = "/{{ModelClassName}}";
    });
</script>
}


