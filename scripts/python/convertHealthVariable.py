#!/usr/bin/env python
# Name: Teska Vaessen
# Student number: 11046341
"""
This script converts csv files into a JSON file.
"""

import pandas as pd

# Global constants for the input and output file
INPUT_CSV1 = "../data/life_expectancy_all.csv"
INPUT_CSV2 = "../data/pot_year_of_life_lost.csv"
INPUT_CSV3 = "../data/deaths_from_cancer.csv"
INPUT_CSV4 = "../data/infant_mortality_rates.csv"

# INPUT_CODES = "country_code.csv"
OUTPUT_JSON = "../data/healthvariables.json"

def preprocess(df1, df2, df3, df4):

    # Delete rows with missing values
    df1 = df1.dropna()
    df2 = df2.dropna()
    df3 = df3.dropna()
    df4 = df4.dropna()

    # Rename the value column
    df1 = df1.rename(index=str, columns={"Value": "Life expectancy"})
    df2 = df2.rename(index=str, columns={"Value": "Potential years of life lost"})
    df3 = df3.rename(index=str, columns={"Value": "Deaths from cancer"})
    df4 = df4.rename(index=str, columns={"Value": "Infant mortality rate"})

    # Merge the dataframes
    df = pd.merge(df1, df2, how='left', on=['LOCATION', 'TIME'])
    df = pd.merge(df, df3, how='left', on=['LOCATION', 'TIME'])
    df = pd.merge(df, df4, how='left', on=['LOCATION', 'TIME'])

    return df

def convert(df):
    """
    This function converts a dataframe to a JSON file.
    """
    df.to_json(OUTPUT_JSON, orient='records')


if __name__ == "__main__":

    # Load csv file, drop columns you don't use and replace comma's with dots
    df1 = pd.read_csv(INPUT_CSV1,usecols=["LOCATION", "TIME", "Value"])
    df2 = pd.read_csv(INPUT_CSV2,usecols=["LOCATION", "TIME", "Value"])
    df3 = pd.read_csv(INPUT_CSV3,usecols=["LOCATION", "TIME", "Value"])
    df4 = pd.read_csv(INPUT_CSV4,usecols=["LOCATION", "TIME", "Value"])

    # Preprocess the data
    df = preprocess(df1, df2, df3, df4)

    # Convert data to JSON file
    convert(df)
