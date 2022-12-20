@model {{ModelClassName}}ViewModel
@{
    ViewBag.Title = Model.breadcrumbs.Title;
}
@section Css
{
<!-- BEGIN VENDOR CSS-->
<link rel="stylesheet" type="text/css" href="~/Rubust/vendors/css/tables/datatable/dataTables.bootstrap4.min.css">
<link rel="stylesheet" type="text/css" href="~/Rubust/vendors/css/forms/icheck/icheck.css">
<link rel="stylesheet" type="text/css" href="~/Rubust/vendors/css/forms/icheck/custom.css">
<link rel="stylesheet" type="text/css" href="~/Rubust/vendors/css/forms/selects/select2.min.css">
<!-- END VENDOR CSS-->
<style>
    .show > .dropdown-menu {
        z-index: 1002;
    }

    .dropdown-toggle {
        z-index: 1001;
        position: inherit;
    }
</style>
}
<div class="content-wrapper">
    <div class="content-header">
        @await Component.InvokeAsync("Breadcrumbs", Model.breadcrumbs)
    </div>
    <div class="content-body">
        <section>
            <das-card das-title="@Model.breadcrumbs.Title">
                <das-card-header>                     
                    <div class="input-group float-right">
                        <button class="btn btn-info btn-sm" id="BtnCreate" style="margin-right: 5px;"><i class="ft-plus white"></i> Create {{ModelClassName}}</button>
                        @*<div class="input-group-prepend">
                            <button class="btn btn-success btn-sm" type="button"><i class="fa fa-search"></i></button>
                        </div>
                        <input type="text" class="form-control" placeholder="Search..." style="height: 36px;" />*@
                        <div class="input-group-append">
                            <button class="btn btn-sm btn-info" type="button" id='btnShowFilter'>
                                <i class="fa fa-filter"></i>
                            </button>
                        </div>
                    </div>
                </das-card-header>
                <das-card-body>
                    <div id="filterPanel" class="card-body" style="padding: 10px 20px;border: 1px solid #bfbfbf; margin-bottom: 20px;">
                        <div class="form-body">
                            <form id="frmSearchCriteria" class="form row">
                                  @* To Revise*@
                                  @*<div class="form-group mb-1 col-sm-12 col-md-4">
                                      <label asp-for=></label><br>
                                      <input type="text" asp-for= class="form-control" placeholder="" />
                                  </div>
                                  <div class="form-group mb-1 col-sm-12 col-md-4">
                                      <label asp-for=></label><br>
                                      <input type="text" asp-for= class="form-control" placeholder="" />
                                  </div>
                                  <div class="form-group mb-1 col-sm-12 col-md-4">
                                      <label asp-for=></label><br>
                                      <input type="text" asp-for= class="form-control" placeholder="" />
                                  </div>*@
                            </form>
                        </div>
                        <div class="form-actions">
                            <div class="text-right" style="">
                                <button type="submit" class="btn btn-info btn-sm" id="BtnSearch">Search <i class="fa fa-search position-right"></i></button>
                            </div>
                        </div>
                    </div>
                    @await Component.InvokeAsync("Table", Model.TableHeadList.AsQueryable())
                </das-card-body>
            </das-card>    
        </section>
    </div>
    @*</form>*@
</div>
@section Scripts
{
<!-- BEGIN PAGE VENDOR JS-->
<script src="~/Rubust/vendors/js/tables/jquery.dataTables.min.js"></script>
<script src="~/Rubust/vendors/js/tables/datatable/dataTables.bootstrap4.min.js"></script>
<script src="~/Rubust/vendors/js/forms/icheck/icheck.min.js"></script>
<script src="~/Rubust/vendors/js/forms/select/select2.full.min.js"></script>
<!-- END PAGE VENDOR JS-->
<!-- BEGIN PAGE LEVEL JS-->
<script>
    var dataTable
     function onDelete(id){
        var that=this;
        function DeleteConfirm(){
            $.ajax({
                method: "POST",
                url: "/{{ModelClassName}}/Delete",
                data: {
                    Id: id,
                },
                success: function (data) {
                if (data.ERROR_CODE == "") {
                    that.dataTable.ajax.reload(that.dasFormTool.searchData);
                } else {
                    dasAlert.showError(data.MESSAGE);
                }
                },
                    error: function (jqXHR, textStatus, errorThrown) {
                    dasAlert.showError('Error');
                }
            });            
        }
        dasAlert.showConfirm('Are you sure to delete this record?',DeleteConfirm);    
     }

    $(document).ready(function () {
        $(".select2").select2();
        /********************************************
        *              js of dataTable              *
        ********************************************/
        let oConfig={
            processing: true,
            serverSide: true,
            deferRender: true,
            filter: false,
            lengthChange: false,
            ajax: {
               "url": "/{{ModelClassName}}/Grid",
               "type": "Post",
               "data": dasFormTool.searchData
            },
            //To Revise
            columns: [
                { "data": null },
                { "data": null },
                { "data": null },
                { "data": null }
                  /*
                {
                    "data": "{{ModelClassName}}Doc",
                    "render": function (data, type, full, meta) {
                         return full.{{ModelClassName}}Doc.length>0 ? full.{{ModelClassName}}Doc[0].docDesc : "";
                    }
                },
                {
                    "data": "{{ModelClassName}}TypeCode",
                    "render": function (data, type, full, meta) {
                        return full.{{ModelClassName}}TypeName;
                    }
                },
                { "data": "Remark" },
                { "data": "UpdatedBy" },
                {
                    "data": "LastUpdatedDateTime",
                    "render": function (data, type, full, meta) {
                        var dataStr = Date.parse(data);
                        return new Date(dataStr).Format("dd/MM/yyyy");
                    }
                },
                */
            ],
            columnDefs: [
            {
                "targets": -1,
                "orderable":false,
                "width": "30px",
                "render": function (data, type, full, meta) {
                    return '<span class="dropdown">\
                                            <button id="btnSearchDrop" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" class="btn btn-info dropdown-toggle dropdown-menu-right"><i class="fa fa-list-ul"></i></button>\
                                            <span aria-labelledby="btnSearchDrop" class="dropdown-menu mt-1 dropdown-menu-right" >' +
                                                '<a class="dropdown-item"  href="/{{ModelClassName}}/View/' + full.{{ModelKeyName}} + '"><i class="fa fa-eye"></i> View</a>' +
                                                '<a class="dropdown-item"  href="/{{ModelClassName}}/Edit/' + full.{{ModelKeyName}} + '"><i class="fa fa-pencil"></i> Edit</a>' +
                                                '<a class="dropdown-item" data-id="' + full.{{ModelKeyName}} +'" onclick="onDelete(' + full.{{ModelKeyName}} +')"><i class="fa fa-trash"></i> Delete</a>' +
                                            '</span></span>'
                }
            }],
            displayLength: 25
        }
        dataTable = $('.table-list').DataTable(oConfig);       
        $(document).on("click", "#btnShowFilter",function (){ $('#filterPanel').toggle(); })
        $(document).on("click", "#BtnCreate",function (){ window.location.href = "/{{ModelClassName}}/Create"; })
        $(document).on("click", "#BtnSearch",function (){ dataTable.ajax.reload(dasFormTool.searchData); })        
    });
</script>
<!-- END PAGE LEVEL JS-->
}

