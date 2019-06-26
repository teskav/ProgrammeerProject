/* Name: Teska Vaessen
   Student number: 11046341
   This file includes functions to create the pie chart and the donut chart.
   It also includes the update functions for these charts. */

function processPie(dataset, newYear, country){
    /* This function processes the data in the right format for the pie and
       donut chart. */

    // Se empty list for the variables
    var pieData = [];
    var donutData = [];

    // Loop over the healthspendings and add to the list
    Object.keys(dataset[newYear][country]["healthSpendings"]).forEach(function(d){
        if (d != "TOT"){
            pieData.push({"label": d, "value": dataset[newYear][country]["healthSpendings"][d]});
        };
    });

    // Loop over the governement spendings and add to the list
    Object.keys(dataset[newYear][country]["governmentSpendings"]).forEach(function(d){
        if (d != "TOT"){
            donutData.push({"label": d, "value": dataset[newYear][country]["governmentSpendings"][d]});
        };
    });

    return [pieData, donutData];
};

function pieChart(dataset, newYear, country) {
    /* This function creates the default pie chart. */

    // Process data for the pie charts
    var [pieData, donutData] = processPie(dataset, newYear, country);

    // Define list of the keys
    var keys = {'OOPEXP': "Out-of-Pocket", "COMPULSORY": "Government/Compulsory", 'VOLUNTARY': "Voluntary"};

    // Set width, height and radius
	var w = 400;
	var h = 400;
	var radius = 100;

    // Set the SVG
    var svg = d3v5.select("#piechart")
	              .append("svg")
                  .attr("id", "pie")
		          .attr("width", "50%")
		          .attr("height", "400px")
		          .attr('viewBox','0 0 '+ Math.min(w,h) +' '+ Math.min(w,h) );

    // Set g for the pie chart
    g = svg.append("g").attr("id", "gpie").attr("transform", "translate(" + w / 1.35 + "," + h / 2 + ")");

    // Define color scale
	var colorScale = d3v5.scaleOrdinal()
                	     .domain(Object.keys(keys))
                		 .range(['#66c2a5','#fc8d62','#8da0cb']);

    // Generate the pie
    var pie = d3v5.pie().sort(null).value(function(d){ return d["value"]; });

    // Generate the arcs
 	var arc = d3v5.arc()
 		          .innerRadius(0)
 		          .outerRadius(radius);

    // Based this tooltip code on http://bl.ocks.org/williaster/af5b855651ffe29bdca1
    // from Chris Williams’s Block af5b855651ffe29bdca1

    // Add the tooltip container to the body container
    // it's invisible and its position/contents are defined during mouseover
    var tooltip = d3v5.select("body").append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0);

    // Tooltip mousemove event handler
    var tipMouseover = function(d, i) {
    var html  = "<span> Exact value: " + d.data.value + "<br> (in % of GDP) </span><br/>";
        tooltip.html(html)
               .style("left", (d3v5.event.pageX + 12) + "px")
               .style("top", (d3v5.event.pageY - 18) + "px")
               .transition()
               .duration(200)
               .style("opacity", .9);
    };

    // Tooltip mouseout event handler
    var tipMouseout = function(d) {
        tooltip.transition()
               .duration(300)
               .style("opacity", 0);
    };

    // Generate groups
    var arcs = g.selectAll("path")
                .data(pie(pieData))
                .enter()
                .append("path")
                .on("mousemove", tipMouseover)
                .on("mouseout", tipMouseout)
                .attr("fill", function(d) {
                    return colorScale(d.data.label);
                })
                .attr("d", arc)
                .each(function(d) { this._current = d; });

    // Based all legend code on https://codepen.io/thecraftycoderpdx/pen/jZyzKo

    // Legend dimensions
    var legendRectSize = 20;
    var legendSpacing = 5;

    // Define legend
    var legend = svg.selectAll('.legend')
                    .data(colorScale.domain())
                    .enter()
                    .append('g')
                    .attr('class', 'legend')
                    .attr('transform', function(d, i) {
                        var height = legendRectSize + legendSpacing;
                        var offset =  height * colorScale.domain().length / 2;
                        var horz = 7 * legendRectSize;
                        var vert = i * height - offset;
                          return 'translate(' + (horz) + ',' + (vert + 200) + ')';
                        });

    // Adding colored squares to legend
    legend.append('rect')
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)
          .style('fill', colorScale)
          .style('stroke', colorScale);

    // Adding text to legend
    legend.append('text')
          .attr('x', legendRectSize + legendSpacing - 190)
          .attr('y', legendRectSize - legendSpacing)
          .text(function(d) { return keys[d]; });

};

