#!/bin/bash
# handles file upload from py-upload.js on html page
# Runs the python script that processes the file
# got from ChatGPT 2025-03-12 14:00

# Set up temporary files
UPLOAD_DIR="/tmp"
INPUT_FILE=$(mktemp --suffix=.csv)
TMP=$(mktemp)

# Read entire request into TMP
cat > "$TMP"

# Extract column name
column_name=$(awk 'BEGIN{found=0}/name="column"/{found=1; next} found && NF {print; exit}' "$TMP" | tr -d '\r')

if [[ -z "$column_name" ]]; then
  echo "Content-Type: text/plain"
  echo
  echo "Error: No column name received from form."
  exit 1
fi

# Extract the CSV file content
csvoffset=$(grep -n 'name="file"' "$TMP" | cut -d: -f1)
csvoffset=$((csvoffset + 2))
tail -n +"$csvoffset" "$TMP" | sed '/^--.*$/q' > "$INPUT_FILE"

# Return headers before calling Python
echo "Content-Type: text/csv"
echo "Content-Disposition: attachment; filename=processed-py.csv"
echo

# Uncomment these for debugging
# echo "DEBUG: column_name='$column_name'" >&2
# ls -l "$INPUT_FILE" >&2
# head "$INPUT_FILE" >&2

# Call the python script (prints to stdout) 
# (add `2>&1 >&2` to the end to print errors from python call)
/opt/py-geosupport-conda-env/bin/python3 /var/www/cgi-bin/process.py "$INPUT_FILE" "$column_name"

# Cleanup
rm -f "$INPUT_FILE" "$TMP"
