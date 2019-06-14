#!/usr/bin/env python
# Name: Teska Vaessen
# Student number: 11046341
"""
This script converts csv files into a JSON file.
"""

import pandas as pd

# Global constants for the input and output file
INPUT_CSV = "life_expectancy_all.csv"
# INPUT_CODES = "country_code.csv"
OUTPUT_JSON = "healthvariables.json"

def preprocess(df):

    # Delete rows with missing values
    df = df.dropna()

    return df

def convert(df):
    """
    This function converts a dataframe to a JSON file.
    """
    df.to_json(OUTPUT_JSON, orient='records')


if __name__ == "__main__":

    # Load csv file, drop columns you don't use and replace comma's with dots
    df = pd.read_csv(INPUT_CSV,usecols=["LOCATION","INDICATOR", "SUBJECT", "TIME", "Value"])
    print(df)
    # Preprocess the data
    df = preprocess(df)

    # Add the world average to the dataframe
    # df = add_average(df)

    # Convert data to JSON file
    convert(df)
