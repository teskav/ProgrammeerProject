/* Name: Teska Vaessen
   Student number: 11046341
   This file............ */

function processPie(dataset, newYear, country){

    // var dataset_new = dataset[newYear][country];
    // var dataset_pie = $.extend( {}, dataset[newYear][country] );
    // console.log(dataset_pie);
    var pieData = [];
    var donutData = [];

    Object.keys(dataset[newYear][country]["healthSpendings"]).forEach(function(d){
        if (d != "TOT"){
            pieData.push({"label": d, "value": dataset[newYear][country]["healthSpendings"][d]});
        }
    });

    Object.keys(dataset[newYear][country]["governmentSpendings"]).forEach(function(d){
        if (d != "TOT"){
            donutData.push({"label": d, "value": dataset[newYear][country]["governmentSpendings"][d]});
        };
    });
    // console.log(dataset)
    return [pieData, donutData];
};

function pieChart(dataset, newYear, country) {

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

    // tooltip mousemove event handler
    var tipMouseover = function(d, i) {
    var html  = "<span> Exact value: " + d.data.value + "<br> (in % of GDP) </span><br/>";
        tooltip.html(html)
               .style("left", (d3v5.event.pageX + 12) + "px")
               .style("top", (d3v5.event.pageY - 18) + "px")
               .transition()
               .duration(200)
               .style("opacity", .9);
    };

    // tooltip mouseout event handler
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

    // Process data for the pie charts
    var [pieData, donutData] = processPie(dataset, newYear, country);

    // Define list of the keys
    var keys = {'DEF': 'Defence', 'HEALTH': 'Health', "HOUCOMM": "Housing and community amenities", "PUBORD" : "Public order and safety", "ECOAFF": "Economic affairs", "GRALPUBSER": "General public services", "RECULTREL": "Recreation, culture and religion", "SOCPROT": "Social protection", "ENVPROT": "Environmental protection", "EDU": "Education"};

    // Set width, height and radius
	var w = 400
	var h = 400
	var radius = 100

    // Set the SVG
    var svg = d3v5.select("#piechart")
	              .append("svg")
                  .attr("id", "donut")
		          .attr("width", "50%")
		          .attr("height", "400px")
		          .attr('viewBox','0 0 '+ Math.min(w,h) +' '+ Math.min(w,h) )

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
 		          .outerRadius(radius)

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

    // tooltip mouseout event handler
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

};

function updatePie(dataset, newYear, country) {

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
    var w = 400
    var h = 400
    var radius = 100

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

      // tooltip mouseout event handler
      var tipMouseout = function(d) {
          tooltip.transition()
                 .duration(300)
                 .style("opacity", 0);
      };

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

    path.transition().duration(750).attrTween("d", arcTweenPie).attr("fill", (d) => colorScale(d.data.label))

    // https://stackoverflow.com/questions/43577130/error-path-attribute-d-expected-arc-flag-0-or-1
};

function updateDonut(dataset, newYear, country) {

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
    var w = 400
    var h = 400
    var radius = 100

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

      // tooltip mouseout event handler
      var tipMouseout = function(d) {
          tooltip.transition()
                 .duration(300)
                 .style("opacity", 0);
      };

    var svg = d3v5.select("svg#donut").select("g#gdonut");

    // Join new data
    const path = svg.selectAll("path")
                    .data(pie(donutData));
    console.log(donutData)

    path.exit().remove().transition().duration(750).attrTween("d", arcTweenDonut);

    path.enter().append("path")
        .on("mousemove", tipMouseover)
        .on("mouseout", tipMouseout)
        .transition().duration(750)
        .attr("d", arc)
        .attr("fill", (d) => colorScale(d.data.label))
        .each(function(d) { this._current = d; });

    path.transition().duration(750).attrTween("d", arcTweenDonut).attr("fill", (d) => colorScale(d.data.label))

    addText(dataset, newYear, country);
};

function arcTweenPie(a) {
    // Generate the arcs
    var arc = d3v5.arc()
                  .innerRadius(0)
                  .outerRadius(100);

    // console.log(this._current);
    var i = d3v5.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return arc(i(t));
  };
};

function arcTweenDonut(a) {
    // Generate the arcs
    var arc = d3v5.arc()
                  .innerRadius(60)
                  .outerRadius(100);

    // console.log(this._current);
    var i = d3v5.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return arc(i(t));
  };
};

function addText(dataset, year, country) {

    var svg = d3v5.select("svg#donut")

    svg.selectAll("text.textpie")
       .remove();

    // Add country in the middle of the donut chart
    svg.append("text")
       .attr("class", "textpie")
       .attr("text-anchor", "middle")
       .attr('font-size', '1.1em')
       .style("font-weight", "bold")
       .attr("x", 0.09 * (d3v5.select('#piechart').node().getBoundingClientRect().width))
       .attr('y', 200)
       .text(dataset[year][country]['country']);

    // Add year in the middle of the donut chart
    svg.append("text")
       .attr("class", "textpie")
       .attr("text-anchor", "middle")
       .attr('font-size', '1.2em')
       .attr("x", 0.09 * (d3v5.select('#piechart').node().getBoundingClientRect().width))
       .attr('y', 220)
       .text(year);

};

function noDonutData(){
    var svg = d3v5.select("svg#donut")

    svg.append("text")
       .attr("class", "textpie")
       .attr('font-size', '1em')
       .attr("x", 0.04 * (d3v5.select('#piechart').node().getBoundingClientRect().width))
       .attr('y', 275)
       .text("No data available!");
}
