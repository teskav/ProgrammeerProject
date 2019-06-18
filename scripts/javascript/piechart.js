function pieCharts(healthSpendings, newYear, country) {

    var requests = [d3v5.json("../python/governmentSpendings.json")];

    Promise.all(requests).then(function(response) {

        // Add government spendings to dataset
        healthSpendings = preprocess(response[0], healthSpendings)

        // Process data for the pie charts
        var [pieData, donutData] = process(healthSpendings, newYear, country);

        // Create the pie chart
        pieChart(pieData);
        donutChart(donutData)

    }).catch(function(e){
        throw(e);
    });

    function preprocess(data, healthSpendings) {

        // // Set list of years
        var years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];

        // Set dataset
        for (year in years){
            var YEAR = years[year];
            Object.values(data).forEach(function(d){
                if (d["TIME"] == YEAR){
                    healthSpendings[YEAR][d["LOCATION"]]["governmentSpendings"][d["SUBJECT"]] = d["Value"];
                };

            });
        };

        return healthSpendings
    };

    function process(healthSpendings, newYear, country){
        // console.log(healthSpendings);
        var dataset_new = healthSpendings[newYear][country];
        console.log(dataset_new);
        var pieData = [];
        var donutData = [];

        Object.keys(dataset_new["healthSpendings"]).forEach(function(d){
            if (d != "TOT"){
                pieData.push({"label": d, "value": dataset_new["healthSpendings"][d]});
            }
        });

        Object.keys(dataset_new["governmentSpendings"]).forEach(function(d){
            if (d != "TOT"){
                donutData.push({"label": d, "value": dataset_new["governmentSpendings"][d]});
            }
        });

        return [pieData, donutData];
    };

    function pieChart(pieData) {
        // Define list of the keys
        var keys = {'OOPEXP': "Out-of-Pocket", "COMPULSORY": "Government/Compulsory", 'VOLUNTARY': "Voluntary"};

        // Set width, height and radius
    	var w = 400
    	var h = 400
    	var radius = 100

        // Set the SVG
        var svg = d3v5.select("#piechart")
		              .append("svg")
			          .attr("width", "50%")
			          .attr("height", "400px")
			          .attr('viewBox','0 0 '+ Math.min(w,h) +' '+ Math.min(w,h) )

        // Set g for the pie chart
        g = svg.append("g").attr("transform", "translate(" + w / 1.35 + "," + h / 2 + ")");

        // Define color scale
    	var colorScale = d3v5.scaleOrdinal()
                    	     .domain(Object.keys(keys))
                    		 .range(['#66c2a5','#fc8d62','#8da0cb']);

        // Generate the pie
        var pie = d3v5.pie().sort(null).value(function(d){ return d["value"]; });

        // Generate the arcs
     	var arc = d3v5.arc()
     		          .innerRadius(0)
     		          .outerRadius(radius)

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
        var arcs = g.selectAll("arc")
                    .data(pie(pieData))
                    .enter()
                    .append("g")
                    .attr("class", "arc")
                    .on("mousemove", tipMouseover)
                    .on("mouseout", tipMouseout);

        //Draw arc paths
        arcs.append("path")
            .attr("fill", function(d) {
                return colorScale(d.data.label);
            })
            .attr("d", arc);

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

    function donutChart(donutData) {

        // Define list of the keys
        var keys = {'DEF': 'Defence', 'HEALTH': 'Health', "HOUCOMM": "Housing and community amenities", "PUBORD" : "Public order and safety", "ECOAFF": "Economic affairs", "GRALPUBSER": "General public services", "RECULTREL": "Recreation, culture and religion", "SOCPROT": "Social protection", "ENVPROT": "Environmental protection", "EDU": "Education"};

        // Set width, height and radius
    	var w = 400
    	var h = 400
    	var radius = 100

        // Set the SVG
        var svg = d3v5.select("#piechart")
		              .append("svg")
			          .attr("width", "50%")
			          .attr("height", "400px")
			          .attr('viewBox','0 0 '+ Math.min(w,h) +' '+ Math.min(w,h) )

        // Set g for the pie chart
        g = svg.append("g").attr("transform", "translate(" + w / 4 + "," + h / 2 + ")");

        // Define color scale
    	var colorScale = d3v5.scaleOrdinal()
                    	     .domain(Object.keys(keys))
                    		 .range(['#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4','#313695']);

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

    };
};
