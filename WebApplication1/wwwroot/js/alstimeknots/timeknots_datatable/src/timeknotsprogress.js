var TimeKnotsProgress = (() => {

    var configure = (options) => {
        var cfg = {
            width: 600,
            height: 200,
            radius: 15,
            lineWidth: 4,
            color: "#999",
            colorProgress: "#ff008d",
            colorHighlight: "#af42e4",
            background: "#FFF",
            dateFormat: "%Y/%m/%d %H:%M:%S",
            horizontalLayout: true,
            showLabels: false,
            labelFormat: "%Y/%m/%d %H:%M:%S",
            addNow: false,
            seriesColor: d3.scale.category20(),
            dateDimension: true,
            currentName: "Today",
            showProgress: false
        };
        if (options != undefined) {
            for (var k in options) {
                cfg[k] = options[k];
            }
        }
        return cfg;
    };
    var createTip = (id) => {
        return d3.select(id)
            .append('div')
            .style("opacity", 0)
            .style("position", "absolute")
            .style("font-family", "Helvetica Neue")
            .style("font-weight", "300")
            .style("background", "rgba(0,0,0,0.5)")
            .style("color", "white")
            .style("padding", "5px 10px 5px 10px")
            .style("-moz-border-radius", "8px 8px")
            .style("border-radius", "8px 8px");
    };
    var createSvg = (id, cfg) => {
        return d3.select(id).append('svg').attr("width", cfg.width).attr("height", cfg.height);
    };
    var getEventStatistics = (events, isDate) => {
        var ret;
        if (!isDate) {
            var timestamps = events.map(d => d.value);
            var maxValue = d3.max(timestamps);
            var minValue = d3.min(timestamps);
            ret = { min: minValue, max: maxValue };
        } else {
            var timestamps = events.map(d => Date.parse(d.date));
            var maxValue = d3.max(timestamps);
            var minValue = d3.min(timestamps);
            var startTime = events.find(d => Date.parse(d.date) == minValue).date;
            var endTime = events.find(d => Date.parse(d.date) == maxValue).date;
            ret = { min: minValue, max: maxValue, start: startTime, end: endTime };
        }
        return ret;
    };
    var getMargin = (events, cfg) => {
        return (d3.max(events.map(d => d.radius)) || cfg.radius) * 1.5 + cfg.lineWidth;
    };
    var getStep = (margin, length, maxValue, minValue) => {
        return (length - 2 * margin) / (maxValue - minValue);
    };
    var getEventValue = (d) => {
        return (d.date != undefined) ? new Date(d.date).getTime() : d.value;
    };
    var getKnotRadius = (d, cfg) => {
        var r = (d.radius != undefined) ? d.radius : cfg.radius;
        return ("now" in d && d["now"]) ? (r * 0.75) : r;
    };
    var getKnotColor = (d, cfg) => {
        if (cfg.showProgress) {
            if ("now" in d && d["now"])
                return cfg.colorHighlight;
            if ("passed" in d && d["passed"])
                return cfg.colorProgress;
        }
        if (d.color != undefined) {
          return d.color;
        }
        if (d.series != undefined && cfg.thisSeries != undefined) {
          return cfg.seriesColor(cfg.thisSeries.indexOf(d.series));
        }
        return cfg.color;
    };
    var setCurrentEvent = (events, cfg) => {
        var currentEvent = (cfg.dateDimension) ?
            { name: cfg.currentName, date: cfg.current } :
            { name: cfg.currentName, value: cfg.current };
        events.push(currentEvent);
    };
    var setEvents = (events, cfg, eventValueCurrent) => {
        events.sort((a, b) => getEventValue(a) - getEventValue(b));
        var num = 0;
        events.forEach((d) => {

            if (d.series != undefined) {
              if (num == 0)
                cfg["thisSeries"] = [];

              if (cfg.thisSeries.indexOf(d.series) < 0)
                  cfg.thisSeries.push(d.series);
            }

            if (eventValueCurrent != null) {
                var eventValue = getEventValue(d);
                d["now"] = (eventValue == eventValueCurrent) ? true : false;
                d["passed"] = (eventValue <= eventValueCurrent);
            }
            d["num"] = ++num;
        });
        console.log("set event : events after = " + JSON.stringify(events));
    };
    var drawTimeline = (svg, events, cfg, margin, step, minValue) => {
        var linePrevious = { x1: null, x2: null, y1: null, y2: null };
        svg.selectAll("line")
            .data(events)
            .enter()
            .append("line")
            .attr("class", "timeline-line")
            .attr("x1", (d) => {
                var ret;
                if (cfg.horizontalLayout) {
                    var datum = getEventValue(d);
                    ret = Math.floor(step * (datum - minValue) + margin);
                } else {
                    ret = Math.floor(cfg.width / 2);
                }
                linePrevious.x1 = ret;
                return ret;
            })
            .attr("x2", (d) => {
                if (linePrevious.x1 != null) {
                    return linePrevious.x1;
                }
                if (cfg.horizontalLayout) {
                    var datum = getEventValue(d);
                    return Math.floor(step * (datum - minValue));
                }
                return Math.floor(cfg.width / 2);
            })
            .attr("y1", (d) => {
                var ret;
                if (cfg.horizontalLayout) {
                    ret = Math.floor(cfg.height / 2);
                } else {
                    var datum = getEventValue(d);
                    ret = Math.floor(step * (datum - minValue)) + margin;
                }
                linePrevious.y1 = ret;
                return ret;
            })
            .attr("y2", (d) => {
                if (linePrevious.y1 != null) {
                    return linePrevious.y1;
                }
                if (cfg.horizontalLayout) {
                    return Math.floor(cfg.height / 2);
                }
                var datum = getEventValue(d);
                return Math.floor(step * (datum - minValue));
            })
            .style("stroke", (d) => {
                if (d.color != undefined) {
                    return d.color;
                }
                if (d.series != undefined && cfg.thisSeries != undefined) {
                    return cfg.seriesColor(cfg.thisSeries.indexOf(d.series));
                }
                return cfg.color;
            })
            .style("stroke-width", cfg.lineWidth);
    };
    var getProgressLine = (eventValueCurrent, cfg, margin, step, minValue) => {
        var progressLine = { x1: null, x2: null, y1: null, y2: null };
        if (cfg.horizontalLayout) {
            progressLine.x1 = margin;
            progressLine.y1 = Math.floor(cfg.height / 2);
            progressLine.x2 = Math.floor(step * (eventValueCurrent - minValue) + margin);
            progressLine.y2 = Math.floor(cfg.height / 2);
        } else {
            progressLine.x1 = Math.floor(cfg.width / 2);
            progressLine.y1 = margin;
            progressLine.x2 = Math.floor(cfg.width / 2);
            progressLine.y2 = Math.floor(step * (eventValueCurrent - minValue) + margin);
        }
        return progressLine;
    };
    var drawProgressLine = (svg, progressLine, cfg) => {
        svg.append("line")
            .attr("x1", progressLine.x1)
            .attr("y1", progressLine.y1)
            .attr("x2", progressLine.x2)
            .attr("y2", progressLine.y2)
            .style("stroke", cfg.colorProgress)
            .style("stroke-width", cfg.lineWidth);
    };
    var labelOn = (d, cfg, tip) => {
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
            dateValue = (datetime != "") ? (d.name + " <small>(" + datetime + ")</small>") : d.name;
        } else {
            dateValue = d.name + ((d.value != undefined) ? " <small>(" + d.value + ")</small>" : "");
        }

        tip.append("div")
            .style("float", "left")
            .html(dateValue);

        tip.transition()
            .duration(100)
            .style("opacity", .9);
    };

    var labelOff = (tip) => {
        tip.transition()
            .duration(100)
            .style("opacity", 0);
    };

    var knotOn = (d, cfg, tip, element) => {
        d3.select(element)
            .select("circle")
            .style("fill", getKnotColor(d, cfg))
            .transition()
            .duration(100)
            .attr("r", Math.floor(getKnotRadius(d, cfg) * 1.5));

        d3.select(element)
            .select("text")
            .style("stroke", d => (d.background != undefined) ? d.background : cfg.background);

        labelOn(d, cfg, tip);
    };
    var knotOff = (d, cfg, tip, element) => {

        d3.select(element)
            .select("circle")
            .style("fill", cfg.background)
            .transition()
            .duration(100)
            .attr("r", getKnotRadius(d, cfg));

        d3.select(element)
            .select("text")
            .style("stroke", d => getKnotColor(d, cfg));

        labelOff(tip);
    };
    var drawTimeKnot = (svg, events, cfg, margin, step, minValue) => {
        var knots = svg.selectAll("g")
            .data(events)
            .enter()
            .append("g");

        knots.append("circle")
            .attr("class", "timeline-event")
            .attr("r", d => getKnotRadius(d, cfg))
            .style("stroke", (d) => {
                return getKnotColor(d, cfg)
            })
            .style("stroke-width", d => (d.lineWidth != undefined) ? d.lineWidth : cfg.lineWidth)
            .style("fill", d => (d.background != undefined) ? d.background : cfg.background)
            .attr("cy", (d) => {
                if (cfg.horizontalLayout) {
                    return Math.floor(cfg.height / 2);
                }
                var datum = getEventValue(d);
                return Math.floor(step * (datum - minValue) + margin);
            })
            .attr("cx", (d) => {
                if (cfg.horizontalLayout) {
                    var datum = getEventValue(d);
                    var x = Math.floor(step * (datum - minValue) + margin);
                    return x;
                }
                return Math.floor(cfg.width / 2);
            });

        knots.append("text")
            .text((d) => ("num" in d) ? d.num : "")
            .attr({
                "x": (d) => {
                    var ret;
                    if (cfg.horizontalLayout) {
                        var datum = getEventValue(d);
                        ret = Math.floor(step * (datum - minValue) + margin);
                    } else {
                        ret = Math.floor(cfg.width / 2);
                    }
                    return ret;
                },
                "y": (d) => {
                    var ret;
                    if (cfg.horizontalLayout) {
                        ret = Math.floor(cfg.height / 2);
                    } else {
                        var datum = getEventValue(d);
                        ret = Math.floor(step * (datum - minValue)) + margin;
                    }
                    return ret;
                },
                "text-anchor": "middle",
                "font-size": function (d) {
                    var r = getKnotRadius(d, cfg);
                    return r / ((r * 6) / 100);
                },
                "dy": function (d) {
                    return "0.3em";
                }
            })
            .style("stroke", (d) => getKnotColor(d, cfg))
            .style("stroke-width", "2px")
            .style("cursor", "default");

        return knots;
    };
    var drawLabels = (svg, cfg, stat, margin) => {
        if (cfg.dateDimension) {
            var format = d3.time.format(cfg.labelFormat);
            var startString = format(new Date(stat.min));
            var endString = format(new Date(stat.max));
        } else {
            var startString = stat.min;
            var endString = stat.max;
        }
        svg.append("text")
            .text(startString)
            .style("font-size", "70%")
            .attr("x", function (d) {
                return cfg.horizontalLayout ?
                    d3.max([0, (margin - this.getBBox().width / 2)]) :
                    Math.floor(this.getBBox().width / 2);
            })
            .attr("y", function (d) {
                return cfg.horizontalLayout ?
                    Math.floor(cfg.height / 2 + (margin + this.getBBox().height)) :
                    margin + this.getBBox().height / 2
            });
        svg.append("text")
            .text(endString)
            .style("font-size", "70%")
            .attr("x", function (d) {
                return cfg.horizontalLayout ?
                    cfg.width - d3.max([this.getBBox().width, (margin + this.getBBox().width / 2)]) :
                    Math.floor(this.getBBox().width / 2);
            })
            .attr("y", function (d) {
                return cfg.horizontalLayout ?
                    Math.floor(cfg.height / 2 + (margin + this.getBBox().height)) :
                    cfg.height - margin + this.getBBox().height / 2;
            });
    };
    var onMouseEvent = (svg, tip, knots, cfg, margin) => {
 
        var knotClicked = null;
        var dClicked = null;
        var mouseOnKnot = false;

        knots.on("mouseover", function (d) {
            mouseOnKnot = true;
            if (knotClicked == null) {
                knotOn(d, cfg, tip, this);
            } else {
                labelOn(d, cfg, tip);
            }
            // console.log("m over d name: " + d.name);
        });

        knots.on("mouseout", function (d) {
            mouseOnKnot = false;
            if (knotClicked == null || knotClicked !== this)
                knotOff(d, cfg, tip, this);
            // console.log("m out d name: " + d.name);
        });

        knots.on("click", function (d) {
            var active = (this === knotClicked);
            if (!active) {
                if (knotClicked != null){
                    knotOff(dClicked, cfg, tip, knotClicked);
                }
                knotOn(d, cfg, tip, this);
                knotClicked = this;
                dClicked = d;

            } else {
                knotOff(d, cfg, tip, this);
                knotClicked = null;
                dClicked = null;
            }
            // console.log("on click d name: " + d.name);
        });

        svg.on("click", function (){
            if (!mouseOnKnot && knotClicked != null){
                knotOff(dClicked, cfg, tip, knotClicked);
                knotClicked = null;
                dClicked = null;
            }
        });

        svg.on("mousemove", () => {
            var tipPixels = parseInt(tip.style("height").replace("px", ""));
            return tip.style("top", (d3.event.pageY - tipPixels - margin) + "px")
                .style("left", (d3.event.pageX + 20) + "px");
        })
            .on("mouseout", () => tip.style("opacity", 0).style("top", "0px").style("left", "0px"));
    };
    var timeKnotsProgress = {
        draw: function (id, events, options) {

            var cfg = configure(options);
            var isDate = cfg.dateDimension;
            var tip = createTip(id);
            var svg = createSvg(id, cfg);
            var eventValueCurrent = null;

            if (isDate && cfg.addNow) {
                cfg["showProgress"] = true;
                eventValueCurrent = new Date().getTime();
                events.push({ date: eventValueCurrent, name: cfg.addNowLabel || "Today" });
            } else if ("current" in cfg) {
                cfg["showProgress"] = true;
                eventValueCurrent = (isDate) ? new Date(cfg.current).getTime() : cfg.current;
                setCurrentEvent(events, cfg);
            }

            setEvents(events, cfg, eventValueCurrent);

            var stat = getEventStatistics(events, isDate);
            var length = (cfg.horizontalLayout) ? cfg.width : cfg.height;
            var noTimeLine = stat.max == stat.min;
            var margin = noTimeLine ? length / 2 : getMargin(events, cfg);
            var step = noTimeLine ? 0 : getStep(margin, length, stat.max, stat.min);

            drawTimeline(svg, events, cfg, margin, step, stat.min);

            if (eventValueCurrent != null) {
                var progressLine = getProgressLine(eventValueCurrent, cfg, margin, step, stat.min);
                drawProgressLine(svg, progressLine, cfg);
            }
            var knots = drawTimeKnot(svg, events, cfg, margin, step, stat.min);
            if (cfg.showLabels) {
                drawLabels(svg, cfg, stat, margin);
            }
            onMouseEvent(svg, tip, knots, cfg, margin);
        }
    }
    return timeKnotsProgress;
})();