/* Name: Teska Vaessen
   Student number: 11046341
   This file............ */

window.onload = function() {
    console.log("hoi");
    var requests = [d3v5.json("../python/data.json")];
    // console.log(requests);

    Promise.all(requests).then(function(response) {

        var dataset = preprocess(response[0]);
        // console.log(dataset[2000]);
        // Make variable list for the total health spendings
        var healthSpendings = [];
        for (year in dataset){
            for (country in dataset[year]){
                healthSpendings.push(dataset[year][country]["TOT"])
            }
        }
        // console.log(healthSpendings.sort(function(a, b){return b-a}));
        // Calculate maximums for the domain
        // var maxDeathrate = Math.max.apply(null, deathrate);
        // var maxBirthrate = Math.max.apply(null, birthrate);
        timeslider(dataset);
        // Set default worldmap on 2000
        worldmap(dataset, 2000);

    }).catch(function(e){
        throw(e);
    });

    function preprocess(data) {

        // Set variable for map data
        var dataset = {};
        var years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];
        for (year in years){
            var YEAR = years[year];
            dataset[YEAR] = {};
        }

        // Set dataset
        for (year in years){
            var YEAR = years[year];
            Object.values(data).forEach(function(d){
                // dataset[YEAR] = {};
                // dataset_year = {};
                // console.log(dataset);
                if (d["TIME"] == YEAR){
                    // checken of land al in de dictionairy staat dan dit doen
                    if (!(d["LOCATION"] in dataset[YEAR])){
                        var variables = {};
                        variables.country = d["LOCATION"];
                        variables.year = d["TIME"];
                        variables[d["SUBJECT"]] = d["Value"];

                        dataset[YEAR][d["LOCATION"]] = variables;
                    }
                    else {
                        dataset[YEAR][d["LOCATION"]][d["SUBJECT"]] = d["Value"];
                    };

                };
            });
        };
        console.log(dataset);
        return dataset
    };

    function timeslider(dataset) {
        // Based all slider code on https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
        // from John Walley’s Block e1d256b81e51da68f7feb632a53c3518

        // Set years
        var dataTime = d3v5.range(0, 18).map(function(d) {
            return new Date(2000 + d, 10, 3);
        });

        // Set slider
        var sliderTime = d3v5.sliderBottom()
                             .min(d3v5.min(dataTime))
                             .max(d3v5.max(dataTime))
                             .step(1000 * 60 * 60 * 24 * 365)
                             .width(600)
                             .tickFormat(d3v5.timeFormat('%Y'))
                             .tickValues(dataTime)
                             .default(new Date(2000, 10, 3))
                             .on('onchange', val => {
                                 console.log(val.getFullYear());
                                 // Remove old map of Europe
                                 $('#europemap').empty();
                                 // Create new map of Europe
                                 worldmap(dataset, val.getFullYear());
                                 d3v5.select('p#value-time').text(d3v5.timeFormat('%Y')(val));
                             });

        // Add slider to svg
        var gTime = d3v5.select('div#slider-time')
                        .append('svg')
                        .attr('width', 900)
                        .attr('height', 100)
                        .append('g')
                        .attr('transform', 'translate(250,30)');

        // Call the slider
        gTime.call(sliderTime);

        d3v5.select('p#value-time').text(d3v5.timeFormat('%Y')(sliderTime.value()));
    };

    function worldmap(dataset, YEAR) {

        // Set colorscale for the world map (threshold domain based on the data)
        var colorScale = d3v5.scaleThreshold()
                             .domain([4, 5, 6, 7, 8, 9, 10, 11])
                             .range(['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58']);

        // Add color to country in dataset
        for (year in dataset){
            for (country in dataset[year]){
                dataset[year][country]["fillColor"] = colorScale(dataset[year][country]['TOT']);
            }
        }
        var datamap = dataset[YEAR];
        console.log("datamap:")
        console.log(datamap)
        var map = new Datamap({element: document.getElementById("europemap"),
            data: datamap,
            responsive: true,
            setProjection: function(element) {
                var projection = d3v3.geo.equirectangular()
                                   .center([17, 52])
                                   .rotate([4.4, 0])
                                   .scale(475)
                                   .translate([element.offsetWidth / 1.8, element.offsetHeight / 2]);
                var path = d3v3.geo.path()
                                   .projection(projection);
                return {path: path, projection: projection};
            },
            fills: {
                defaultFill: "#808080"
            },
            geographyConfig: {
            popupTemplate: function(geo, datamap) {
                return ['<div class="hoverinfo"><strong>',
                        'Health spendings in ' + geo.properties.name,
                        ': ' + datamap["TOT"] + ' (% of GDP)',
                        '</strong></div>'].join('');
                    }
                },
            done: function(data) {
                data.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                    country = geography.id;
                    console.log(country);
                    if (datamap[country] == undefined) {
                        alert("This country has no data available. Click on another country.");
                    }
                    else {
                        console.log('hoi')
                    }
                });
            }
        });
        // addLegend(colorScale);
    };

    function addLegend(colorScale){

        // Based the legend code on https://bl.ocks.org/mbostock/4573883
        // from Mike Bostock’s Block 4573883
        var x = d3v5.scaleLinear()
                    .domain([0, 1100])
                    .range([585, 1085]);

        var xAxis = d3v5.axisBottom(x, 440)
                        .tickSize(13)
                        .tickValues(colorScale.domain());

        var g = d3v5.select("g").call(xAxis);

        g.select(".domain")
         .remove();

        g.selectAll("rect")
         .data(colorScale.range().map(function(color) {
             var d = colorScale.invertExtent(color);
             if (d[0] == undefined) {
                 d[0] = x.domain()[0];
             }
             if (d[1] == undefined) {
                 d[1] = x.domain()[1];
             }
             return d;
           }))
           .enter().insert("rect", ".tick")
           .attr("height", 10)
           .attr("y", 440)
           .attr("x", function(d) { return x(d[0]); })
           .attr("width", function(d) { return x(d[1]) - x(d[0]); })
           .attr("fill", function(d) { return colorScale(d[0]); });

        // Add ticks at right position
        g.selectAll(".tick")
         .data(colorScale.range().map(function(color) {
             var d = colorScale.invertExtent(color);
             if (d[0] == undefined) {
                 d[0] = x.domain()[0];
             }
             if (d[1] == undefined) {
                 d[1] = x.domain()[1];
             }
             return d;
           }))
           .attr("transform", function translate(d) {
               return "translate(" + x(d[1]) + ","+ 440 + ")";
           });

        // Add title of the legend
        g.append("text")
         .attr("fill", "#000")
         .attr("font-weight", "bold")
         .attr("text-anchor", "start")
         .attr("x", 585)
         .attr("y", 430)
         .text("Population density (per sq. mi.)");
    }

};