function donutChart(dataset, newYear, country) {
    /* This function creates the default donut chart. */

    // Process data for the pie charts
    var [pieData, donutData] = processPie(dataset, newYear, country);

    // Define list of the keys
    var keys = {'DEF': 'Defence', 'HEALTH': 'Health', "HOUCOMM": "Housing and community amenities", "PUBORD" : "Public order and safety", "ECOAFF": "Economic affairs", "GRALPUBSER": "General public services", "RECULTREL": "Recreation, culture and religion", "SOCPROT": "Social protection", "ENVPROT": "Environmental protection", "EDU": "Education"};

    // Set width, height and radius
	var w = 400;
	var h = 400;
	var radius = 100;

    // Set the SVG
    var svg = d3v5.select("#piechart")
	              .append("svg")
                  .attr("id", "donut")
		          .attr("width", "50%")
		          .attr("height", "400px")
		          .attr('viewBox','0 0 '+ Math.min(w,h) +' '+ Math.min(w,h) );

    // Set g for the pie chart
    g = svg.append("g").attr("id", "gdonut").attr("transform", "translate(" + w / 4 + "," + h / 2 + ")");

    // Define color scale
	var colorScale = d3v5.scaleOrdinal()
                	     .domain(Object.keys(keys))
                		 .range(['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd']);

    // Generate the pie
    var pie = d3v5.pie().sort(null).value(function(d){ return d["value"]; });

    // Generate the arcs
 	var arc = d3v5.arc()
 		          .innerRadius(radius * 0.6)
 		          .outerRadius(radius);

    // Based this tooltip code on http://bl.ocks.org/williaster/af5b855651ffe29bdca1
    // from Chris Williams’s Block af5b855651ffe29bdca1

    // Add the tooltip container to the body container
    // it's invisible and its position/contents are defined during mouseover
    var tooltip = d3v5.select("body").append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0);

    // Tooltip mousemove event handler
    var tipMouseover = function(d) {
    var html  = "<span> Exact value: " + d.data.value + "<br> (in % of GDP) </span><br/>";
        tooltip.html(html)
               .style("left", (d3v5.event.pageX + 12) + "px")
               .style("top", (d3v5.event.pageY - 18) + "px")
               .transition()
               .duration(200)
               .style("opacity", .9);
    };

    // Tooltip mouseout event handler
    var tipMouseout = function(d) {
        tooltip.transition()
               .duration(300)
               .style("opacity", 0);
    };

    // Generate groups
    var arcs = g.selectAll("arc")
                .data(pie(donutData))
                .enter()
                .append("g")
                .attr("class", "arc")
                .on("mousemove", tipMouseover)
                .on("mouseout", tipMouseout);

    // Draw arc paths
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", function(d) {
            return colorScale(d.data.label); });

    // Based all legend code on https://codepen.io/thecraftycoderpdx/pen/jZyzKo

    // Legend dimensions
    var legendRectSize = 20;
    var legendSpacing = 5;

    // Define legend
    var legend = svg.selectAll('.legend')
                    .data(colorScale.domain())
                    .enter()
                    .append('g')
                    .attr('class', 'legend')
                    .attr('transform', function(d, i) {
                        var height = legendRectSize + legendSpacing;
                        var offset =  height * colorScale.domain().length / 2;
                        var horz = 12 * legendRectSize;
                        var vert = i * height - offset;
                          return 'translate(' + (horz) + ',' + (vert + 200) + ')';
                        });

    // Adding colored squares to legend
    legend.append('rect')
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)
          .style('fill', colorScale)
          .style('stroke', colorScale);

    // Adding text to legend
    legend.append('text')
          .attr('x', legendRectSize + legendSpacing)
          .attr('y', legendRectSize - legendSpacing)
          .text(function(d) { return keys[d]; });

    // Add text to the middle of the donut chart
    addText(dataset, newYear, country);

    // Add titles to the piecharts
    addTitle();

};

