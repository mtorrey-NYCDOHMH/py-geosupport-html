#!/usr/bin/env python3

import sys
import pandas as pd
from geosupport import Geosupport, GeosupportError

def geocode_row(row, g, building_col, street_col, zip_col):
    try:
        house_number = str(row[building_col]).strip()
        street_name = str(row[street_col]).strip()
        zip_code = str(row[zip_col]).strip().split(".")[0].zfill(5)

        result = g.address(
            house_number=house_number,
            street_name=street_name,
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
    if len(sys.argv) != 5:
        print("Content-Type: text/plain\n")
        print("Usage: process.py <input_csv> <building_col> <street_col> <zip_col>", file=sys.stderr)
        sys.exit(1)

    input_csv, building_col, street_col, zip_col = sys.argv[1:5]

    try:
        df = pd.read_csv(input_csv)

        for col in [building_col, street_col, zip_col]:
            if col not in df.columns:
                raise ValueError(f"Column '{col}' not found in input CSV.")

        g = Geosupport()

        df[["lon", "lat", "ret_code", "msg"]] = df.apply(
            lambda row: geocode_row(row, g, building_col, street_col, zip_col), axis=1
        )

        print("Content-Type: text/csv\n")
        df.to_csv(sys.stdout, index=False)

    except Exception as e:
        print("Content-Type: text/plain\n")
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
