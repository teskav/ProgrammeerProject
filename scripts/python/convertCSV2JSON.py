#!/usr/bin/env python
# Name: Teska Vaessen
# Student number: 11046341
"""
This script converts a csv files about health spendings into a JSON file.
"""

import pandas as pd

# Global constants for the input and output file
INPUT_CSV = "../data/health_spendings_all.csv"
INPUT_CSV1 = "../data/country_code.csv"
OUTPUT_JSON = "../data/data.json"

def preprocess(df1, df2):

    # Delete rows with missing values
    df1 = df1.dropna()

    # Add country names to dataset
    df = pd.merge(df1, df2, how='left', left_on='LOCATION', right_on='code_3digit')

    # Drop the column with extra country codes
    df = df.drop(["code_3digit"], axis=1)

    return df

def convert(df):
    """
    This function converts a dataframe to a JSON file.
    """
    df.to_json(OUTPUT_JSON, orient='records')


if __name__ == "__main__":

    # Load csv file, drop columns you don't use and replace comma's with dots
    df1 = pd.read_csv(INPUT_CSV,usecols=["LOCATION","INDICATOR", "SUBJECT", "TIME", "Value"])
    df2 = pd.read_csv(INPUT_CSV1,usecols=["Country_name","code_3digit"])

    # Preprocess the data
    df = preprocess(df1, df2)

    # Convert data to JSON file
    convert(df)
