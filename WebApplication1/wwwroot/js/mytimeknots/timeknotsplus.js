var TimeKnotsPlus = (() => {
    var SVG_NS = "http://www.w3.org/2000/svg";
    var SVG_PATH_ARROW_DOWN = "M32,16.016l-5.672-5.664c0,0-3.18,3.18-6.312,6.312V0h-8.023v16.664l-6.32-6.32L0,16.016L16,32L32,16.016z";
    var SVG_PATH_TICK = "M 22.566406 4.730469 L 20.773438 3.511719 C 20.277344 3.175781 19.597656 3.304688 19.265625 3.796875 L 10.476563 16.757813 L 6.4375 12.71875 C 6.015625 12.296875 5.328125 12.296875 4.90625 12.71875 L 3.371094 14.253906 C 2.949219 14.675781 2.949219 15.363281 3.371094 15.789063 L 9.582031 22 C 9.929688 22.347656 10.476563 22.613281 10.96875 22.613281 C 11.460938 22.613281 11.957031 22.304688 12.277344 21.839844 L 22.855469 6.234375 C 23.191406 5.742188 23.0625 5.066406 22.566406 4.730469 Z";
    var CLASS_KNOT = "knot";
    var CLASS_KNOT_CTR = "knot-ctr";
    var configure = (options, events) => {
        var cfgBarMode = {
            colorPassedBar: "#cc0071",
            currentStrokeWidth: 5
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
            radiusCurrent: 8,
            colorPassed: "#ff008d"
        };

        var cfg = {
            width: 600,
            height: 200,
            radius: 15,
            lineWidth: 10,
            color: "#999",
            background: "#FFF",
            dateFormat: "%Y-%m-%d",
            labelFormat: "%Y-%m-%d",
            horizontalLayout: true,
            showLabels: false,
            dateDimension: true,
            showTooltip: false,
            currentProgressMode: true,
            barMode: true,
        };
        if (options != undefined) {
            for (var i in options) {
                cfg[i] = options[i];
            }
        }
        // console.log(`current progress b4 = ${cfg.currentProgressMode}`);

        if (events.filter(d => d.date == undefined || d.done == undefined).length > 0) {
            cfg.currentProgressMode = false;
        }
        // console.log(`current progress af = ${cfg.currentProgressMode}`);

        if (cfg.currentProgressMode) {
            if (cfg.cfgProgress != undefined) {
                for (var i in cfg.cfgProgress) {
                    cfgProgress[i] = cfg.cfgProgress[i];
                }
            }
            cfg.cfgProgress = cfgProgress;
            cfg.cfgProgress.status = configureStatus(cfg.cfgProgress.status);
        }
        if (cfg.barMode) {
            if (cfg.cfgBarMode != undefined) {
                for (var i in cfg.cfgBarMode) {
                    cfgBarMode[i] = cfg.cfgBarMode[i];
                }
            }
            cfg.cfgBarMode = cfgBarMode;
        } else {
            if (cfg.cfgNonBarMode != undefined) {
                for (var i in cfg.cfgNonBarMode) {
                    cfgNonBarMode[i] = cfg.cfgNonBarMode[i];
                }
            }
            cfg.cfgNonBarMode = cfgNonBarMode;
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
        if (!d.done && (eventValueCurrent > getEventValue(d))) {
            return true;
        }
        if (d.done && d.actual && (convert2Value(d.actual) > getEventValue(d))) {
            return true;
        }
        return false;
    };
    var getKnotColor = (d, cfg) => {
        if (d.passed) {
            return cfg.barMode ? cfg.cfgBarMode.colorPassedBar : cfg.cfgProgress.colorPassed;
        }
        if (d.status) {
            return d.status.color;
        }
        if (d.color) {
            return d.color;
        }
        return cfg.color;
    };

    var configureKnotAttr = (events, cfg) => {
        return events.map((d) => {
            var knotColor = getKnotColor(d, cfg);
            var bgColor = (d.background || cfg.background);
            var isCurrent = cfg.currentProgressMode && d.status
                && d.status == cfg.cfgProgress.status.CURRENT;
            d.color = knotColor;
            d.onColor = (cfg.barMode && !isCurrent) ? bgColor : knotColor;
            d.offColor = (cfg.barMode && !isCurrent) ? knotColor : bgColor;
            d.radius = (cfg.barMode && !isCurrent) ? (cfg.lineWidth / 2) :
                ((isCurrent) ? cfg.cfgProgress.radiusCurrent : (d.radius || cfg.radius));
            return d;
        });
    }

    var setEventStatus = (d, status, eventValueCurrent) => {
        var isDone = d.done;
        var isOverdue = getOverdue(d, eventValueCurrent);

        if (isDone && isOverdue) {
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

    var getEventProgress = (events, cfg) => {
        var currentDatetime = null;
        var format = d3.time.format(cfg.dateFormat);
        var currentDatetime = format(new Date());
        events.push({
            name: cfg.cfgProgress.status.CURRENT.label,
            date: currentDatetime, status: cfg.cfgProgress.status.CURRENT
        });

        events = getSortedEvents(events);
        var eventValueCurrent = convert2Value(currentDatetime);

        var currentIdx = -1;

        for (var i = 0; i < events.length; i++) {
            var d = events[i];
            if (d.status && d.status == cfg.cfgProgress.status.CURRENT) {
                currentIdx = i;
                continue;
            }
            d = setEventStatus(d, cfg.cfgProgress.status, eventValueCurrent);
            if (getEventValue(d) < eventValueCurrent) {
                d.passed = true
                d.color = cfg.cfgProgress.colorPassed;
            }
        }
        events[currentIdx].radius = cfg.cfgProgress.radiusCurrent;

        var lastEventDay = new Date(events[events.length - 1].date);
        var now = new Date();
        var diff = lastEventDay - now;
        var dayLeft = (diff > 0) ? Math.ceil(Math.abs(diff) / (1000 * 60 * 60 * 24)) : 0;

        var firstEventDay = new Date(events[0].date);
        var percentPassed = 0;
        if (now >= lastEventDay) {
            percentPassed = 1;
        } else if (now > firstEventDay && now < lastEventDay) {
            percentPassed = (now - firstEventDay) / (lastEventDay - firstEventDay);
        }
        return {
            events: events,
            progress: {
                currentEventIdx: currentIdx, dayLeft: dayLeft, percentPassed: percentPassed
            }
        };
    };

    var getSortedEvents = (events) => {
        return events.sort((a, b) => getEventValue(a) - getEventValue(b));
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

    var drawCurrentArrow = (cfg, x, y, color) => {
        var scale = (cfg.radius / 25);
        var xAdjust = -16 * scale;
        var yAdjust = -cfg.radius * 2.5;

        var ret = drawSvgByPath(SVG_PATH_ARROW_DOWN, x + xAdjust, y + yAdjust, color, scale);
        return ret;
    };

    var drawCenterTxt = (cfg, radius, x, y, color, centerTxt) => {
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
    var drawKnot = (d, cfg, knot, svg, num, xAdjust) => {

        var color = d.color;
        var radius = d.radius;
        var x = knot.cx.baseVal.value + xAdjust;
        var y = knot.cy.baseVal.value;

        var g = document.createElementNS(SVG_NS, "g");
        g.classList.add("knot");
        g.value = d;
        svg.removeChild(knot);
        svg.appendChild(g);

        var knotClone = knot.cloneNode(false);
        knotClone.setAttributeNS(null, "cx", x);

        g.appendChild(knotClone);

        if (cfg.barMode) {

            knotClone.style.stroke = "none";
            knotClone.style.fill = color;
            knotClone.setAttributeNS(null, "r", radius);

        } else if (!d.passed)
            knotClone.style.stroke = color;

        if (!cfg.barMode) {

            if (cfg.cfgNonBarMode.showCenterText) {
                if (d.passed) {
                    var scale = 1.5 * (radius / 25);
                    var xAdjust = -13 * scale;
                    var yAdjust = -13 * scale;
                    var tick = drawSvgByPath(SVG_PATH_TICK, x + xAdjust, y + yAdjust, color, scale);
                    tick.classList.add(CLASS_KNOT_CTR);
                    tick.classList.add("tick");

                    g.appendChild(tick);
                } else {
                    var centerTxt = (d.centerTxt) ? d.centerTxt : num;
                    var centerTxt = drawCenterTxt(cfg, radius, x, y, color, centerTxt);
                    centerTxt.classList.add(CLASS_KNOT_CTR);
                    g.appendChild(centerTxt);
                }
            }
            if (cfg.cfgNonBarMode.addLabels && d.label && (d.label.title || d.label.body)) {
                drawLabels(d, cfg, radius, x, y, svg);
            }
        }
    };
    var drawExclamationMark = (cfg, x, y, color) => {
        // <g>
        //     <polygon points="119.151,0 129.6,218.406 172.06,218.406 182.54,0" />
        //     <rect x="130.563" y="261.168" width="40.525" height="40.523" />
        // </g>
        var diameter = cfg.cfgProgress.radiusCurrent * 2;
        var margin = (diameter / 7);
        var length = diameter - margin * 2;
        var markWidth = (length / 5);
        var markHeight = (length);

        var x1 = x - (markWidth / 2);
        var x2 = x + (markWidth / 2);
        var y1 = y - (markHeight / 2);
        var y2 = y + (markHeight / 5 * 3) - (markHeight / 2);
        var y3 = y2 + (markHeight / 5);
        var y4 = y + (markHeight / 2);

        var ret = document.createElementNS(SVG_NS, "g");

        // var polygon = document.createElementNS(SVG_NS, "polygon");
        // polygon.setAttributeNS(null, "points", `${x1},${y1} ${x2},${y1} ${x1},${y2} ${x2},${y2}`);
        // polygon.style.fill = color;
        // polygon.style.stroke = "none";

        var line = document.createElementNS(SVG_NS, "rect");
        line.setAttributeNS(null, "x", x1);
        line.setAttributeNS(null, "y", y1);
        line.setAttributeNS(null, "width", markWidth);
        line.setAttributeNS(null, "height", markHeight * 3 / 5);
        line.style.fill = color;

        var dot = document.createElementNS(SVG_NS, "rect");
        dot.setAttributeNS(null, "x", x1);
        dot.setAttributeNS(null, "y", y3);
        dot.setAttributeNS(null, "width", markWidth);
        dot.setAttributeNS(null, "height", markWidth);
        dot.style.fill = color;

        // ret.appendChild(polygon);
        ret.appendChild(line);
        ret.appendChild(dot);
        return ret;
    }

    var polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    var dArc = (x, y, radius, startAngle, endAngle) => {

        var start = polarToCartesian(x, y, radius, endAngle);
        var end = polarToCartesian(x, y, radius, startAngle);

        var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");

        return d;
    };

    var drawLeftPanel = (leftPanel, width, height, cfg, dayLeft, percentPassed) => {

        leftPanel.setAttributeNS(null, "width", width);
        leftPanel.setAttributeNS(null, "height", height);

        var bottomTxt = document.createElementNS(SVG_NS, "text");
        bottomTxt.setAttributeNS(null, "dy", "1em");
        bottomTxt.setAttributeNS(null, "font-size", "88%");
        bottomTxt.setAttributeNS(null, "text-anchor", "middle");
        bottomTxt.textContent = "Days left";

        leftPanel.appendChild(bottomTxt);

        var margin = width / 10;
        var radius = (width - margin * 4) / 2;
        var x = width / 2;
        var y = margin * 2 + (((height - margin * 4) - bottomTxt.getBBox().height) / 2);

        var fontSize = cfg.centerFontSize ? cfg.centerFontSize : (radius * 16.7 / 15) / 2;

        var ctrTxt = document.createElementNS(SVG_NS, "text");
        ctrTxt.setAttributeNS(null, "font-size", fontSize);
        ctrTxt.setAttributeNS(null, "text-anchor", "middle");
        ctrTxt.textContent = dayLeft;

        leftPanel.appendChild(ctrTxt);

        var xCtrTxt = (cfg.horizontalLayout) ? x : x;
        var yCtrTxt = (cfg.horizontalLayout) ? y + (ctrTxt.getBBox().height / 4) : y;

        ctrTxt.setAttributeNS(null, "x", xCtrTxt);
        ctrTxt.setAttributeNS(null, "y", yCtrTxt);

        var xBottomTxt = (cfg.horizontalLayout) ? x : x;
        var yBottomTxt = (cfg.horizontalLayout) ? y + (radius * 1.1) : y;

        bottomTxt.setAttributeNS(null, "x", xBottomTxt);
        bottomTxt.setAttributeNS(null, "y", yBottomTxt);

        console.log(`ctr txt = ${ctrTxt.getBBox().width} * ${ctrTxt.getBBox().height}`);
        console.log(`bottom txt = ${bottomTxt.getBBox().width} * ${bottomTxt.getBBox().height}`);

        var baseCircle = document.createElementNS(SVG_NS, "circle");
        baseCircle.setAttributeNS(null, "r", radius);
        baseCircle.setAttributeNS(null, "cx", x);
        baseCircle.setAttributeNS(null, "cy", y);
        baseCircle.style.fill = "none";
        baseCircle.style.stroke = "#eeeeee";
        baseCircle.style.strokeWidth = cfg.lineWidth;
        leftPanel.appendChild(baseCircle);

        var progressAngle = percentPassed * 360;

        var frontArc = document.createElementNS(SVG_NS, "path");
        frontArc.setAttributeNS(null, "d", dArc(x, y, radius, 0, progressAngle));
        frontArc.style.fill = "none";
        frontArc.style.stroke = cfg.cfgNonBarMode.colorProgressCircularBar;
        frontArc.style.strokeWidth = cfg.lineWidth;

        leftPanel.appendChild(frontArc);
    };

    var drawCurrentEvent = (d, cfg, knot, svg, xAdjust) => {

        svg.removeChild(knot);

        var x = knot.cx.baseVal.value + xAdjust;
        var y = knot.cy.baseVal.value;

        if (!cfg.barMode && cfg.cfgNonBarMode.showCurrentArrow) {

            var svgArrow = drawCurrentArrow(cfg, x, y, d.color);
            svgArrow.value = d;
            svg.append(svgArrow);

        } else {

            var g = document.createElementNS(SVG_NS, "g");
            g.classList.add(CLASS_KNOT);
            g.value = d;
            svg.appendChild(g);

            var knotClone = knot.cloneNode(false);
            knotClone.style.stroke = d.color;
            knotClone.setAttributeNS(null, "cx", x);

            if (cfg.barMode) {
                knotClone.style.strokeWidth = cfg.cfgBarMode.currentStrokeWidth;
            }

            g.appendChild(knotClone);

            if (!cfg.barMode && cfg.cfgNonBarMode.highlightCurrent) {
                var exclamationMark = drawExclamationMark(cfg, x, y, d.color);
                exclamationMark.classList.add(CLASS_KNOT_CTR);
                g.appendChild(exclamationMark);
            }
        }
    };

    var drawSVG = (id, events, cfg, progress) => {

        var svg = document.querySelector(`${id} > svg`);

        var maxRadius = Math.max(...events.map(d => d.radius || cfg.radius));
        var svgMargin = maxRadius * 1.5 / 2 + cfg.lineWidth;

        var hasLeftPanel = cfg.currentProgressMode && !cfg.barMode
            && cfg.cfgNonBarMode.showCircularProgressBar;

        var leftPanelWidth = hasLeftPanel ?
            ((cfg.leftPanelWidth) ? cfg.leftPanelWidth : (maxRadius * 5 + svgMargin * 2)) : 0;

        var totalMargin = (hasLeftPanel) ? svgMargin * 4 : svgMargin * 2;
        var totalWidth = svg.clientWidth + leftPanelWidth + totalMargin;

        var widthLeft = totalWidth - leftPanelWidth - cfg.width;
        var xAdjust = (widthLeft > 0) ? widthLeft / 2 : 0;

        if (widthLeft > 0)
            svg.setAttributeNS(null, "width", svg.width.baseVal.value + widthLeft);

        if (hasLeftPanel && progress) {

            var containerSvg = document.createElementNS(SVG_NS, "svg");
            containerSvg.setAttributeNS(null, "width", totalWidth);
            containerSvg.setAttributeNS(null, "height", svg.getAttribute("height"));

            svg.parentElement.appendChild(containerSvg);
            containerSvg.appendChild(svg);

            var dayLeft = progress.dayLeft;
            var percentPassed = progress.percentPassed;
            var leftPanel = document.createElementNS(SVG_NS, "svg");

            svg.setAttributeNS(null, "x", leftPanelWidth);
            containerSvg.insertBefore(leftPanel, svg);

            drawLeftPanel(leftPanel, leftPanelWidth, svg.getAttribute("height"), cfg, dayLeft, percentPassed);
        }

        var lines = svg.querySelectorAll("line");
        lines.forEach((e, i) => {
            e.setAttributeNS(null, "x1", e.x1.baseVal.value + xAdjust);
            e.setAttributeNS(null, "x2", e.x2.baseVal.value + xAdjust);
        });

        var knots = svg.querySelectorAll("circle");

        // knots.forEach((e, i) => {
        //     console.log(`knots ${i} : ${JSON.stringify(e)}`);
        // });

        var currentEventIdx = progress ? progress.currentEventIdx : -1;

        if (currentEventIdx > -1) {
            drawCurrentEvent(events[currentEventIdx], cfg, knots[currentEventIdx], svg, xAdjust);
        }

        var knotNum = 1;
        for (var i = 0; i < knots.length; i++) {

            if (currentEventIdx > -1 && i == currentEventIdx) {
                continue;
            }
            var knot = knots[i];
            var d = events[i];

            drawKnot(d, cfg, knot, svg, knotNum, xAdjust);
            knotNum++;
        }
    };
    var knotOnOff = (radius, color, circle) => {
        circle.style.fill = color;
        circle.setAttributeNS(null, "r", radius);
    };
    
    var elementsOnClick = (elements) => {
        elements.forEach((e, i) => {
            var d = e.value;
            // console.log(`knot ${i} on click : ${JSON.stringify(d)}`);
            var fn = (d && d.callback && d.callback.fn && typeof d.callback.fn === 'function') ? d.callback.fn : null;
            if (fn) {
                var args = (d.callback.args && Array.isArray(d.callback.args)
                    && d.callback.args.length > 0) ? d.callback.args : [];
                e.addEventListener("click", function () {
                    fn(...args);
                });
            }
        });
    };
    var tooltipOn = (d, cfg, tip, event, x, y) => {
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

        tip.append("span")
            .style("float", "left")
            .style("top", event.pageY )
            .style("left", event.pageX)
            .html(dateValue);

        console.log(`circle x = ${x}, y = ${y}`);
        console.log(`event x = ${event.pageX}, y = ${event.pageY}`);

        tip.transition()
            .duration(100)
            .style("opacity", .9);
    };

    var tooltipOff = (tip) => {
        tip.transition()
            .duration(100)
            .style("opacity", 0);
    };

    var knotCenterOnOff = (e, color) => {
        debugger
        var knotCtr = e.querySelector(`.${CLASS_KNOT_CTR}`);
        if (knotCtr.classList.contains("tick")){
            knotCtr.querySelector("g").style.fill = color;
        } else{
            knotCtr.style.stroke = color;
        }
    }

    var elementsOnMouseEvent = (elements, cfg, tip) => {
        elements.forEach((e, i) => {
            var d = e.value;
            var circle = e.querySelector("circle");
            var showCenterText = !cfg.barMode && cfg.cfgNonBarMode.showCenterText;

            e.addEventListener("mouseover", function (event) {

                knotOnOff(d.radius * 1.2, d.onColor, circle);
                if (showCenterText) {
                    knotCenterOnOff(e, d.offColor);
                }
                if (cfg.showTooltip) {
                    var x = circle.cx.baseVal.value;
                    var y = circle.cy.baseVal.value;
                    tooltipOn(d, cfg, tip, event, x, y);
                }
            });
            e.addEventListener("mouseout", function (event) {

                knotOnOff(d.radius, d.offColor, circle);
                if (showCenterText) {
                    knotCenterOnOff(e, d.onColor);
                }
                if (cfg.showTooltip) {
                    tooltipOff(tip);
                }
            });
        });
    }

    var timeKnotsPlus = {
        draw: (id, events, cfg) => {
            var cfg = configure(cfg, events);

            console.log(`cfg = ${JSON.stringify(cfg)}`);

            var eventProgress = null;

            if (cfg.currentProgressMode) {
                var eventsObj = getEventProgress(events, cfg);
                events = eventsObj.events;
                eventProgress = eventsObj.progress;

                // console.log(`event obj = ${JSON.stringify(eventsObj)}`);
            } else {
                events = getSortedEvents(events);
            }

            // events.forEach((e, i) => {
            //     console.log(`event ${i} : ${JSON.stringify(e)}`);
            // });

            TimeKnots.draw(id, events, cfg);

            events = configureKnotAttr(events, cfg);

            // console.log(`events af color conf : ${JSON.stringify(events)}`);

            drawSVG(id, events, cfg, eventProgress);

            var hasSvgContainer = document.querySelector(`${id} > svg > svg > g.${CLASS_KNOT}`) != null;
            var knotsQueryStr = hasSvgContainer ? `${id} > svg > svg > g.${CLASS_KNOT}` : `${id} > svg > g.${CLASS_KNOT}`;

            var knots = document.querySelectorAll(knotsQueryStr);

            elementsOnClick(knots);

            var tip = (cfg.showTooltip) ? d3.select(id).select("div") : null;
            tip.attr("id", `tooltip-${id.substring(1)}`);

            elementsOnMouseEvent(knots, cfg, tip);
        }
    };
    return timeKnotsPlus;
})();
