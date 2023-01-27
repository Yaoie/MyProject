var events1 = [
    {
        code: uuid(), name: "Stage 3", date: "2025-05-15", actual: "", done: false,
        label: { title: "Stage 3", body: "Curtailed Check" }, background: "#dfdede",
        callback: { fn: () => { alert("Stage 3"); } }
    },
    {
        code: uuid(), name: "Stage 1", date: "2018-03-31", actual: "2018-03-31", done: true,
        label: { title: "Stage 1", body: "Submission Review" },
        callback: { fn: (a) => { alert("Stage 1 : " + a); }, args: ["parameter 1"] }
    },
    {
        code: uuid(), name: "Stage 2", date: "2021-07-19", actual: "", done: false,
        label: { title: "Stage 2", body: "Comment to Applicant" },
        callback: { fn: (a, b) => { alert("Stage 2 : " + a + ", " + b); }, args: ["parameter 1", "parameter 2"] }
    },
    {
        code: uuid(), name: "Reply to Applicant", date: "2028-11-21", actual: "", done: false,
        label: { body: "Reply to Applicant" }, background: "#dfdede"
    }
    // ,
    // {
    //   code: uuid(), name: "Current data", date: currentDatetime, actual: "", done: false,
    //   label: { title: "Current data", body: "Current date test" }, 
    //   callback: { fn: () => { alert("Stage 2 current data"); } }
    // }
];


var events2 = [
    {
        code: uuid(), name: "Stage 5", date: "2030-11-05 00:00:01", actual: "2022-07-01 00:00:01", done: true,
        label: { title: "Stage 5", body: "Curtailed Check Curtailed Check Curtailed Check" },
        callback: { fn: () => { alert("Stage 5"); } }
    },
    {
        code: uuid(), name: "Stage 4", date: "2028-05-15 12:11:00", actual: "", done: false,
        label: { title: "Stage 4", body: "Curtailed CheckCurtailedCheck Curtailed Check" },
        callback: { fn: () => { alert("Stage 4"); } }
    },
    {
        code: uuid(), name: "Stage 3", date: "2025-01-25 12:11:00", actual: "2022-6-10 12:11:00", done: true,
        label: { title: "Stage 3", body: "Curtailed Check" },
        callback: { fn: () => { alert("Stage 3"); } }
    },
    {
        code: uuid(), name: "Stage 1", date: "2015-03-31 12:11:00", actual: "2015-03-31 12:11:00", done: true,
        label: { title: "Stage 1", body: "Submission Review" },
        callback: { fn: (a) => { alert("Stage 1 : " + a); }, args: ["parameter 1"] }
    },
    {
        code: uuid(), name: "Stage 2", date: "2019-07-19 12:11:00", actual: "", done: false,
        label: { title: "Stage 2", body: "Comment to Applicant" },
        callback: { fn: (a, b) => { alert("Stage 2 : " + a + ", " + b); }, args: ["parameter 1", "parameter 2"] }
    },
    {
        code: uuid(), name: "Reply to Applicant", date: "2035-11-21 18:11:00", actual: "", done: false,
        label: { body: "Reply to Applicant" }, background: "#00fff3"
    },
];


var events3 = [
    {
        code: uuid(), name: "Stage 5", date: "2030-11-05 00:00:01", actual: "2022-07-01 00:00:01", done: true,
        label: { title: "Stage 5", body: "Curtailed Check Curtailed Check Curtailed Check" },
        callback: { fn: () => { alert("Stage 5"); } }
    },
    {
        code: uuid(), name: "Stage 4", date: "2028-05-15 12:11:00", actual: "", done: false,
        label: { title: "Stage 4", body: "Curtailed CheckCurtailedCheck Curtailed Check" },
        callback: { fn: () => { alert("Stage 4"); } }
    },
    {
        code: uuid(), name: "Stage 3", date: "2025-01-25 12:11:00", actual: "2022-6-10 12:11:00", done: true,
        label: { title: "Stage 3", body: "Curtailed Check" },
        callback: { fn: () => { alert("Stage 3"); } }
    },
    {
        code: uuid(), name: "Stage 1", date: "2015-03-31 12:11:00", actual: "2015-03-31 12:11:00", done: true,
        label: { title: "Stage 1", body: "Submission Review" },
        callback: { fn: (a) => { alert("Stage 1 : " + a); }, args: ["parameter 1"] }
    },
    {
        code: uuid(), name: "Stage 2", date: "2019-07-19 12:11:00", actual: "", done: false,
        label: { title: "Stage 2", body: "Comment to Applicant" },
        callback: { fn: (a, b) => { alert("Stage 2 : " + a + ", " + b); }, args: ["parameter 1", "parameter 2"] }
    },
    {
        code: uuid(), name: "Reply to Applicant", date: "2035-11-21 18:11:00", actual: "", done: false,
        label: { body: "Reply to Applicant" }, background: "#00fff3"
    },
];

