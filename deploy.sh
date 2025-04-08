#!/bin/bash
# From ChatGPT 2025-03-28

# Define source and destination directories
HTML_SRC_DIR="./html"
CGI_SRC_DIR="./cgi-bin"

HTML_DEST_DIR="/var/www/html/mtorrey"
CGI_DEST_DIR="/var/www/cgi-bin"

echo "Deploying HTML/JS files to $HTML_DEST_DIR..."
mkdir -p "$HTML_DEST_DIR"
cp "$HTML_SRC_DIR"/py-upload.html "$HTML_DEST_DIR/"
cp "$HTML_SRC_DIR"/py-upload.js "$HTML_DEST_DIR/"

echo "Deploying CGI and R scripts to $CGI_DEST_DIR..."
cp "$CGI_SRC_DIR"/py-upload.sh "$CGI_DEST_DIR/"
cp "$CGI_SRC_DIR"/process.py "$CGI_DEST_DIR/"

echo "Setting executable permissions..."
chmod 755 "$HTML_SRC_DIR"/py-upload.html
chmod 755 "$HTML_SRC_DIR"/py-upload.js
chmod 755 "$CGI_DEST_DIR"/py-upload.py
chmod 755 "$CGI_DEST_DIR"/process.py

echo "✅ Deployment complete."


