var TimeKnotsPlus = (() => {
    var configure = (options, events) => {
        var cfg = {
            width: 600,
            height: 200,
            radius: 15,
            radiusCurrent: 12,
            lineWidth: 4,
            color: "#999",
            colorPassed: "#ff008d",
            colorCurrent: "#af42e4",
            background: "#FFF",
            dateFormat: "%Y-%m-%d",
            horizontalLayout: true,
            showLabels: false,
            showCenterText: true,
            addLabels: false,
            labelFormat: "%Y-%m-%d",
            dateDimension: true,
            addCurrent: true,
            showTooltip: false,
            status: {}
        };
        if (options != undefined) {
            for (var i in options) {
                cfg[i] = options[i];
            }
        }
        if (events.filter(d => d.date == undefined || d.done == undefined).length > 0) {
            cfg.addCurrent = false;
        }
        return cfg;
    };

    var configureStatus = (options) => {
        var cfg = {
            DONE_NOTOVERDUE: { label: "done & not overdue", color: "#2bd1fc" },
            DONE_OVERDUE: { label: "done & overdue", color: "#ff48c4" },
            NOTDONE_NOTOVERDUE: { label: "not done & not overdue", color: "#f3ea5f" },
            NOTDONE_OVERDUE: { label: "not done & overdue", color: "#ff3f3f" },
            CURRENT: { label: "now", color: "#af42e4" }
        };
        if (options != undefined) {
            for (var i in options) {
                if (options[i]["label"] != undefined)
                    cfg[i]["label"] = options[i]["label"];
                if (options[i]["color"] != undefined)
                    cfg[i]["color"] = options[i]["color"];
            }
        }
        return cfg;
    };
    var getEventValue = (d) => {
        return (d.date != undefined) ? new Date(d.date).getTime() : d.value;
    };
    var convert2Value = (date) => {
        return new Date(date).getTime();
    };
    var getOverdue = (d, eventValueCurrent) => {
        if (!d.done && (eventValueCurrent >= getEventValue(d))) {
            return true;
        }
        if (d.done && d.actual && (convert2Value(d.actual) > getEventValue(d))) {
            return true;
        }
        return false;
    };
    var getKnotColor = (d, cfg) => {
        if (d.status) {
            return d.status.color;
        }
        if (d.color) {
            return d.color;
        }
        return cfg.color;
    };
    var getKnotRadius = (d, cfg) => {
        return (d.radius) ? d.radius : cfg.radius;
    };

    var setEventStatus = (d, status, eventValueCurrent) => {
        var isDone = d.done;
        var isOverdue = getOverdue(d, eventValueCurrent);

        if (getEventValue(d) == eventValueCurrent) {
            d.status = status.CURRENT;
        } else if (isDone && isOverdue) {
            d.status = status.DONE_OVERDUE;
        } else if (isDone && !isOverdue) {
            d.status = status.DONE_NOTOVERDUE;
        } else if (!isDone && isOverdue) {
            d.status = status.NOTDONE_OVERDUE;
        } else if (!isDone && !isOverdue) {
            d.status = status.NOTDONE_NOTOVERDUE;
        }
        return d;
    }
    var getEvents = (events, cfg) => {
        var currentDatetime = null;
        if (cfg.addCurrent) {
            var format = d3.time.format(cfg.dateFormat);
            var currentDatetime = format(new Date());
            events.push({ name: cfg.status.CURRENT.label, date: currentDatetime });
        }
        events.sort((a, b) => getEventValue(a) - getEventValue(b));

        if (cfg.addCurrent) {
            var eventValueCurrent = convert2Value(currentDatetime);

            var lastIdx = 0;
            events.forEach((d, i) => {
                d = setEventStatus(d, cfg.status, eventValueCurrent);
                if (getEventValue(d) <= eventValueCurrent) {
                    events[i].color = cfg.colorPassed;
                    lastIdx = i;
                }
                return;
            });
            events[lastIdx].radius = cfg.radiusCurrent;
            delete events[lastIdx].color
            return { events: events, currentEventIdx: lastIdx };
        }
        return { events: events };
    };

    var drawCenterTxt = (d, cfg, x, y, g, svgNS, centerTxt) => {
        var knotCenterTxt = document.createElementNS(svgNS, "text");
        knotCenterTxt.textContent = centerTxt;

        var fontSize = cfg.centerFontSize ? cfg.centerFontSize : getKnotRadius(d, cfg) * 16.7 / 15;
        knotCenterTxt.setAttributeNS(null, "font-size", fontSize);
        knotCenterTxt.setAttributeNS(null, "text-anchor", "middle");
        knotCenterTxt.setAttributeNS(null, "x", x);
        knotCenterTxt.setAttributeNS(null, "y", y);
        knotCenterTxt.setAttributeNS(null, "dy", "0.3em")
        knotCenterTxt.style.stroke = getKnotColor(d, cfg);
        knotCenterTxt.style.strokeWidth = "0.1em";
        knotCenterTxt.style.cursor = "default";

        g.appendChild(knotCenterTxt);
    };
    var svgTextSpanAutoLineWrap = (txt, parentText, testTspan, maxWidth) => {
        var txtSplit = txt.split(/\s+/);
        // console.log("txt 2 be split : " + txt + ", max width : " + maxWidth);

        parentText.appendChild(testTspan);

        var testLength;
        while (txtSplit[0]) {

            // console.log("text split b4 : " + txtSplit);

            var space = testTspan.textContent.trim().length > 0 ? " " : "";

            var str2Add = space + txtSplit[0];

            testTspan.textContent += str2Add;

            testLength = testTspan.getBBox().width;

            // console.log("test Tspan space length: " + space.length + " , no space = " + !space);
            // console.log("test Tspan content : " + testTspan.textContent + " , bbox width = " + testLength);

            if (!txtSplit[1] && testLength <= maxWidth) {

                var tspan = testTspan.cloneNode(true);
                parentText.appendChild(tspan);
                txtSplit.shift();
                testTspan.textContent = "";
            }
            else if (testLength < maxWidth && txtSplit[1]) {
                txtSplit.shift();
            }
            else if (testLength == maxWidth) {
                var tspan = testTspan.cloneNode(true);
                parentText.appendChild(tspan);
                txtSplit.shift();
                testTspan.textContent = "";
            }
            else if (testLength > maxWidth) {
                testTspan.textContent = testTspan.textContent.slice(0, -(str2Add.length));

                if (testTspan.textContent) {
                    var tspan = testTspan.cloneNode(true);
                    parentText.appendChild(tspan);
                }

                testTspan.textContent = str2Add;
                testLength = testTspan.getBBox().width;

                if (testLength > maxWidth) {
                    var cut = -1;
                    var trimmedStr;
                    while (testLength > maxWidth) {
                        trimmedStr = str2Add.slice(0, cut);
                        testTspan.textContent = trimmedStr;
                        testLength = testTspan.getBBox().width;
                        cut--;
                    }
                    // console.log("trimmed str : " + trimmedStr + ", cut : " + cut);

                    txtSplit.shift();

                    var trimmedLeftOver = str2Add.substring(trimmedStr.length);
                    txtSplit.unshift(trimmedStr, trimmedLeftOver);
                }
                testTspan.textContent = "";
            }
            // console.log("text split af : " + txtSplit);
        }
        parentText.removeChild(testTspan);
    };
    var drawLabels = (d, cfg, x, y, svg, svgNS) => {
        if (d.label.title || d.label.body) {
            var label = document.createElementNS(svgNS, "text");
            var radius = getKnotRadius(d, cfg);
            var xLabel = (cfg.horizontalLayout) ? x : x - radius * 5;
            var yLabel = (cfg.horizontalLayout) ? y + radius * 1.5 : y;
            var maxWidth = radius * 3.5;

            label.setAttributeNS(null, "x", xLabel);
            label.setAttributeNS(null, "y", yLabel);
            label.setAttributeNS(null, "font-size", "88%");
            label.setAttributeNS(null, "text-anchor", "middle");

            svg.appendChild(label);

            if (d.label.title) {

                var testTspan = document.createElementNS(svgNS, "tspan");
                testTspan.setAttributeNS(null, "x", xLabel);
                testTspan.setAttributeNS(null, "dy", "1em");
                testTspan.setAttributeNS(null, "text-anchor", "middle");
                testTspan.setAttributeNS(null, "text-decoration", "underline");
                testTspan.setAttributeNS(null, "font-weight", "bold");

                svgTextSpanAutoLineWrap(d.label.title, label, testTspan, maxWidth);
            }

            if (d.label.body) {

                var testTspan = document.createElementNS(svgNS, "tspan");
                testTspan.setAttributeNS(null, "x", xLabel);
                testTspan.setAttributeNS(null, "dy", "1em");
                testTspan.setAttributeNS(null, "text-anchor", "middle");

                svgTextSpanAutoLineWrap(d.label.body, label, testTspan, maxWidth);
            }
        }
    }
    var drawSVG = (id, events, cfg) => {

        var svg = document.querySelector(`${id} > svg`);
        var svgNS = svg.namespaceURI;

        var parentDiv = svg.parentElement;
        var parentWidth = parentDiv.clientWidth;

        parentDiv.style.textAlign = "center";
        svg.style.margin = "auto";

        if (svg.clientWidth < parentWidth) {
            svg.style.width = parentWidth;
        }
        var xAdjust = (cfg.horizontalLayout) ? Math.floor((parentWidth - cfg.width) / 2) : 0;
        var horizontalAdjust = (cfg.horizontalLayout && xAdjust > 0);

        var lines = svg.querySelectorAll("line");
        if (horizontalAdjust) {
            lines.forEach((e) => {
                e.setAttributeNS(null, "x1", e.x1.baseVal.value + xAdjust);
                e.setAttributeNS(null, "x2", e.x2.baseVal.value + xAdjust);
            });
        }

        var knots = svg.querySelectorAll("circle");
        var currentNum = 1;
        for (var i = 0; i < knots.length; i++) {
            var knot = knots[i];
            var d = events[i];

            var x = (horizontalAdjust) ?
                knot.cx.baseVal.value + xAdjust : knot.cx.baseVal.value;
            var y = knot.cy.baseVal.value;

            var g = document.createElementNS(svgNS, "g");
            g.classList.add("knot");

            svg.removeChild(knot);
            svg.appendChild(g);
            
            var currentStatusOn = cfg.addCurrent && d.status;
            var isCurrent = d.status == cfg.status.CURRENT;

            if (currentStatusOn && isCurrent && cfg.svgTemplateId) {
                var currentX = knot.cx.baseVal.value;
                var currentY = knot.cy.baseVal.value;

                var currentAdjust = cfg.radius * 3;
                var currentRadius = getKnotRadius(d, cfg);

                if (cfg.horizontalLayout) {
                    console.log("svg template id = ", cfg.svgTemplateId);
                    var svgPath = document.querySelector(`${cfg.svgTemplateId}`);

                    var currentSvg = document.createElementNS(svgNS, "svg");
                    var currentPath = document.createElementNS(svgNS, "path");
                    currentPath.setAttributeNS(null, "d", svgPath.getAttribute("d"));
                    currentSvg.appendChild(currentPath);
                    currentSvg.setAttributeNS(null, "x", currentX);
                    currentSvg.setAttributeNS(null, "y", currentY - currentAdjust);
                    // currentSvg.setAttributeNS(null, "width", currentRadius * 2);
                    // currentSvg.setAttributeNS(null, "height", currentRadius * 6);
                    currentSvg.setAttributeNS(null, "style", "fill:" + d.status.color);
                    // console.log("cfg status = " + JSON.stringify(cfg.status));
                    // console.log("cfg status color = " + cfg.status.CURRENT.color);
                    // obj.style.fill = cfg.status.color;

                    svg.append(currentSvg);
                    // knotClone.setAttributeNS(null, "cy", knotClone.cy.baseVal.value - currentAdjust);
                } else {
                    // knotClone.setAttributeNS(null, "cx", knotClone.cx.baseVal.value + currentAdjust);
                }
            }

            if (!currentStatusOn || !isCurrent) {

                var knotClone = knot.cloneNode(false);
                g.appendChild(knotClone);
                knotClone.style.stroke = d.status.color;

                if (horizontalAdjust) {
                    knotClone.setAttributeNS(null, "cx", x);
                }
            }
            var updateCenterTxt = cfg.showCenterText && !isCurrent;

            if (updateCenterTxt) {
                var centerTxt = (d.centerTxt) ? d.centerTxt : currentNum;
                drawCenterTxt(d, cfg, x, y, g, svgNS, centerTxt);
                currentNum++;
            }

            if (cfg.addLabels && d.label) {
                drawLabels(d, cfg, x, y, svg, svgNS);
            }
        }
    };
    var knotOn = (d, cfg, circle) => {
        circle.style.fill = getKnotColor(d, cfg);
        circle.setAttributeNS(null, "r", Math.floor(getKnotRadius(d, cfg) * 1.5));
    };
    var knotOff = (d, cfg, circle) => {
        circle.style.fill = d.background ? d.background : cfg.background;
        circle.setAttributeNS(null, "r", getKnotRadius(d, cfg));
    };
    var centerTxtOn = (d, cfg, txt) => {
        txt.style.stroke = d.background ? d.background : cfg.background;
    };
    var centerTxtOff = (d, cfg, txt) => {
        txt.style.stroke = getKnotColor(d, cfg);
    };
    var elementsOnClick = (elements, data) => {
        elements.forEach((e, i) => {
            var d = data[i];
            var fn = (d.callback != undefined && d.callback.fn && typeof d.callback.fn === 'function') ? d.callback.fn : null;
            if (fn) {
                var args = (d.callback.args && Array.isArray(d.callback.args)
                    && d.callback.args.length > 0) ? d.callback.args : [];
                e.addEventListener("click", function () {
                    fn(...args);
                });
            }
        });
    };

    var tooltipOn = (d, cfg, tip, event) => {
        tip.html("");

        if (d.img != undefined) {
            tip.append("img")
                .style("float", "left")
                .style("margin-right", "4px")
                .attr("src", d.img)
                .attr("width", "64px");
        }

        var dateValue;
        if ("date" in d) {
            var format = d3.time.format(cfg.dateFormat);
            var datetime = format(new Date(d.date));
            dateValue = (datetime) ? (d.name + "<br><small>target: " + datetime + "</small>") : d.name;
            if (d.status) {
                dateValue = dateValue + "<br><small> actual: "
                    + (d.actual ? d.actual : "not done yet") + "</small>"
                    + "<br><small> status: " + d.status.label + "</small>";
            }
        } else {
            dateValue = d.name + ((d.value != undefined) ? " <small>(" + d.value + ")</small>" : "");
        }

        tip.append("div")
            .style("float", "left")
            .style("top", event.pageY + "px")
            .style("left", event.pageX + "px")
            .html(dateValue);

        tip.transition()
            .duration(100)
            .style("opacity", .9);
    };

    var tooltipOff = (tip) => {
        tip.transition()
            .duration(100)
            .style("opacity", 0);
    };

    var timeKnotsPlus = {
        draw: (id, events, cfg) => {

            var cfg = configure(cfg, events);

            cfg.status = configureStatus(cfg.status);

            var eventsObj = getEvents(events, cfg);

            events = eventsObj.events;

            TimeKnots.draw(id, events, cfg);

            drawSVG(id, events, cfg);

            var knots = document.querySelectorAll(`${id} > svg > g.knot`);
            elementsOnClick(knots, events);

            var tip = (cfg.showTooltip) ? d3.select(id).select("div") : null;

            knots.forEach((e, i) => {
                var d = events[i];
                var circle = e.querySelector("circle");
                var txt = cfg.showCenterText ? e.querySelector("text") : null;
                e.addEventListener("mouseover", function (event) {
                    knotOn(d, cfg, circle);
                    if (cfg.showCenterText && txt) {
                        centerTxtOn(d, cfg, txt);
                    }
                    if (cfg.showTooltip) {
                        tooltipOn(d, cfg, tip, event);
                    }
                });
                e.addEventListener("mouseout", function (event) {
                    knotOff(d, cfg, circle);
                    if (cfg.showCenterText && txt) {
                        centerTxtOff(d, cfg, txt);
                    }
                    if (cfg.showTooltip) {
                        tooltipOff(tip);
                    }
                });
            });
        }
    };
    return timeKnotsPlus;
})();