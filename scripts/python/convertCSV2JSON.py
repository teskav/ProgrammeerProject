#!/usr/bin/env python
# Name: Teska Vaessen
# Student number: 11046341
"""
This script converts csv files into a JSON file.
"""

import pandas as pd

# Global constants for the input and output file
INPUT_CSV = "health_spendings.csv"
# INPUT_CODES = "country_code.csv"
OUTPUT_JSON = "data.json"

def preprocess(df):

    # Change the order of the columns
    columnsTitles=["TIME", "LOCATION", "INDICATOR", "SUBJECT", "Value"]
    df = df.reindex(columns=columnsTitles)
    print(df)

    # Set year as index
    df = df.set_index("TIME")


    # # Delete rows with missing values
    # df = df.dropna()
    #
    # # Set country as index
    # df = df.set_index("Code")


    return df

def convert(df):
    """
    This function converts a dataframe to a JSON file.
    """
    df.to_json(OUTPUT_JSON, orient='index')


if __name__ == "__main__":

    # Load csv file, drop columns you don't use and replace comma's with dots
    df = pd.read_csv(INPUT_CSV, usecols=["LOCATION","INDICATOR", "SUBJECT", "TIME", "Value"])

    # Preprocess the data
    df = preprocess(df)

    # Add the world average to the dataframe
    # df = add_average(df)

    # Convert data to JSON file
    convert(df)
