/* Name: Teska Vaessen
   Student number: 11046341
   This file............ */

function scatterPlot(healthSpendings) {

    var requests = [d3v5.json("../python/healthvariables.json")];

    Promise.all(requests).then(function(response) {

        // Preprocess the dataset
        var dataset_scatter = preprocess(response[0], healthSpendings);
        console.log("Testhoi:")
        console.log(dataset_scatter)

        // Create the scatter plot
        createScatter(dataset_scatter);

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
                    // checken of het 2017 is (want lifeexp heeft geen data van 2017)
                    healthSpendings[YEAR][d["LOCATION"]][d["INDICATOR"]] = d["Value"];
                };

            });
        };

        return healthSpendings
    };

    function createScatter(dataset_scatter) {

        // Make variable list for the total health spendings
        var healthSpendings = [];
        var healthVariable = [];
        for (year in dataset_scatter){
            for (country in dataset_scatter[year]){
                healthSpendings.push(dataset_scatter[year][country]["TOT"])
                healthVariable.push(dataset_scatter[year][country]["LIFEEXP"])
            }
        }

        // console.log(healthSpendings);
        // console.log(healthVariable.sort(function(a, b){return b-a}))

        // Calculate maximums for the domain
        var maxSpendings = Math.max.apply(null, healthSpendings);
        var maxVariable = 83.7; // nu maar even zo gedaan om de scatterplot te proberen
        console.log(maxSpendings)
        console.log(maxVariable)

        // Define variables for SVG and create SVG element
        var svgWidth = 600;
        var svgHeight = 315;
        var margin = {top: 50, right: 30, bottom: 20, left: 30};
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
        console.log(xScale(dataset_new["AUT"]["TOT"]))

        // Create the dots
        svg.selectAll("circle")
           .data(dataset_new)
           .enter()
           .append("circle")
           .attr("cx", function(d) {
               return xScale(d['TOT']);
           })
           .attr("cy", function(d) {
               return yScale(d['LIFEEXP']);
            })
           .attr("r", 5);
            // .style("fill", function(d, i ) { return colorScale(d['Violent']); })
            // .on("mouseover", tipMouseover)
            // .on("mouseout", tipMouseout);

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
    }
};
