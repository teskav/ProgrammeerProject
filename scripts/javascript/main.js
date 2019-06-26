window.onload = function() {

    var requests = [d3v5.json("../scripts/data/data.json"), d3v5.json("../scripts/data/healthvariables.json"), d3v5.json("../scripts/data/governmentSpendings.json")];

    // python -m http.server 8888 &
    Promise.all(requests).then(function(response) {

        var dataset = processData(response[0], response[1], response [2]);

        // Based the update code on http://bl.ocks.org/anupsavvy/9513382
        // from Anup’s Block 9513382
        // Add the on click for the drop down menu of the scatterplot
        d3v5.selectAll(".m")
    	    .on("click", function() {
                var variable = this.getAttribute("value");

                // Update the scatter plot
                updateScatter(dataset, $('.slider .parameter-value text').html(), variable);

            });

        // Set default worldmap and scatter plot on 2000 and on Life expectancy
        var map = worldmap(dataset, 2000);

        // Add time slider to the page
        timeslider(dataset, map);

        // Set default scatter plot on 2000 and life expectancy
        createScatter(dataset, $('.slider .parameter-value text').html(), 'Life expectancy');

        // Set default pie charts
        pieChart(dataset, $('.slider .parameter-value text').html(), 'NLD');
        donutChart(dataset, $('.slider .parameter-value text').html(), 'NLD');


    }).catch(function(e){
        throw(e);
    });
}
