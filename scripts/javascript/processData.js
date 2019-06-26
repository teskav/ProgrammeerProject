/* Name: Teska Vaessen
   Student number: 11046341
   This file includes functions to create the whole dataset for this project. */

function processData(healthSpendings, healthVariables, governmentSpendings) {
    /* This function creates the whole dataset for this project. */

    // Create dataset with the health spendings
    var dataset = healthspendings(healthSpendings);

    // Add the health variables to the dataset
    dataset = healthvariables(healthVariables, dataset);

    // Add the goverment spendings to the dataset
    dataset = governmentspendings(governmentSpendings, dataset);

    return dataset;

    function healthspendings(data) {
        /* This function adds the health spendings to the dataset. */

        // Set variable for map data
        var dataset = {};
        var years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016];
        for (year in years){
            var YEAR = years[year];
            dataset[YEAR] = {};
        };

        // Set dataset
        for (year in years){
            var YEAR = years[year];
            Object.values(data).forEach(function(d){
                if (d["TIME"] == YEAR){

                    // Check if country already in dictionary
                    if (!(d["LOCATION"] in dataset[YEAR])){

                        // Set empty dictionaries
                        var variables = {};
                        var spendings = {};
                        var governmentSpendings = {};

                        // Add variables to dictionaries
                        variables.country = d["Country_name"];
                        variables.code = d["LOCATION"]
                        variables.year = d["TIME"];
                        spendings[d["SUBJECT"]] = d["Value"];
                        variables.healthSpendings = spendings;
                        variables.governmentSpendings = governmentSpendings;
                        variables["Life expectancy"] = null;
                        variables["Potential years of life lost"] = null;
                        variables["Deaths from cancer"] = null;
                        variables["Infant mortality rate"] = null;

                        // Add variables to dataset
                        dataset[YEAR][d["LOCATION"]] = variables;
                    }
                    else {

                        // Add variables to dataset
                        dataset[YEAR][d["LOCATION"]].healthSpendings[d["SUBJECT"]] = d["Value"];
                    };
                };
            });
        };

        return dataset;

    };

    function healthvariables(healthVariables, dataset) {
        /* This function adds the different kind of health variables to
           the dataset. */

        // // Set list of years
        var years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016];

        // Set dataset
        for (year in years){
            var YEAR = years[year];
            Object.values(healthVariables).forEach(function(d){
                if (d["TIME"] == YEAR){

                    // Add variables to the dataset at the right country and year
                    dataset[YEAR][d["LOCATION"]]["Life expectancy"] = d["Life expectancy"];
                    dataset[YEAR][d["LOCATION"]]["Potential years of life lost"] = d["Potential years of life lost"];
                    dataset[YEAR][d["LOCATION"]]["Deaths from cancer"] = d["Deaths from cancer"];
                    dataset[YEAR][d["LOCATION"]]["Infant mortality rate"] = d["Infant mortality rate"];
                };
            });
        };

        return dataset;

    };

    function governmentspendings(governmentSpendings, dataset) {
        /* This function adds the government spendings to the dataset. */

        // // Set list of years
        var years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016];

        // Set dataset
        for (year in years){
            var YEAR = years[year];
            Object.values(governmentSpendings).forEach(function(d){
                if (d["TIME"] == YEAR){

                    // Add variable to the dataseet
                    dataset[YEAR][d["LOCATION"]]["governmentSpendings"][d["SUBJECT"]] = d["Value"];
                };
            });
        };

        return dataset;

    };

};
