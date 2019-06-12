/* Name: Teska Vaessen
   Student number: 11046341
   This file............ */

window.onload = function() {
    console.log("hoi");
    var requests = [d3v5.json("../python/data.json")];
    // console.log(requests);

    Promise.all(requests).then(function(response) {

        var dataset = preprocess(response[0]);
        console.log(dataset[2000]);
        // Make variable list for the total health spendings
        var healthSpendings = [];
        for (year in dataset){
            for (country in dataset[year]){
                healthSpendings.push(dataset[year][country]["TOT"])
            }
        }
        console.log(healthSpendings.sort(function(a, b){return b-a}));
        // Calculate maximums for the domain
        // var maxDeathrate = Math.max.apply(null, deathrate);
        // var maxBirthrate = Math.max.apply(null, birthrate);
        worldmap(dataset);

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
        // console.log(data);

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

    function worldmap(dataset) {

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
        var datamap = dataset[2000];
        console.log("datamap:")
        console.log(datamap)
        var map = new Datamap({element: document.getElementById("europemap"),
            data: datamap,
            // zoom: 'europe',
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
            // responsive: true,
            fills: {
                defaultFill: "#808080"
            },
            geographyConfig: {
            popupTemplate: function(geo, datamap) {
                return ['<div class="hoverinfo"><strong>',
                        'Health spendings in ' + geo.properties.name,
                        ': ' + datamap["TOT"],
                        '</strong></div>'].join('');
                    }
                },
            done: function(data) {
                data.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                    country = geography.id;
                    if (datamap[country] == undefined) {
                        alert("This country has no data available. Click on another country.");
                    }
                    else {
                        console.log('hoi')
                    }
                });
            }


        });

    }

};