function updatePie(dataset, newYear, country) {
    /* This function updates the pie chart with data from a new country or
       a new year. */

    // Process data for the pie charts
    var [pieData, donutData] = processPie(dataset, newYear, country);

    // Define list of the keys
    var keys = {'OOPEXP': "Out-of-Pocket", "COMPULSORY": "Government/Compulsory", 'VOLUNTARY': "Voluntary"};

    // Define color scale
    var colorScale = d3v5.scaleOrdinal()
                         .domain(Object.keys(keys))
                         .range(['#66c2a5','#fc8d62','#8da0cb']);

    // Generate the pie
    var pie = d3v5.pie().sort(null).value(function(d){ return d["value"]; });

    // Set width, height and radius
    var w = 400;
    var h = 400;
    var radius = 100;

    // Generate the arcs
    var arc = d3v5.arc()
                  .innerRadius(0)
                  .outerRadius(radius);

    // Based this tooltip code on http://bl.ocks.org/williaster/af5b855651ffe29bdca1
    // from Chris Williams’s Block af5b855651ffe29bdca1

    // Add the tooltip container to the body container
    // it's invisible and its position/contents are defined during mouseover
    var tooltip = d3v5.select("body").append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0);

    // tooltip mousemove event handler
    var tipMouseover = function(d) {
    var html  = "<span> Exact value: " + d.data.value + "<br> (in % of GDP) </span><br/>";
        tooltip.html(html)
               .style("left", (d3v5.event.pageX + 12) + "px")
               .style("top", (d3v5.event.pageY - 18) + "px")
               .transition()
               .duration(200)
               .style("opacity", .9);
      };

      // Tooltip mouseout event handler
      var tipMouseout = function(d) {
          tooltip.transition()
                 .duration(300)
                 .style("opacity", 0);
      };

    // Select the old SVG
    var svg = d3v5.select("svg#pie").select("g#gpie");

    // Join new data
    const path = svg.selectAll("path")
                    .data(pie(pieData));

    path.exit().remove().transition().duration(750).attrTween("d", arcTweenPie);

    path.enter().append("path")
        .on("mousemove", tipMouseover)
        .on("mouseout", tipMouseout)
        .transition().duration(750)
        .attr("d", arc)
        .attr("fill", (d) => colorScale(d.data.label))
        .each(function(d) { this._current = d; });

    path.transition().duration(750).attrTween("d", arcTweenPie).attr("fill", (d) => colorScale(d.data.label));

};

function updateDonut(dataset, newYear, country) {
    /* This function updates the donut chart with data from a new country or
       a new year. */

    // Process data for the pie charts
    var [pieData, donutData] = processPie(dataset, newYear, country);

    // Define list of the keys
    var keys = {'DEF': 'Defence', 'HEALTH': 'Health', "HOUCOMM": "Housing and community amenities", "PUBORD" : "Public order and safety", "ECOAFF": "Economic affairs", "GRALPUBSER": "General public services", "RECULTREL": "Recreation, culture and religion", "SOCPROT": "Social protection", "ENVPROT": "Environmental protection", "EDU": "Education"};

    // Define color scale
    var colorScale = d3v5.scaleOrdinal()
                         .domain(Object.keys(keys))
                         .range(['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd']);

    // Generate the pie
    var pie = d3v5.pie().sort(null).value(function(d){ return d["value"]; });

    // Set width, height and radius
    var w = 400;
    var h = 400;
    var radius = 100;

    // Generate the arcs
    var arc = d3v5.arc()
                  .innerRadius(radius * 0.6)
                  .outerRadius(radius);

    // Based this tooltip code on http://bl.ocks.org/williaster/af5b855651ffe29bdca1
    // from Chris Williams’s Block af5b855651ffe29bdca1

    // Add the tooltip container to the body container
    // it's invisible and its position/contents are defined during mouseover
    var tooltip = d3v5.select("body").append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0);

    // tooltip mousemove event handler
    var tipMouseover = function(d) {
    var html  = "<span> Exact value: " + d.data.value + "<br> (in % of GDP) </span><br/>";
          tooltip.html(html)
                 .style("left", (d3v5.event.pageX + 12) + "px")
                 .style("top", (d3v5.event.pageY - 18) + "px")
                 .transition()
                 .duration(200)
                 .style("opacity", .9);
    };

    // Tooltip mouseout event handler
    var tipMouseout = function(d) {
          tooltip.transition()
                 .duration(300)
                 .style("opacity", 0);
     };

    // Select the old svg
    var svg = d3v5.select("svg#donut").select("g#gdonut");

    // Join new data
    const path = svg.selectAll("path")
                    .data(pie(donutData));

    path.exit().remove().transition().duration(750).attrTween("d", arcTweenDonut);

    path.enter().append("path")
        .on("mousemove", tipMouseover)
        .on("mouseout", tipMouseout)
        .transition().duration(750)
        .attr("d", arc)
        .attr("fill", (d) => colorScale(d.data.label))
        .each(function(d) { this._current = d; });

    path.transition().duration(750).attrTween("d", arcTweenDonut).attr("fill", (d) => colorScale(d.data.label));

    // Update the text in the middle of the pie chart
    addText(dataset, newYear, country);

};

