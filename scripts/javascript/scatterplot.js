/* Name: Teska Vaessen
Student number: 11046341
This file includes functions to create and update the scatter plot. */

function createScatter(dataset, YEAR, healthvariable) {
    /* This function creates the default scatter plot. */

    // Make variable list to calculate max and min of variables
    var healthSpendings = [];
    var healthVariable = [];
    for (country in dataset[YEAR]){
        healthSpendings.push(dataset[YEAR][country]['healthSpendings']["TOT"]);
        if (!(dataset[YEAR][country][healthvariable] === null)){
            healthVariable.push(dataset[YEAR][country][healthvariable]);
        };
    };

    // Calculate maximums for the domain
    var maxSpendings = Math.max.apply(null, healthSpendings);
    var maxVariable =Math.max.apply(null, healthVariable);

    // Define variables for SVG and create SVG element
    var svgWidth = d3v5.select('#scatter').node().getBoundingClientRect().width;
    var svgHeight = 350;
    var margin = {top: 45, right: 30, bottom: 20, left: 73};
    var svg = d3v5.select("#scatter")
                  .append("svg")
                  .attr("id", "scatter")
                  .attr("width", svgWidth)
                  .attr("height", svgHeight);

    // Set the new dataset with the right year (make a copy so that it does not delete it in the real dataset)
    var datasetNew =  $.extend( {}, dataset[YEAR] );

    // Delete rows with missing value of health variable
    Object.values(datasetNew).forEach(function(d) {
        if (d[healthvariable] == null){
            delete datasetNew[d['code']];
        };
    });

    // Define xScale
    var xScale = d3v5.scaleLinear()
                     .domain([0, maxSpendings])
                     .range([margin.left, svgWidth - margin.right]);

    // Define yScale
    var yScale = d3v5.scaleLinear()
                     .domain([0, maxVariable])
                     .range([svgHeight - margin.top, margin.bottom]);

    // Make dataset in the right format for scatter plot
    var datasetNew2 = d3v5.entries(datasetNew);

    // Set color scale for the color of the dots
    var colorScale = d3v5.scaleQuantize()
                    .domain([2, 10])
                    .range(['#d9f0a3','#addd8e','#78c679','#31a354','#006837']);

    // Based this tooltip code on http://bl.ocks.org/williaster/af5b855651ffe29bdca1
    // from Chris Williams’s Block af5b855651ffe29bdca1

    // Add the tooltip container to the body container
    // it's invisible and its position/contents are defined during mouseover
    var tooltip = d3v5.select("body").append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0);

    // Tooltip mouseover event handler
    var tipMouseover = function(d) {
    var color = colorScale(d['value']['healthSpendings']['COMPULSORY']);
    var html  = "<span style='color:" + color + ";'> Country: " + d['value']['country'] + "<br>" + healthvariable + ": " + d['value'][healthvariable] + "<br> Government health spendings: " +  d['value']["healthSpendings"]["COMPULSORY"] +"</span>";

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

    // Create the dots
    svg.selectAll(".circle")
       .data(datasetNew2)
       .enter()
       .append("circle")
       .attr("class", function(d) { return d.key + " circle"; })
       .attr("cx", function(d) {
           return xScale(d['value']['healthSpendings']['TOT']);
       })
       .attr("cy", function(d) {
           return yScale(d['value'][healthvariable]);
        })
       .attr("r", 4)
       .style("fill", function(d, i ) { return colorScale(d['value']['healthSpendings']['COMPULSORY']); })
       .on("mouseover", tipMouseover)
       .on("mouseout", tipMouseout)
       .on("click", function(d) {

           // Set new current country
           currentCountry = d.key;

           // Based this highlight code on https://stackoverflow.com/questions/37732166/how-to-make-scatterplot-highlight-data-on-click
           // Remove any highlights
           d3v3.selectAll('.circle').classed('active', false);

           // Select dot in scatter plot of specific country
           d3v3.select('.' + currentCountry).classed('active',true);

           // Update the pie chart and the donut chart with new country
           updatePie(dataset, $('.slider .parameter-value text').html(), currentCountry);
           updateDonut(dataset, $('.slider .parameter-value text').html(), currentCountry);

           // Let user know if there is no data of this country for the donut pie
           if (JSON.stringify(dataset[$('.slider .parameter-value text').html()][currentCountry]["governmentSpendings"]) === '{}' || currentCountry == 'RUS'){
               noDonutData();
           };
       });

    // Create the axes, the color legend and the title and labels
    createAxes(xScale, yScale, svgHeight, margin, svg);
    addLegend(colorScale, margin, svg);
    createLabels(svg, svgWidth, svgHeight, margin, healthvariable);

}

