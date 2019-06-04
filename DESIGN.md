# Design Document
Name: Teska Vaessen

Student number: 11046341

## Data sources
I will need the following data sources:
+ [Health spendings](https://data.oecd.org/healthres/health-spending.htm)
+ [General government spending](https://data.oecd.org/gga/general-government-spending.htm#indicator-chart)
+ [Alcohol consumption](https://data.oecd.org/healthrisk/alcohol-consumption.htm)
+ [Smokers](https://data.oecd.org/healthrisk/daily-smokers.htm#indicator-chart)
+ [Life expectancy](https://data.oecd.org/healthstat/life-expectancy-at-birth.htm)
+ [Potential years of life lost](https://data.oecd.org/healthstat/potential-years-of-life-lost.htm#indicator-chart)
+ [Overweight](https://data.oecd.org/healthrisk/overweight-or-obese-population.htm)

These are all CSV-files and I will transform and convert them in python into one or two JSON files with the variables I need.

## Diagram and technical components
My website will have the following pages:

![Sketch 1](doc/designSketch1.png)

The visualization page will have the following components:

![Sketch 2](doc/designSketch2.png)

![Sketch 3](doc/proposalSketch1.png)
This is a scatter plot with a drop down menu where you can choose between the different kind of health variables for the y-axis. For this I will need d3, d3-tip and d3-legend. For the drop down menu I will also need to use bootstrap.

![Sketch 4](doc/proposalSketch2.png)

This is a map of Europe. When you click on a country you will see a donut chart and a pie chart. For the map I will need TopojSON, D3 and maybe also D3-legend. For the donut and pie chart I will need D3 and D3-tip. For the slider I will also need to use bootstrap.

### External components and D3 plugins
+ D3
+ D3-tip
+ D3-legend
+ TopoJSON
