#!/usr/bin/env python3

import sys
import pandas as pd
from geosupport import Geosupport, GeosupportError

def geocode_row(row, g, address_col):
    try:
        address = str(row[address_col])
        zip_code = str(row["ZIP_CODE"])
        result = g.address(
            house_number_and_street=address,
            zip_code=zip_code
        )
        lon = result.get("Longitude", "")
        lat = result.get("Latitude", "")
        ret_code = result.get("Return Code", "")
        msg = result.get("Message", "")
    except GeosupportError as ge:
        lon = lat = ""
        ret_code = "E"
        msg = f"GeosupportError: {ge}"
    except Exception as e:
        lon = lat = ""
        ret_code = "E"
        msg = f"Error: {e}"
    return pd.Series([lon, lat, ret_code, msg])

def main():
    if len(sys.argv) != 3:
        print("Content-Type: text/plain\n")
        print("Usage: process.py <input_csv> <address_column>", file=sys.stderr)
        sys.exit(1)

    input_csv = sys.argv[1]
    address_col = sys.argv[2]

    try:
        df = pd.read_csv(input_csv)

        if address_col not in df.columns:
            print("Content-Type: text/plain\n")
            print(f"Error: Column '{address_col}' not found in input CSV.")
            sys.exit(1)

        if "ZIP_CODE" not in df.columns:
            print("Content-Type: text/plain\n")
            print("Error: Required column 'ZIP_CODE' not found in input CSV.")
            sys.exit(1)

        g = Geosupport()

        df[["lon", "lat", "ret_code", "msg"]] = df.apply(
            lambda row: geocode_row(row, g, address_col), axis=1
        )

        print("Content-Type: text/csv\n")
        df.to_csv(sys.stdout, index=False)

    except Exception as e:
        print("Content-Type: text/plain\n")
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