function updateScatter(dataset, YEAR, healthvariable) {
    /* This function updates the scatter plot with a new year or a new variable
       for the y-axis. */

    // Make variable list for to calculate max and min
    var healthSpendings = [];
    var healthVariable = [];
    for (country in dataset[YEAR]){
        healthSpendings.push(dataset[YEAR][country]['healthSpendings']["TOT"]);
        if (!(dataset[YEAR][country][healthvariable] === null)){
            healthVariable.push(dataset[YEAR][country][healthvariable]);
        };
    };

    // Calculate maximums for the domain
    var maxSpendings = Math.max.apply(null, healthSpendings);
    var maxVariable =Math.max.apply(null, healthVariable);

    // Define variables for SVG and create SVG element
    var svgWidth = d3v5.select('#scatter').node().getBoundingClientRect().width;
    var svgHeight = 350;
    var margin = {top: 45, right: 30, bottom: 20, left: 73};
    var svg = d3v5.select("svg#scatter");

    // Set the new dataset with the right year (make a copy so that it does not delete it in the real dataset)
    var datasetNew =  $.extend( {}, dataset[YEAR] );

    // Delete rows with missing value of health variable
    Object.values(datasetNew).forEach(function(d) {
        if (d[healthvariable] == null){
            delete datasetNew[d['code']];
        };
    });

    // Define new xScale
    var xScale = d3v5.scaleLinear()
                     .domain([0, maxSpendings])
                     .range([margin.left, svgWidth - margin.right]);

    // Define new yScale
    var yScale = d3v5.scaleLinear()
                     .domain([0, maxVariable])
                     .range([svgHeight - margin.top, margin.bottom]);

    var datasetNew2 = d3v5.entries(datasetNew);

    // Set color scale for the color of the dots
    var colorScale = d3v5.scaleQuantize()
                         .domain([2, 10])
                         .range(['#d9f0a3','#addd8e','#78c679','#31a354','#006837']);

    // Based this tooltip code on http://bl.ocks.org/williaster/af5b855651ffe29bdca1
    // from Chris Williams’s Block af5b855651ffe29bdca1

    // Add the tooltip container to the body container
    // it's invisible and its position/contents are defined during mouseover
    var tooltip = d3v5.select("div.tooltip");

    // tooltip mouseover event handler
    var tipMouseover = function(d) {
    var color = colorScale(d['value']['healthSpendings']['COMPULSORY']);
    var html  = "<span style='color:" + color + ";'> Country: " + d['value']['country'] + "<br>" + healthvariable + ": " + d['value'][healthvariable] + "<br> Government health spendings: " +  d['value']["healthSpendings"]["COMPULSORY"] +"</span>";

        tooltip.html(html)
            .style("left", (d3v5.event.pageX + 12) + "px")
            .style("top", (d3v5.event.pageY - 18) + "px")
            .transition()
            .duration(200)
            .style("opacity", .9)
    };

    // Tooltip mouseout event handler
    var tipMouseout = function(d) {
        tooltip.transition()
               .duration(300)
               .style("opacity", 0);
    };

    // Create the dots
    svg.selectAll(".circle")
       .data(datasetNew2)
       .enter().append("circle").merge(svg.selectAll(".circle"))
       .attr("class", function(d) { return d.key + " circle"; })
       .on("click", function(d) {

           // Set new current country
           currentCountry = d.key;

           // Based this highlight code on https://stackoverflow.com/questions/37732166/how-to-make-scatterplot-highlight-data-on-click

           // Remove any old highlights
           d3v3.selectAll('.circle').classed('active', false);

           // Select dot in scatter plot of specific country
           d3v3.select('.' + currentCountry).classed('active',true);

           // Update the pie and donut chart
           updatePie(dataset, $('.slider .parameter-value text').html(), currentCountry);
           updateDonut(dataset, $('.slider .parameter-value text').html(), currentCountry);

           // Let user know if there is no data of this country for the donut pie
           if (JSON.stringify(dataset[$('.slider .parameter-value text').html()][currentCountry]["governmentSpendings"]) === '{}' || currentCountry == 'RUS'){
               noDonutData();
           }
       })
       .on("mouseover", tipMouseover)
       .on("mouseout", tipMouseout)
       .transition()
       .duration(1000)
       .ease(d3v5.easeLinear)
       .attr("cx", function(d) {
           return xScale(d['value']['healthSpendings']['TOT']);
       })
       .attr("cy", function(d) {
           return yScale(d['value'][healthvariable]);
        })
       .style("fill", function(d, i ) { return colorScale(d['value']['healthSpendings']['COMPULSORY']); });

    svg.selectAll(".circle").data(datasetNew2).exit().remove();

    // Update the axes and the title and the labels
    updateAxes(xScale, yScale, svgHeight, margin, svg);
    createLabels(svg, svgWidth, svgHeight, margin, healthvariable);

}

