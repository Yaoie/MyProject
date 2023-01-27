if (cfg.addLabels && d.label) {
    console.log(i + ": label = " + JSON.stringify(d.label));

    var txtLabel = d.label.title;
    console.log(i + ": label = " + JSON.stringify(txtLabel));

    if (d.label.title || d.label.body) {
        var label = document.createElementNS(svgNS, "text");
        var radius = getKnotRadius(d, cfg);
        var xLabel = (cfg.horizontalLayout) ? x - radius * 2 : x - radius * 5;
        var yLabel = (cfg.horizontalLayout) ? y + radius * 1.5 : y;
        var maxWidth = radius * 5;

        label.setAttributeNS(null, "x", xLabel);
        label.setAttributeNS(null, "y", yLabel);
        label.setAttributeNS(null, "font-size", "88%");
        // label.setAttributeNS(null, "text-anchor", "middle");

        svg.appendChild(label);

        if (d.label.title) {

            var testText = label.cloneNode(false);
            var titleSplit = d.label.title.split(/\s+/);
            console.log(id + ": title split : " + titleSplit);

            var testTspan = document.createElementNS(svgNS, "tspan");
            testTspan.setAttributeNS(null, "x", xLabel);
            testTspan.setAttributeNS(null, "dy", "1em");
            testTspan.setAttributeNS(null, "text-anchor", "middle");
            testTspan.setAttributeNS(null, "text-decoration", "underline");
            testTspan.setAttributeNS(null, "font-weight", "bold");

            console.log("max width : " + maxWidth);

            testText.appendChild(testTspan);

            while (titleSplit[0]) {

                var space = testTspan.textContent.trim().length > 0 ? " " : "";
                var str2Add = space + titleSplit[0];
                
                testTspan.textContent += str2Add;

                // label.appendChild(testTspan);
                
                var txtNode = document.createTextNode(str2Add);
                testTspan.appendChild(txtNode);
                var testLength = testText.getBBox().width;

                // label.removeChild(testTspan);

                console.log("title: " + testTspan.textContent + ", length : " + testLength);

                if (!titleSplit[1] && testLength <= maxWidth){

                    var tspan = testTspan.cloneNode(false);
                    label.appendChild(tspan);
                    titleSplit.shift();
                    testTspan.textContent = "";
                    
                }else if (!space && testLength > maxWidth){

                    var cut = -1;
                    var trimmedStr;
                    while(testLength > maxWidth){
                        trimmedStr = str2Add.slice(0, cut);
                        testTspan.textContent = trimmedStr;
                        testLength = testTspan.getComputedTextLength();
                        cut--;
                    }
                    var tspan = testTspan.cloneNode(false);
                    label.appendChild(tspan);
                    titleSplit.shift();
                    titleSplit.unshift(str2Add.substring(trimmedStr.length));
                    testTspan.textContent = "";

                }else if (testLength == maxWidth){
                    var tspan = testTspan.cloneNode(false);
                    label.appendChild(tspan);
                    titleSplit.shift();
                    testTspan.textContent = "";
                }
                else if (testLength > maxWidth){
                    testTspan.textContent.slice(0, -(str2Add.length));
                    var tspan = testTspan.cloneNode(false);
                    label.appendChild(tspan);
                    testTspan.textContent = "";
                }
                else if (testLength < maxWidth && titleSplit[1]) {
                    titleSplit.shift();
                }else {
                    console.log("title else left : " + titleSplit);
                }
            }
        }
        if (d.label.body) {
            var bodySplit = d.label.body.split(/\s+/);
            console.log(id + ": body split : " + bodySplit);

            // var body = document.createElementNS(svgNS, "tspan");
            // body.setAttributeNS(null, "x", xLabel);
            // body.setAttributeNS(null, "dy", "1em");
            // body.setAttributeNS(null, "text-anchor", "middle");
            // body.innerHTML = d.label.body;
            // label.appendChild(body);
        }
        svg.appendChild(label);
    }
}