var drawCurrentMark = (d, cfg, currentX, currentY, svg, svgNS) => {

    var xAdjust = 32;
    var yAdjust = cfg.radius * 2.5;
    // var currentRadius = getKnotRadius(d, cfg);

    var currentSvg;
    if (cfg.horizontalLayout) {

        if (cfg.svgTemplateId) {
            var svgTemplate = document.querySelector(`${cfg.svgTemplateId}`);
            currentSvg = svgTemplate.cloneNode(true);
            currentSvg.setAttributeNS(null, "x", currentX + xAdjust);
            currentSvg.setAttributeNS(null, "y", currentY - yAdjust);
            currentSvg.setAttributeNS(null, "style", "fill:" + d.status.color);
        }
        else if (cfg.svgTemplateHref) {
            var use = document.createElementNS(svgNS, "use");
            use.setAttributeNS(null, "href", cfg.svgTemplateHref);
            use.setAttributeNS(null, "x", currentX + xAdjust);
            use.setAttributeNS(null, "y", currentY - yAdjust);
            use.setAttributeNS(null, "style", "fill:" + d.status.color);
            svg.appendChild(use);
        }
        else { // default
            currentSvg = drawSvgByPath(SVG_PATH_ARROW_DOWN, 
                currentX  + xAdjust, currentY - yAdjust, d.status.color, svgNS);
        }
        if (currentSvg)
            svg.append(currentSvg);
        // knotClone.setAttributeNS(null, "cy", knotClone.cy.baseVal.value - currentAdjust);
    } else {
        // knotClone.setAttributeNS(null, "cx", knotClone.cx.baseVal.value + currentAdjust);
    }
};