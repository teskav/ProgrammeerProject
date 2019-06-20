function updatePiecharts(healthSpendings, newYear, country) {

    // Process new data for the pie charts
    var [pieData, donutData] = process(healthSpendings, newYear, country);

    redraw(pieData);

    function process(healthSpendings, newYear, country){
        // console.log(healthSpendings);
        var dataset_new = healthSpendings[newYear][country];
        console.log(dataset_new);
        var pieData = [];
        var donutData = [];

        Object.keys(dataset_new["healthSpendings"]).forEach(function(d){
            if (d != "TOT"){
                pieData.push({"label": d, "value": dataset_new["healthSpendings"][d]});
            }
        });

        Object.keys(dataset_new["governmentSpendings"]).forEach(function(d){
            if (d != "TOT"){
                donutData.push({"label": d, "value": dataset_new["governmentSpendings"][d]});
            }
        });

        return [pieData, donutData];
    };

    function redraw(data){

        // Define list of the keys
        var keys = {'OOPEXP': "Out-of-Pocket", "COMPULSORY": "Government/Compulsory", 'VOLUNTARY': "Voluntary"};

        // // Set width, height and radius
    	// var w = 400
    	// var h = 400
    	// var radius = 100
        //
        // // Set the SVG
        // var svg = d3v5.select("#piechart")
		//               .append("svg")
		// 	          .attr("width", "50%")
		// 	          .attr("height", "400px")
		// 	          .attr('viewBox','0 0 '+ Math.min(w,h) +' '+ Math.min(w,h) )
        //
        // // Set g for the pie chart
        // g = svg.append("g").attr("transform", "translate(" + w / 1.35 + "," + h / 2 + ")");
        //
        // // Define color scale
    	// var colorScale = d3v5.scaleOrdinal()
        //             	     .domain(Object.keys(keys))
        //             		 .range(['#66c2a5','#fc8d62','#8da0cb']);

        // Generate the pie
        var pie = d3v5.pie().sort(null).value(function(d){ return d["value"]; });

        // // Generate the arcs
     	// var arc = d3v5.arc()
     	// 	          .innerRadius(0)
     	// 	          .outerRadius(radius)
        //
        // // Based this tooltip code on http://bl.ocks.org/williaster/af5b855651ffe29bdca1
        // // from Chris Williams’s Block af5b855651ffe29bdca1
        // // Add the tooltip container to the body container
        // // it's invisible and its position/contents are defined during mouseover
        // var tooltip = d3v5.select("body").append("div")
        //                   .attr("class", "tooltip")
        //                   .style("opacity", 0);
        //
        // // tooltip mousemove event handler
        // var tipMouseover = function(d, i) {
        // var html  = "<span> Exact value: " + d.data.value + "<br> (in % of GDP) </span><br/>";
        //     tooltip.html(html)
        //            .style("left", (d3v5.event.pageX + 12) + "px")
        //            .style("top", (d3v5.event.pageY - 18) + "px")
        //            .transition()
        //            .duration(200)
        //            .style("opacity", .9);
        // };
        //
        // // tooltip mouseout event handler
        // var tipMouseout = function(d) {
        //     tooltip.transition()
        //            .duration(300)
        //            .style("opacity", 0);
        // };
        //
        // // Generate groups
        // var arcs = g.selectAll("arc")
        //             .data(pie(pieData));
        //
        // // update
        // arcs.transition()
        //     .duration(1500)
        //     .attrTween("d", arcTween);
        //
        // arcs.enter()
        //     .append("g")
        //     .attr("class", "arc")
        //     .on("mousemove", tipMouseover)
        //     .on("mouseout", tipMouseout);
        //
        // //Draw arc paths
        // arcs.append("path")
        //     .attr("fill", function(d) {
        //         return colorScale(d.data.label);
        //     })
        //     .attr("d", arc)
        //     .each(function(d) { this._current = d; });

        // join
        var arcs = svg.selectAll(".arc")
              .data(pie(data));

        // update
        arcs.transition()
            .duration(1500)
            .attrTween("d", arcTween);

          // enter
          arcs.enter().append("path")
            .attr("class", "arc")
            .attr("fill", function(d) {
                return colorScale(d.data.label);
            })
            .attr("d", arc)
            .each(function(d) { this._current = d; });

        }

        // Store the displayed angles in _current.
        // Then, interpolate from _current to the new angles.
        // During the transition, _current is updated in-place by d3.interpolate.
        function arcTween(a) {
          console.log(this._current);
          var i = d3v5.interpolate(this._current, a);
          this._current = i(0);
          return function(t) {
            return arc(i(t));
          };
        };
}
