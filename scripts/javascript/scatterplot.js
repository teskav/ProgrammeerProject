/* Name: Teska Vaessen
   Student number: 11046341
   This file............ */

function scatterPlot(dataset) {

    // Create the scatter plot
    createScatter(dataset);

    function createScatter(dataset_scatter) {

        // Make variable list for the total health spendings
        var healthSpendings = [];
        var healthVariable = [];
        for (year in dataset_scatter){
            for (country in dataset_scatter[year]){
                healthSpendings.push(dataset_scatter[year][country]['healthSpendings']["TOT"])
                healthVariable.push(dataset_scatter[year][country]["LIFEEXP"])
            }
        }

        // console.log(healthSpendings);
        // console.log(healthVariable.sort(function(a, b){return b-a}))

        // Calculate maximums for the domain
        var maxSpendings = Math.max.apply(null, healthSpendings);
        var maxVariable = 83.7; // nu maar even zo gedaan om de scatterplot te proberen
        // console.log(maxSpendings)
        // console.log(maxVariable)

        // Define variables for SVG and create SVG element
        var svgWidth = d3v5.select('#scatter').node().getBoundingClientRect().width;
        var svgHeight = 350;
        var margin = {top: 40, right: 30, bottom: 20, left: 50};
        var svg = d3v5.select("#scatter")
                      .append("svg")
                      .attr("width", svgWidth)
                      .attr("height", svgHeight);

        // Set the year 2000 as default scatter plot
        dataset_new = dataset_scatter[2000];
        console.log(dataset_new);

        // Define xScale
        var xScale = d3v5.scaleLinear()
                         .domain([0, maxSpendings])
                         .range([margin.left, svgWidth - margin.right]);

        // Define yScale
        var yScale = d3v5.scaleLinear()
                         .domain([0, maxVariable])
                         .range([svgHeight - margin.top, margin.bottom]);

        // Set color scale for the color of the dots
        var colorScale = d3v5.scaleQuantize()
                        .domain([0, 12])
                        .range(['#c7e9b4','#7fcdbb','#1d91c0','#253494','#081d58']);

        // console.log(xScale(dataset_new["AUT"]['healthSpendings']["TOT"]))
        var dataset_new2 = d3v5.entries(dataset_new)
        console.log(dataset_new2)

        // Based this tooltip code on http://bl.ocks.org/williaster/af5b855651ffe29bdca1
        // from Chris Williams’s Block af5b855651ffe29bdca1
        // Add the tooltip container to the body container
        // it's invisible and its position/contents are defined during mouseover
        var tooltip = d3v5.select("body").append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0);

        // tooltip mouseover event handler
        var tipMouseover = function(d) {
        var color = colorScale(d['value']['healthSpendings']['COMPULSORY']);
        var html  = "<span style='color:" + color + ";'>" + d['value']['country'] + "<br> Health Variable: " + d['value']["LIFEEXP"] + "</span><br/>";

            tooltip.html(html)
                .style("left", (d3v5.event.pageX + 12) + "px")
                .style("top", (d3v5.event.pageY - 18) + "px")
                .transition()
                .duration(200)
                .style("opacity", .9)

        };

        // tooltip mouseout event handler
        var tipMouseout = function(d) {
            tooltip.transition()
                   .duration(300)
                   .style("opacity", 0);
        };

        // Create the dots
        svg.selectAll(".circle")
           .data(dataset_new2)
           .enter()
           .append("circle")
           .attr("cx", function(d) {
               // console.log(d.key)
               return xScale(d['value']['healthSpendings']['TOT']);
           })
           .attr("cy", function(d) {
               return yScale(d['value']['LIFEEXP']);
            })
           .attr("r", 4)
           .style("fill", function(d, i ) { return colorScale(d['value']['healthSpendings']['COMPULSORY']); })
           .on("mouseover", tipMouseover)
           .on("mouseout", tipMouseout);

        // Create x axis
        var xAxis = d3v5.axisBottom(xScale);

        svg.append("g")
           .attr("class", "axis")
           .attr("transform", "translate(0," + (svgHeight - margin.top) + ")")
           .call(xAxis);

        // Create y axis
        var yAxis = d3v5.axisLeft(yScale);

        svg.append("g")
           .attr("class", "axis")
           .attr("transform", "translate(" + margin.left + ", 0)")
           .call(yAxis);

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
     	   .attr("transform", "translate(" + 2 * margin.right + "," + margin.bottom * 1.25 + ")")
     	   .call(colorLegend);

       // Add title for legend
       svg.append("text")
          .attr("class", "legend")
          .attr("x", margin.left)
       	  .attr("y", margin.top / 2)
       	  .attr("text-anchor", "start")
       	  .style("font-weight", "bold")
          .style("font-size", "10px")
       	  .text("Government health spendings (in % of GDP)");

       // Add x label
       svg.append('text')
          .attr('class', 'title')
          .attr("font-weight", "bold")
          .attr('x', (svgWidth + margin.left) / 2)
          .attr('y', svgHeight - 10)
          .attr('text-anchor', 'middle')
          .text('Total health spendings (in % of GDP)');

       // Add y label
       svg.append('text')
          .attr('class', 'title')
          .attr("font-weight", "bold")
          .attr("transform", "rotate(-90)")
          .attr('x', -svgHeight / 2)
          .attr('y', margin.left / 2)
          .attr('text-anchor', 'middle')
          .text('Health variable');

       // Add title
       svg.append('text')
          .attr('class', 'title')
          .attr("font-size", "14px")
          .attr("font-weight", "bold")
          .attr('x', (svgWidth + margin.left + 10) / 2)
          .attr('y', 10)
          .attr('text-anchor', 'middle')
          .text('Relationship between health spendings and health variable');

          // $(window).on('resize', function() {
          //     var svgWidth = d3v5.select('#scatter').node().getBoundingClientRect().width;
          //     var svgHeight = 350;
          //     var margin = {top: 40, right: 30, bottom: 20, left: 50};
          //     svg.attr("width", svgWidth)
          //               .attr("height", svgHeight);
          //     // map.resize();
          // });
        //   function updateWindow(){
        //       var w = window,
        //         d = document,
        //         e = d.documentElement,
        //         g = d.getElementById('scatter'),
        //     x = d3v5.select('#scatter').node().getBoundingClientRect().width
        //     // y = w.innerHeight|| e.clientHeight|| g.clientHeight;
        //
        //     svg.attr("width", x);
        // }
        // d3v5.select(window).on('resize', updateWindow);

    }
};
