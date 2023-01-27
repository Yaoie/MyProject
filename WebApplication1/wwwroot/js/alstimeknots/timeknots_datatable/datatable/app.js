var tableBody = document.querySelector("#myTable > tbody");
var body = document.querySelector("body");
var tableWrapper = document.querySelector("#myTable_wrapper");

var displayData = data;

for (var i = 0; i < displayData.length; i++) {
    var item = displayData[i];

    var tr = document.createElement("tr");
    tableBody.appendChild(tr);

    for (var key in item) {
        var td = document.createElement("td");
        tr.appendChild(td);

        if (key != "progress") {
            td.innerHTML = item[key];
        } else {
            var progressContainerId = `progress-${item["project_id"]}`;

            var div = document.createElement("div");
            div.setAttribute("id", progressContainerId);
            td.appendChild(div);

            var events = item.progress.events;
            var cfg = item.progress.cfg;
            TimeKnotsPlus.draw(`#${progressContainerId}`, events, cfg);

            var tooltip = document.querySelector(`#tooltip-${progressContainerId}`);
            body.insertBefore(tooltip, tableWrapper);
        }
    }
}