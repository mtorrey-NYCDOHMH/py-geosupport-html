#!/bin/bash
# Replace py-upload.sh with this to test form upload.
# dumps output to /tmp
cat > /tmp/full_post.txt
echo "Content-Type: text/plain"
echo
cat /tmp/full_post.txt