function createAxes(xScale, yScale, svgHeight, margin, svg) {
    /* This function creates the axes of the default scatter plot. */

    // Create x axis
    var xAxis = d3v5.axisBottom(xScale);

    svg.append("g")
       .attr("class", "axis")
       .attr("id", "x-axis")
       .attr("transform", "translate(0," + (svgHeight - margin.top) + ")")
       .call(xAxis);

    // Create y axis
    var yAxis = d3v5.axisLeft(yScale).tickFormat(d3v5.format(".2s"));

    svg.append("g")
       .attr("class", "axis")
       .attr("id", "y-axis")
       .attr("transform", "translate(" + margin.left + ", 0)")
       .call(yAxis);

};

function updateAxes(xScale, yScale, svgHeight, margin, svg){
    /* This function updates the axes of the scatter plot. */

    // Update x axis
    var xAxis = d3v5.axisBottom(xScale);

    svg.select("#x-axis")
       .transition()
       .duration(1000)
       .call(xAxis);

    // Update y axis
    var yAxis = d3v5.axisLeft(yScale).tickFormat(d3v5.format(".2s"));

    svg.select("#y-axis")
       .transition()
       .duration(1000)
       .call(yAxis);

};

function addLegend(colorScale, margin, svg) {
    /* This function adds the legend of the color scale of the scatter plot. */

    // Remove old legend
    svg.select("g.legend")
       .remove();
    svg.select("text.legend")
       .remove();

    // Based all legend code on https://bl.ocks.org/zanarmstrong/0b6276e033142ce95f7f374e20f1c1a7
    // from zan’s Block 0b6276e033142ce95f7f374e20f1c1a7

    // Set legend for the color of the dots
    var colorLegend = d3v5.legendColor()
                          .labelFormat(d3v5.format(".0f"))
                          .scale(colorScale)
                          .shapePadding(5)
                          .shapeWidth(25)
                          .shapeHeight(10)
                          .labelOffset(12);

    // Create the legend
    svg.append("g")
  	   .attr("class", "legend")
  	   .attr("transform", "translate(" + 1.05 * margin.left + "," + margin.bottom * 1.25 + ")")
  	   .call(colorLegend);

    // Add title for legend
    svg.append("text")
       .attr("class", "legend")
       .attr("x", margin.left)
       .attr("y", margin.top / 2.2)
       .attr("text-anchor", "start")
       .style("font-weight", "bold")
       .style("font-size", "10px")
       .text("Government health spendings (in % of GDP)");

};

function createLabels(svg, svgWidth, svgHeight, margin, healthvariable) {
    /* This function creates the titles and labels of the scatter plot. */

    // Remove the old titles
    svg.selectAll("text.title")
       .remove();
    svg.selectAll("g.variable")
       .remove();

    // Add x label
    svg.append('text')
       .attr('class', 'title')
       .attr("font-weight", "bold")
       .attr("font-size", "12px")
       .attr('x', (svgWidth + margin.left) / 2)
       .attr('y', svgHeight - 10)
       .attr('text-anchor', 'middle')
       .text('Total health spendings (in % of GDP)');

    // Add y label
    svg.append('g').attr("class", "variable")
       .append('text')
       .attr("font-weight", "bold")
       .attr("font-size", "12px")
       .attr("transform", "rotate(-90)")
       .attr('x', -svgHeight / 2)
       .attr('y', margin.left / 2)
       .attr('text-anchor', 'middle')
       .text(healthvariable);

    // Add title
    svg.append('text')
       .attr('class', 'title')
       .attr("font-size", "12px")
       .attr("font-weight", "bold")
       .attr('x', (svgWidth + margin.left + 10) / 2)
       .attr('y', 9)
       .attr('text-anchor', 'middle')
       .text('Relationship health spendings and '+ healthvariable);

};