function arcTweenPie(a) {
    /* This function sets the arcTween for the pie chart. */

    // Generate the arcs
    var arc = d3v5.arc()
                  .innerRadius(0)
                  .outerRadius(100);

    var i = d3v5.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return arc(i(t));
  };
  
};

function arcTweenDonut(a) {
    /* This function sets the arcTween for the donut chart. */

    // Generate the arcs
    var arc = d3v5.arc()
                  .innerRadius(60)
                  .outerRadius(100);

    var i = d3v5.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return arc(i(t));
  };

};

function addText(dataset, year, country) {
    /* This function adds the country name and the year in the middle of the
       donut chart. */

    // Select the right svg
    var svg = d3v5.select("svg#donut");

    // Remove the old text
    svg.selectAll("text.textpie")
       .remove();

    // Add country in the middle of the donut chart
    svg.append("text")
       .attr("class", "textpie")
       .attr("text-anchor", "middle")
       .style('font-size', '1.1em')
       .style("font-weight", "bold")
       .attr("x", 0.09 * (d3v5.select('#piechart').node().getBoundingClientRect().width))
       .attr('y', 200)
       .text(dataset[year][country]['country']);

    // Add year in the middle of the donut chart
    svg.append("text")
       .attr("class", "textpie")
       .attr("text-anchor", "middle")
       .style('font-size', '1.2em')
       .attr("x", 0.09 * (d3v5.select('#piechart').node().getBoundingClientRect().width))
       .attr('y', 220)
       .text(year);

};

function addTitle(){
    /* This function adds titles to the pie and donut chart. */

    // Select the right svg's
    var svgPie = d3v5.select("svg#pie")
    var svgDonut = d3v5.select("svg#donut")

    // Add title to the pie chart
    svgPie.append("text")
          .attr("class", "titlepie")
          .attr("text-anchor", "middle")
          .style('font-size', '1.1em')
          .style('font-weight', 'bold')
          .attr("x", 0.25 * (d3v5.select('#piechart').node().getBoundingClientRect().width))
          .attr('y', 60)
          .text("Distribution of the health spendings");

    // Add title to the donut chart
    svgDonut.append("text")
            .attr("class", "titledonut")
            .attr("text-anchor", "middle")
            .style('font-size', '1.1em')
            .style('font-weight', 'bold')
            .attr("x", 0.1 * (d3v5.select('#piechart').node().getBoundingClientRect().width))
            .attr('y', 60)
            .text("Distribution of the government spendings");

};

function noDonutData(){
    /* This function shows the user there is no data about the government
       spendings of that specific country. */

    // Select the right svg
    var svg = d3v5.select("svg#donut");

    // Show text that there is no data
    svg.append("text")
       .attr("class", "textpie")
       .attr('font-size', '1em')
       .attr("x", 0.04 * (d3v5.select('#piechart').node().getBoundingClientRect().width))
       .attr('y', 275)
       .text("No data available!");

};
