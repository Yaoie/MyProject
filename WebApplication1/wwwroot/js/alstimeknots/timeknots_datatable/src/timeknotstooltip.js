var TimeKnotsPlus = (() => {
    var configure = (options) => {
        var cfg = {
            width: 600,
            height: 200,
            radius: 15,
            radiusCurrent: 12,
            lineWidth: 4,
            color: "#999",
            colorProgress: "#ff008d",
            colorCurrent: "#af42e4",
            background: "#FFF",
            dateFormat: "%Y/%m/%d %H:%M:%S",
            horizontalLayout: true,
            showLabels: false,
            labelFormat: "%Y/%m/%d %H:%M:%S",
            seriesColor: d3.scale.category20(),
            dateDimension: true,
            showTooltip: false
        };
        if (options != undefined) {
            for (var i in options) {
                cfg[i] = options[i];
            }
        }
        return cfg;
    };
    var configureSeriesColor = (events, cfg, lastIdx) => {
        var series = []

        if (lastIdx < (events.length -1)) {
            events[lastIdx].series = events[lastIdx + 1].series; 
        }

        var startIdx = lastIdx > -1 ? lastIdx : 0;
        for (i = startIdx; i < events.length; i++) {
            var d = events[i];
            if (d.series != undefined && series.indexOf(d.series) < 0) {
                series.push(d.series);
            }
        }
        if (series.length > 0) {
            cfg.thisSeries = series;
        }
        return cfg;
    };
    var getEventValue = (d) => {
        return (d.date != undefined) ? new Date(d.date).getTime() : d.value;
    };
    var getKnotColor = (d, cfg) => {
        if (d.color != undefined) {
            return d.color;
        }
        if (d.series != undefined && cfg.thisSeries != undefined) {
            return cfg.seriesColor(cfg.thisSeries.indexOf(d.series));
        }
        return cfg.color;
    };
    var getKnotRadius = (d, cfg) => {
        return (d.radius != undefined) ? d.radius : cfg.radius;
    };
    var getEvents = (events, currentEvent, cfg) => {

        if (currentEvent != null) {
            events.push(currentEvent);
        }
        events.sort((a, b) => getEventValue(a) - getEventValue(b));
        if (currentEvent != null) {
            var eventValueCurrent = getEventValue(currentEvent);
            var idx = 0;
            var lastIdx = 0;
            events.forEach((d) => {
                if (getEventValue(d) <= eventValueCurrent) {
                    events[idx].color = cfg.colorProgress;
                    lastIdx = idx;
                    idx++;
                }
                return;
            });
            events[lastIdx].radius = cfg.radiusCurrent;
            events[lastIdx].color = cfg.colorCurrent;
            return { events: events, currentEventIdx: lastIdx };
        }
        return { events: events };
    };
    var overrideLineColor = (id, idx, cfg, events) => {
        var line = document.querySelector(`${id} > svg > line:nth-child(${idx + 1})`);
        line.style.stroke = cfg.thisSeries != undefined ?
            cfg.seriesColor(cfg.thisSeries.indexOf(events[idx].series)) : cfg.color;
    };

    var drawNums = (id, events, cfg) => {

        var minValue = getEventValue(events[0]);
        var maxValue = getEventValue(events[events.length - 1]);

        var margin = (d3.max(events.map(function (d) { return d.radius })) || cfg.radius) * 1.5
            + cfg.lineWidth;
        var step = (cfg.horizontalLayout) ? ((cfg.width - 2 * margin) / (maxValue - minValue)) :
            ((cfg.height - 2 * margin) / (maxValue - minValue));
        if (maxValue == minValue) {
            step = 0;
            if (cfg.horizontalLayout) {
                margin = cfg.width / 2
            } else {
                margin = cfg.height / 2
            }
        }
        var svg = document.querySelector(`${id} > svg`);
        var svgNS = svg.namespaceURI;
        var knots = svg.querySelectorAll("circle");

        for (var i = 0; i < knots.length; i++) {
            var d = events[i];
            var eventVal = getEventValue(d);
            var x = (cfg.horizontalLayout) ?
                Math.floor(step * (eventVal - minValue) + margin) :
                Math.floor(cfg.width / 2);
            var y = (cfg.horizontalLayout) ? Math.floor(cfg.height / 2) :
                Math.floor(step * (eventVal - minValue)) + margin;
            var r = getKnotRadius(d, cfg);
            var fontSize = r / ((r * 6) / 100);

            var g = document.createElementNS(svgNS, "g");
            var text = document.createElementNS(svgNS, "text");
            var knot = knots[i];
            var knotClone = knot.cloneNode(false);

            svg.removeChild(knot);
            g.appendChild(knotClone);
            g.appendChild(text);

            text.textContent = i + 1;
            text.setAttributeNS(null, "x", x);
            text.setAttributeNS(null, "y", y);
            text.setAttributeNS(null, "text-anchor", "middle");
            text.setAttributeNS(null, "font-size", fontSize);
            text.setAttributeNS(null, "dy", "0.3em")
            text.style.stroke = getKnotColor(d, cfg);
            text.style.strokeWidth = "2px";
            text.style.cursor = "default";

            svg.appendChild(g);
        }
    };
    var knotOn = (d, cfg, circle, txt) => {
        circle.style.fill = getKnotColor(d, cfg);
        circle.setAttributeNS(null, "r", Math.floor(getKnotRadius(d, cfg) * 1.5));
        txt.style.stroke = d.background != undefined ? d.background : cfg.background;
    };
    var knotOff = (d, cfg, circle, txt) => {
        circle.style.fill = d.background != undefined ? d.background : cfg.background;
        circle.setAttributeNS(null, "r", getKnotRadius(d, cfg));
        txt.style.stroke = getKnotColor(d, cfg);
    };
    var labelOn = (d, cfg, tip) => {

        
        var tipNS = tip.namespaceURI;

        console.log("label on ");
        // tip.html("");

        if (d.img != undefined) {
            var img = document.createElementNS(tipNS, "img");
            img.style.float = "left";
            img.style.marginRight = "4px";
            img.setAttributeNS(null, "src", d.img);
            img.setAttributeNS(null, "width", "64px");
            tip.appendChild(img);
            // tip.append("img")
            //     .style("float", "left")
            //     .style("margin-right", "4px")
            //     .attr("src", d.img)
            //     .attr("width", "64px");
        }

        var dateValue;
        if ("date" in d) {
            var format = d3.time.format(cfg.dateFormat);
            var datetime = format(new Date(d.date));
            dateValue = (datetime != "") ? (d.name + " <small>(" + datetime + ")</small>") : d.name;
        } else {
            dateValue = d.name + ((d.value != undefined) ? " <small>(" + d.value + ")</small>" : "");
        }

        var div = document.createElementNS(tipNS, "div");
        div.innerHTML = dateValue;
        div.style.float = "left";
        // div.style.transitionDuration = 100;
        div.style.opacity = 0.9;

        tip.appendChild(div);
        // transition: opacity 5s;  
        // opacity: 1;

        // tip.append("div")
        //     .style("float", "left")
        //     .html(dateValue);

        // tip.transition()
        //     .duration(100)
        //     .style("opacity", .9);
    };

    var labelOff = (tip) => {
        console.log("label off ");

        tip.style.opacity = 0;
        // tip.style.transitionDuration = 100;

        var div = tip.querySelector("div");
        var img = tip.querySelector("img");
        if (div != null){
            tip.removeChild(div);
            tip.removeChild(img);
        }
        // tip.transition()
        //     .duration(100)
        //     .style("opacity", 0);
    };

    var elementsOnClick = (elements, fn, ...args) => {
        elements.forEach((e) => {
            e.addEventListener("click", function () {
                fn(...args);
            });
        });
    };
    var timeKnotsPlus = {
        draw: (id, events, currentEvent, cfg, fn, ...args) => {

            var cfg = configure(cfg);
            var eventsObj = getEvents(events, currentEvent, cfg);

            events = eventsObj.events;

            var lastIdx = (eventsObj.currentEventIdx != undefined) ? eventsObj.currentEventIdx : -1;

            cfg = configureSeriesColor(events, cfg, lastIdx);

            TimeKnots.draw(id, events, cfg);

            if (lastIdx > -1){
                overrideLineColor(id, lastIdx, cfg, events);
            }
            drawNums(id, events, cfg);

            var knots = document.querySelectorAll(`${id} > svg > g`);
            elementsOnClick(knots, fn, ...args);

            var tip = (cfg.showTooltip)? document.querySelector(`${id} > div`) : null;
            
            console.log("show tooltip : " + cfg.showTooltip);
            console.log("tip : " + tip);

            var i = 0;
            knots.forEach((e) => {
                var d = events[i];
                var circle = e.querySelector("circle");
                var txt = e.querySelector("text"); 
                e.addEventListener("mouseover", function () {
                    knotOn(d, cfg, circle, txt);
                    if (tip != null){
                        labelOn(d, cfg, tip);
                    }
                });
                e.addEventListener("mouseout", function () {
                    knotOff(d, cfg, circle, txt);
                    if (tip != null){
                        labelOff(tip);
                    }
                });
                i++;
            });
        }
    };
    return timeKnotsPlus;
})();