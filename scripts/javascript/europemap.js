/* Name: Teska Vaessen
   Student number: 11046341
   This file............ */


function timeslider(dataset, map) {
    // Based all slider code on https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
    // from John Walley’s Block e1d256b81e51da68f7feb632a53c3518

    // Set years
    var dataTime = d3v5.range(0, 17).map(function(d) {
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

                             // Update the map of Europe
                             updateMap(dataset, val.getFullYear(), map);

                             // Set the Netherlands as default country
                             if (typeof currentCountry === 'undefined') {
                                 currentCountry = 'NLD';
                             }

                             // Update the pie charts
                             updatePie(dataset, val.getFullYear(), currentCountry);
                             updateDonut(dataset, val.getFullYear(), currentCountry);
                             // Let user know if there is no data of this country for the donut pie
                             if (JSON.stringify(dataset[val.getFullYear()][currentCountry]["governmentSpendings"]) === '{}' || currentCountry == 'RUS'){
                                 noDonutData();
                             };

                             d3v5.select('p#value-time').text(d3v5.timeFormat('%Y')(val));

                             // Update the scatter plot
                             variable = $('.variable text').html();
                             updateScatter(dataset, val.getFullYear(), variable);
                             console.log(dataset)
                         });

    // Add slider to svg
    var gTime = d3v5.select('div#slider-time')
                    .append('svg')
                    .attr('width', 0.7 * d3v5.select('#slider-time').node().getBoundingClientRect().width)
                    .attr('height', 75)
                    .append('g')
                    .attr('transform', 'translate(12,30)');

    // Call the slider
    gTime.call(sliderTime);

    d3v5.select('p#value-time').style("font-size","40px").text(d3v5.timeFormat('%Y')(sliderTime.value()));
};

function worldmap(dataset, YEAR) {

    // Set colorscale for the world map (threshold domain based on the data)
    var colorScale = d3v5.scaleThreshold()
                         .domain([4, 5, 6, 7, 8, 9, 10, 11])
                         .range(['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58']);

    // Add color to country in dataset
    for (year in dataset){
        for (country in dataset[year]){
            dataset[year][country]["fillColor"] = colorScale(dataset[year][country]["healthSpendings"]['TOT']);
        }
    };

    // var datamap = dataset[YEAR];
    var datamap = $.extend( {}, dataset[YEAR] );

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
                    ': ' + datamap['healthSpendings']["TOT"] + ' (% of GDP)',
                    '</strong></div>'].join('');
                }
            },
        done: function(data) {
            data.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                currentCountry = geography.id;
                if (datamap[currentCountry] == undefined) {
                    alert("This country has no data available. Click on another country.");
                }
                else {
                    // selectCountry(currentCountry);
                    // d3v5.selectAll('.path').classed('active', false);
                    // d3v3.select('.' + currentCountry).classed('active',true);

                    // Update the pie charts
                    updatePie(dataset, $('.slider .parameter-value text').html(), currentCountry);
                    updateDonut(dataset, $('.slider .parameter-value text').html(), currentCountry);

                    // Let user know if there is no data of this country for the donut pie
                    if (JSON.stringify(dataset[$('.slider .parameter-value text').html()][currentCountry]["governmentSpendings"]) === '{}' || currentCountry == 'RUS'){
                        noDonutData();
                    };

                    // Based this highlight code on https://stackoverflow.com/questions/37732166/how-to-make-scatterplot-highlight-data-on-click
                    // Remove any highlights
                    d3v3.selectAll('.circle').classed('active', false);
                    // Select dot in scatter plot of specific country
                    d3v3.select('.' + currentCountry).classed('active',true);
                }
            });
        }
    });
    $(window).on('resize', function() {
        map.resize();
    });

    addLegendMap(colorScale);

    return map
};

function updateMap(dataset, YEAR, map){

    // Set new dataset with new year
    var datamap = $.extend( {}, dataset[YEAR] );

    // Update the data of the map with new year
    map.updateChoropleth(datamap)
};

function addLegendMap(colorScale){

    // Based the legend code on https://bl.ocks.org/mbostock/4573883
    // from Mike Bostock’s Block 4573883
    var x = d3v5.scaleLinear()
                .domain([3, 12])
                .range([0, 300]);

    var xAxis = d3v5.axisBottom(x)
                    .tickSize(13)
                    .tickValues(colorScale.domain());

    var g = d3v5.select("#maplegend").append("svg").attr("height", "50px").call(xAxis);

    g.select(".domain")
     .remove();

    g.selectAll("rect")
     .data(colorScale.range().map(function(color) {
         var d = colorScale.invertExtent(color);
         if (d[0] == undefined) d[0] = x.domain()[0];
         if (d[1] == undefined) d[1] = x.domain()[1];
         return d;
     }))
      .enter().insert("rect", ".tick")
        .attr("height", 10)
        .attr("y", 12)
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
           return "translate(" + x(d[1]) + ","+ 12 + ")";
       });

    g.append("text")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .attr("y", 8)
        .text("Health spendings (in % of GDP)");
}
