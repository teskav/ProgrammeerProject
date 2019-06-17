function pieCharts(healthSpendings) {

    var requests = [d3v5.json("../python/healthvariables.json")];

    Promise.all(requests).then(function(response) {

        // Preprocess the dataset
        var pieData = process(healthSpendings);

        // Create the pie chart
        pieChart(pieData);

    }).catch(function(e){
        throw(e);
    });

    function process(healthSpendings){
        console.log(healthSpendings);
        var dataset_new = healthSpendings[2011]["ITA"]["healthSpendings"];
        console.log(dataset_new)
        var pieData = [];

        Object.keys(dataset_new).forEach(function(d){
            if (d != "TOT"){
                pieData.push(dataset_new[d])
            }
        });
        console.log(pieData)

        return pieData;
    };

    function pieChart(pieData) {
        // Define list of the keys
        var keys = ["Out-of-Pocket", "Government/Compulsory", "Voluntary"];

        // Set width, height and radius
    	var w = 400
    	var h = 400
    	var radius = 100

        // Set the SVG
        var svg = d3v5.select("#piechart")
		              .append("svg")
			          .attr("width", "50%")
			          .attr("height", "400px")
			          .attr('viewBox','0 0 '+Math.min(w,h) +' '+Math.min(w,h) )

        // Set g for the pie chart
        g = svg.append("g").attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

        // Define color scale
    	var colorScale = d3v5.scaleOrdinal()
                    	     .domain(keys)
                    		 .range(['#66c2a5','#fc8d62','#8da0cb']);

        // Generate the pie
        var pie = d3v5.pie();

        // Generate the arcs
     	var arc = d3v5.arc()
     		.innerRadius(0)
     		.outerRadius(radius)

        // Generate groups
        var arcs = g.selectAll("arc")
                    .data(pie(pieData))
                    .enter()
                    .append("g")
                    .attr("class", "arc")
                    .on('mouseover', function(d, i) {
                    $("#tooltip")
                      .html("Value: "+ pieData[i])
                      .show();
                })
                .on('mousemove', function(d) {
                    $("#tooltip")
                      .css('left', d3v5.mouse(this)[0])
                      .css('top', d3v5.mouse(this)[1])
                })
                .on('mouseout', function(d) {
                    $("#tooltip").html('').hide();
                });

        //Draw arc paths
        arcs.append("path")
            .attr("fill", function(d, i) {
                return colorScale(i);
            })
            .attr("d", arc);
    };
}