var cfgBarMode = {
    colorPassedBar: "#cc0071"
};
var cfgNonBarMode = {
    addLabels: false,
    showCenterText: true,
    showCurrentArrow: false,
    showCircularProgressBar: false,
    colorProgressCircularBar: "#ff008d",
    highlightCurrent: false,
};
var cfgProgress = {
    status: {},
    radiusCurrent: 12,
    colorPassed: "#ff008d"
};

var cfg1 = {
    lineWidth: 10,
    radius: 5,
    // radiusCurrent: 15,
    color: "#a29890",
    // colorPassed: "#65c22f",
    // colorPassedBar:"#509b25",
    width: 600,
    height: 30,
    // addLabels: false,
    dateFormat: "%Y-%m-%d",
    labelFormat: "%Y",
    showTooltip: true,
    // showCenterText: false,
    currentProgressMode: true,
    barMode: true,
    cfgProgress:{
        radiusCurrent: 8,
        colorPassed: "#65c22f",
        status: {
            DONE_NOTOVERDUE: { label: "done & not overdue", color: "#2741cf" },
            // DONE_OVERDUE: { label: "done & overdue", color: "#ff48c4" },
            NOTDONE_NOTOVERDUE: { label: "not done & not overdue", color: "#625d5a" },
            // NOTDONE_OVERDUE: { label: "not done & overdue", color: "#ff3f3f" },
            CURRENT: { label: "now", color: "#50adf4" }
        }
    },
    cfgBarMode: {
        colorPassedBar: "#509b25"
    }
};

var cfg2 = {
    radius: 29,
    color: "#06a4d5",
    width: 600,
    height: 30,
    addLabels: false,
    dateFormat: "%Y-%m-%d %H:%M:%S",
    labelFormat: "%Y-%m-%d %H:%M:%S",
    showTooltip: true,
    currentProgressMode: true,
    barMode: true,
    // cfgProgress:{
    //     colorPassed: "#65c22f",
    //     status: {
    //         DONE_NOTOVERDUE: { label: "done & not overdue", color: "#2741cf" },
    //         // DONE_OVERDUE: { label: "done & overdue", color: "#ff48c4" },
    //         NOTDONE_NOTOVERDUE: { label: "not done & not overdue", color: "#625d5a" },
    //         // NOTDONE_OVERDUE: { label: "not done & overdue", color: "#ff3f3f" },
    //         CURRENT: { label: "now", color: "#50adf4" }
    //     }
    // },
    // cfgBarMode: {
    //     colorPassedBar: "#509b25"
    // }
};

var cfg3 = {
    radius: 20,
    color: "#06a4d5",
    lineWidth: 5,
    width: 600,
    height: 300,
    dateFormat: "%Y-%m-%d %H:%M:%S",
    labelFormat: "%Y-%m-%d %H:%M:%S",
    showTooltip: true,
    barMode: false,
    cfgNonBarMode: {
        addLabels: true,
        // showCenterText: true,
        // showCurrentArrow: false,
        showCircularProgressBar: true,
        // colorProgressCircularBar: "#ff008d",
        // highlightCurrent: false,
    }
};

var data = [
    { "project_id": 1, "title": "Project #1", "progress": {"events": events1, "cfg": cfg1 } },
    { "project_id": 2, "title": "Project #2", "progress": {"events": events2, "cfg": cfg2} },
    { "project_id": 3, "title": "Project #3", "progress": {"events": events3, "cfg": cfg3} },
];

var createData = (n) =>{
    var ret = [];
    for(var i=0; i<n; i++){
        var item = {};
        item.project_id = i+1;
        item.title = `Project #${i+1}`;
        item.progress ={};
        if ((i+1) % 2 == 1){
            item.progress.events = events1;
            item.progress.cfg = cfg1;
        }else{
            item.progress.events = events2;
            item.progress.cfg = cfg2;
        }
        ret.push(item);
    }
    return ret;
}

var data100 = createData(100);