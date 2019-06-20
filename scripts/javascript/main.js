window.onload = function() {

    var requests = [d3v5.json("../python/data.json"), d3v5.json("../python/healthvariables.json"), d3v5.json("../python/governmentSpendings.json")];
    // console.log(requests);

    Promise.all(requests).then(function(response) {

        var dataset = processData(response[0], response[1], response [2]);

        // Add time slider to the page
        timeslider(dataset);

        // Set default worldmap and scatter plot on 2000
        worldmap(dataset, 2000);
        scatterPlot(dataset);

        // Set default pie charts
        pieCharts(dataset, 2000, 'NLD');


    }).catch(function(e){
        throw(e);
    });
}
