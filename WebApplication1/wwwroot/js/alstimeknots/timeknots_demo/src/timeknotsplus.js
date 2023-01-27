var TimeKnotsPlus = (() => {
    var SVG_NS = "http://www.w3.org/2000/svg";
    var SVG_PATH_ARROW_DOWN = "M32,16.016l-5.672-5.664c0,0-3.18,3.18-6.312,6.312V0h-8.023v16.664l-6.32-6.32L0,16.016L16,32L32,16.016z";
    var SVG_PATH_TICK = "M 22.566406 4.730469 L 20.773438 3.511719 C 20.277344 3.175781 19.597656 3.304688 19.265625 3.796875 L 10.476563 16.757813 L 6.4375 12.71875 C 6.015625 12.296875 5.328125 12.296875 4.90625 12.71875 L 3.371094 14.253906 C 2.949219 14.675781 2.949219 15.363281 3.371094 15.789063 L 9.582031 22 C 9.929688 22.347656 10.476563 22.613281 10.96875 22.613281 C 11.460938 22.613281 11.957031 22.304688 12.277344 21.839844 L 22.855469 6.234375 C 23.191406 5.742188 23.0625 5.066406 22.566406 4.730469 Z";
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
        if (d.passed) {
            return cfg.colorPassed;
        }
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
                if (getEventValue(d) < eventValueCurrent) {
                    d.passed = true
                    d.color = cfg.colorPassed;
                    lastIdx = i;
                }
                return;
            });
            return { events: events, currentEventIdx: lastIdx + 1 };
        }
        return { events: events };
    };

    var drawSvgByPath = (svgPath, x, y, color, scale) => {
        var ret = document.createElementNS(SVG_NS, "svg");
        ret.setAttributeNS(null, "x", x);
        ret.setAttributeNS(null, "y", y);

        var g = document.createElementNS(SVG_NS, "g");
        g.setAttributeNS(null, "style", "fill:" + color);
        g.setAttributeNS(null, "transform", `scale(${scale},${scale})`);

        var path = document.createElementNS(SVG_NS, "path");
        path.setAttributeNS(null, "d", svgPath);

        ret.appendChild(g);
        g.appendChild(path);

        return ret;
    }

    var drawCurrentMark = (d, cfg, x, y) => {
        var scale = (cfg.radius/25);
        var xAdjust = -16 * scale;
        var yAdjust = -cfg.radius * 2.5;

        var ret = drawSvgByPath(SVG_PATH_ARROW_DOWN, x + xAdjust, y + yAdjust, d.status.color, scale);
        return ret;
    };

    var drawCenterTxt = (d, cfg, radius, x, y, color, centerTxt) => {
        var ret = document.createElementNS(SVG_NS, "text");
        ret.textContent = centerTxt;

        var fontSize = cfg.centerFontSize ? cfg.centerFontSize : radius * 16.7 / 15;
        ret.setAttributeNS(null, "font-size", fontSize);
        ret.setAttributeNS(null, "text-anchor", "middle");
        ret.setAttributeNS(null, "x", x);
        ret.setAttributeNS(null, "y", y);
        ret.setAttributeNS(null, "dy", "0.3em")
        ret.style.stroke = color;
        ret.style.strokeWidth = "0.1em";
        ret.style.cursor = "default";

        return ret;
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
    var drawLabels = (d, cfg, radius, x, y, svg) => {
        var label = document.createElementNS(SVG_NS, "text");
        var xLabel = (cfg.horizontalLayout) ? x : x - radius * 5;
        var yLabel = (cfg.horizontalLayout) ? y + radius * 1.5 : y;
        var maxWidth = radius * 3.5;

        label.setAttributeNS(null, "x", xLabel);
        label.setAttributeNS(null, "y", yLabel);
        label.setAttributeNS(null, "font-size", "88%");
        label.setAttributeNS(null, "text-anchor", "middle");

        svg.appendChild(label);

        if (d.label.title) {

            var testTspan = document.createElementNS(SVG_NS, "tspan");
            testTspan.setAttributeNS(null, "x", xLabel);
            testTspan.setAttributeNS(null, "dy", "1em");
            testTspan.setAttributeNS(null, "text-anchor", "middle");
            testTspan.setAttributeNS(null, "text-decoration", "underline");
            testTspan.setAttributeNS(null, "font-weight", "bold");

            svgTextSpanAutoLineWrap(d.label.title, label, testTspan, maxWidth);
        }

        if (d.label.body) {

            var testTspan = document.createElementNS(SVG_NS, "tspan");
            testTspan.setAttributeNS(null, "x", xLabel);
            testTspan.setAttributeNS(null, "dy", "1em");
            testTspan.setAttributeNS(null, "text-anchor", "middle");

            svgTextSpanAutoLineWrap(d.label.body, label, testTspan, maxWidth);
        }
    }
    var drawSVG = (id, events, cfg) => {

        var svg = document.querySelector(`${id} > svg`);

        var parentDiv = svg.parentElement;

        parentDiv.style.textAlign = "center";
        svg.style.margin = "auto";

        var knots = svg.querySelectorAll("circle");

        knots.forEach((e, i) => {
            console.log(`knots ${i} : ${JSON.stringify(e)}`);
        });

        var currentNum = 1;
        for (var i = 0; i < knots.length; i++) {
            var knot = knots[i];
            var d = events[i];
            var x = knot.cx.baseVal.value;
            var y = knot.cy.baseVal.value;

            svg.removeChild(knot);

            var currentStatusOn = cfg.addCurrent && d.status;
            var isCurrent = d.status == cfg.status.CURRENT;

            if (currentStatusOn && isCurrent) {

                var currentSvg = drawCurrentMark(d, cfg, x, y);
                svg.append(currentSvg);

                //DEBUG
                // var knotClone = knot.cloneNode(false);
                // knotClone.setAttributeNS(null, "r", 5);
                // knotClone.style.color = cfg.colorCurrent;
            
                // g.appendChild(knotClone);
            }

            if (!currentStatusOn || !isCurrent) {
                var g = document.createElementNS(SVG_NS, "g");
                g.classList.add("knot");

                svg.appendChild(g);

                var knotClone = knot.cloneNode(false);
                g.appendChild(knotClone);

                if (!d.passed)
                    knotClone.style.stroke = d.status.color;
            }

            var radius = getKnotRadius(d, cfg);

            var updateCenterTxt = cfg.showCenterText && !isCurrent;

            if (updateCenterTxt) {

                var color = getKnotColor(d, cfg);

                if (d.passed) {
                    var scale = 1.5 * (radius/25);
                    var xAdjust = -13 * scale;
                    var yAdjust = -13 * scale;
                    var tick = drawSvgByPath(SVG_PATH_TICK, x + xAdjust, y + yAdjust, color, scale);
                    tick.classList.add("tick");

                    g.appendChild(tick);
                } else {
                    var centerTxt = (d.centerTxt) ? d.centerTxt : currentNum;
                    var centerTxt = drawCenterTxt(d, cfg, radius, x, y, color, centerTxt);
                    g.appendChild(centerTxt);
                }
                currentNum++;
            }

            if (cfg.addLabels && d.label && (d.label.title || d.label.body)) {
                drawLabels(d, cfg, radius, x, y, svg);
            }
        }
    };
    var knotOnOff = (radius, color, circle) => {
        circle.style.fill = color;
        circle.setAttributeNS(null, "r", radius);
    };
    var centerTxtOnOff = (txt, color) => {
        txt.style.stroke = color;
    };
    var tickOnOff = (tick, color) => {
        tick.style.fill = color;
    };
    var elementsOnClick = (elements, data) => {
        elements.forEach((e, i) => {
            var d = data[i];
            var fn = (d.callback && d.callback.fn && typeof d.callback.fn === 'function') ? d.callback.fn : null;
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

            events.forEach((e, i) => {
                console.log(`event ${i} : ${JSON.stringify(e)}`);
            });

            TimeKnots.draw(id, events, cfg);

            drawSVG(id, events, cfg);

            var knots = document.querySelectorAll(`${id} > svg > g.knot`);
            var currentEventIdx = (eventsObj.currentEventIdx) ? eventsObj.currentEventIdx : -1;
            var knotEvents = (currentEventIdx > -1) ? events.filter((e, i) => i != currentEventIdx) : events;
            elementsOnClick(knots, knotEvents);

            var tip = (cfg.showTooltip) ? d3.select(id).select("div") : null;

            knots.forEach((e, i) => {
                var d = knotEvents[i];
                var circle = e.querySelector("circle");
                var txt = cfg.showCenterText ? e.querySelector("text") : null;
                var tick = cfg.showCenterText ? e.querySelector("svg.tick > g") : null;
                var radius = getKnotRadius(d, cfg);
                var knotColor = getKnotColor(d, cfg);
                var bgColor = d.background ? d.background : cfg.background;
                e.addEventListener("mouseover", function (event) {
                    knotOnOff(radius * 1.2, knotColor, circle);
                    if (cfg.showCenterText) {
                        if (txt)
                            centerTxtOnOff(txt, bgColor);
                        if (tick)
                            tickOnOff(tick, bgColor);
                    }
                    if (cfg.showTooltip) {
                        tooltipOn(d, cfg, tip, event);
                    }
                });
                e.addEventListener("mouseout", function (event) {
                    knotOnOff(radius, bgColor, circle);
                    if (cfg.showCenterText) {
                        if (txt)
                            centerTxtOnOff(txt, knotColor);
                        if (tick)
                            tickOnOff(tick, knotColor);
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