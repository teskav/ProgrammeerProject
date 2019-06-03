# Project Proposal
Name: Teska Vaessen

Student number: 10046341

How much influence has health insurance on the health spendings and health status of a country?

## Problem statement
Some countries in the European Union have a compulsory insurance for their citizens, but not all countries. This visualisation should help citizens of the EU to get to know if you should spend more money on healt insuance. But it is also necessary for the governments of the countries to see if they should make health insurance compulsory or not, so they know if they should spend more money on health.

## Solution
To solve this problem I will first make a map of Europe where you can see how much a country spends on health. When you click on a country in the map you will see a pie chart of that specific country of the distribution of the health spendings, but you will also see in another pie chart how much they spend on other sectors. With a (dropdown) menu or a slider you can choose between the different kind of years in the data set.

I will also show the relationship between health spendings and health statistics (e.g. BMI, alcohol and tabacco consumption, perceived health status, life expectancy, mortality rate) in a scatter plot. With a (dropdown) menu you can choose from which variable you want the relationshop with the health spendings.

Optional to this it also possible to show these variables in stacked barcharts, where you can see the difference between men and women. So then it is more clear for the EU citizens whether they should spend more on health or not.
Besides that is also possible to show more statistics about the health resources of a country, for example the number of doctors, nurses and hospital beds. This will give more insight in the health statistics of a country.


<!-- Visualisatie ideeën:
+ Kaart van Europa met kleuren aangeven hoeveel een land uitgeeft aan health. Kiezen met een menu of slider ofzo welk jaartal je wilt zien.
+ Als je klikt op een land krijg je een pie chart met hoeveel van die uitgaven verplicht is/vrijwillig/out of pocket.
+ Als je klikt op een land kan je health statistics zien over de jaren heen. Bijvoorbeeld bmi, alcohol consumptie en roken en perceived health status. (kiezen met een dropdown menu)
+ Je kan ook nog dieper ingaan op de verzekeringen en daar visualisaties van laten zien. -->

## Prerequisites
### Data sources
I have to combine all variables into one dataset. I will get my data from OECD Health: https://data.oecd.org/health.htm

For example the health spending variable: https://data.oecd.org/healthres/health-spending.htm

### External components
+ D3
+ D3-tip
+ (Maybe D3-legend)

### Hardest part
The hardest part of implementing my application will be to give a clear visualisation per country of all statistics together. I have a lot of different kind of variables and it will be hard to show them all in a decent way.
