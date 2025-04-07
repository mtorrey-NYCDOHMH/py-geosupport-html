#!/usr/bin/env python3

import sys
import pandas as pd
import random

def main():
    if len(sys.argv) != 3:
        print("Usage: process.py <input_csv_path> <address_column_name>", file=sys.stderr)
        sys.exit(1)

    input_csv = sys.argv[1]
    address_col = sys.argv[2]

    try:
        df = pd.read_csv(input_csv)

        if address_col not in df.columns:
            print(f"Error: Address column '{address_col}' not found in input CSV.", file=sys.stderr)
            sys.exit(1)

        # Add dummy lat/lon columns
        df["lat"] = [round(random.uniform(40.5, 40.9), 6) for _ in range(len(df))]
        df["lon"] = [round(random.uniform(-74.25, -73.7), 6) for _ in range(len(df))]

        # Output CSV to stdout
        print("Content-Type: text/csv\n")
        df.to_csv(sys.stdout, index=False)

    except Exception as e:
        print("Content-Type: text/plain\n")
        print(f"Error during processing: {e}", file=sys.stderr)
        print(f"Error during processing: {e}")

if __name__ == "__main__":
    main()


