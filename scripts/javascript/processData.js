function processData(healthSpendings, healthVariables, governmentSpendings) {

    // Create dataset with the health spendings
    var dataset = healthspendings(healthSpendings);

    // Add the health variables to the dataset
    dataset = healthvariables(healthVariables, dataset);

    // Add the goverment spendings to the dataset
    dataset = governmentspendings(governmentSpendings, dataset);

    return dataset;

    function healthspendings(data) {

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
                if (d["TIME"] == YEAR){
                    // checken of land al in de dictionairy staat dan dit doen
                    if (!(d["LOCATION"] in dataset[YEAR])){
                        var variables = {};
                        var spendings = {};
                        var governmentSpendings = {};
                        variables.country = d["LOCATION"];
                        variables.year = d["TIME"];
                        spendings[d["SUBJECT"]] = d["Value"];
                        variables.healthSpendings = spendings;
                        variables.governmentSpendings = governmentSpendings;

                        dataset[YEAR][d["LOCATION"]] = variables;
                    }
                    else {
                        dataset[YEAR][d["LOCATION"]].healthSpendings[d["SUBJECT"]] = d["Value"];
                    };
                };
            });
        };
        // console.log(dataset);
        return dataset
    };

    function healthvariables(healthVariables, dataset) {

        // // Set list of years
        var years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];

        // Set dataset
        for (year in years){
            var YEAR = years[year];
            Object.values(healthVariables).forEach(function(d){
                if (d["TIME"] == YEAR){
                    // checken of het 2017 is (want lifeexp heeft geen data van 2017)
                    dataset[YEAR][d["LOCATION"]][d["INDICATOR"]] = d["Value"];
                };

            });
        };

        return dataset;
    };

    function governmentspendings(governmentSpendings, dataset) {

        // // Set list of years
        var years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];

        // Set dataset
        for (year in years){
            var YEAR = years[year];
            Object.values(governmentSpendings).forEach(function(d){
                if (d["TIME"] == YEAR){
                    dataset[YEAR][d["LOCATION"]]["governmentSpendings"][d["SUBJECT"]] = d["Value"];
                };

            });
        };

        return dataset;
    };
}
