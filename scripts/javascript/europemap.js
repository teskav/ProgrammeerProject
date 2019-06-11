/* Name: Teska Vaessen
   Student number: 11046341
   This file............ */

window.onload = function() {
    console.log("hoi");
    worldmap()
    // var requests = [d3v5.json("code/python/data.json")];
    //
    // Promise.all(requests).then(function(response) {
    //     var dataset = response[0];
    //
    //     // Draw the worldmap with population density variable in colors
    //     worldmap();
    //
    // }).catch(function(e){
    //     throw(e);
    // });

    function worldmap() {

        // Set colorscale for the world map (threshold domain based on the data)
        // var colorScale = d3v5.scaleThreshold()
        //                      .domain([10, 50, 100, 300, 500, 1000])
        //                      .range(['#ffffcc','#c7e9b4','#7fcdbb','#41b6c4','#225ea8','#0c2c84', '#081d58']);

        // Add color to country in dataset
        // for (country in dataset){
        //     dataset[country]["fillColor"] = colorScale(dataset[country]['PopulationDensity']);
        // }

        // Create world map
        // // zoom in on the worldmap
        // var projection = d3v5.geoMercator()
        //     .scale(450)
        //     .translate([500 / 3.5, 200/0.7]);
        //
        // // call the zoom in the map
        // var path = d3v5.geoPath().projection(projection);
        var map = new Datamap({element: document.getElementById("europemap"),
            // data: dataset,
            // zoom: 'europe',
            setProjection: function(element) {
                var projection = d3v3.geo.equirectangular()
                                   .center([15, 52])
                                   .rotate([4.4, 0])
                                   .scale(475)
                                   .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
                var path = d3v3.geo.path()
                                   .projection(projection);
                return {path: path, projection: projection};
            },
            fills: {
                defaultFill: "#808080"
            },
            geographyConfig: {
            popupTemplate: function(geo) {
                return ['<div class="hoverinfo"><strong>',
                        'Population density in ' + geo.properties.name,
                        // ': ' + dataset['PopulationDensity'],
                        '</strong></div>'].join('');
                    }
                },
        });

    }

};
