#!/usr/bin/env python3

import cgi
import os
import sys
import tempfile
import subprocess
import shutil

def main():
    print("Content-Type: text/csv")
    print("Content-Disposition: attachment; filename=processed-py.csv")
    print()

    # Parse multipart form data
    form = cgi.FieldStorage()

    # Get file and column name from form
    if "file" not in form or "column" not in form:
        print("Missing 'file' or 'column' field in form data.", file=sys.stderr)
        sys.exit(1)

    file_item = form["file"]
    column_name = form.getvalue("column")

    if not file_item.file or not column_name:
        print("Empty file or column name received.", file=sys.stderr)
        sys.exit(1)

    # Save uploaded file to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".csv", dir="/tmp") as input_file:
        shutil.copyfileobj(file_item.file, input_file)
        input_path = input_file.name

    # Call the process.py script
    try:
        subprocess.run(
            ["/opt/py-geosupport-conda-env/bin/python3", "/var/www/cgi-bin/process.py", input_path, column_name],
            check=True,
            stdout=sys.stdout,
            stderr=sys.stderr
        )
    except subprocess.CalledProcessError as e:
        print(f"Error during processing: {e}", file=sys.stderr)

    # Cleanup temp file
    os.remove(input_path)

if __name__ == "__main__":
    main()
