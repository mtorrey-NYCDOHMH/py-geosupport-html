#!/bin/bash
# Last modified: 2025-05-07 17:43
# this file: MT-to-set-geosupport-env-vars.sh

########################################
# This file is a wrapper script that sets env vars and calls a python
# script that uses those vars.
#
# TLDR: run this script first!
#
# Explanation:
# Geosupport uses these variables to link a library to python, and it
# can't do that if python is already started without the libraries linked.
# So you _have_ to set the environment variables in bash _before_ you
# start python. Therefore you need some kind of wrapper script that sets
# the vars and _then_ calls your python script.
########################################

printf "Setting GEOFILES and LD_LIBRARY_PATH environment variables...\n"
#export LD_LIBRARY_PATH=/usr/share/R/library/geocoding_tests/version-24d_24.4/lib/
#export GEOFILES=/usr/share/R/library/geocoding_tests/version-24d_24.4/fls/
# comment above, and uncomment these lines if geosupport is in your home dir:
export LD_LIBRARY_PATH=$HOME/version-24b_24.2/lib/
export GEOFILES=$HOME/version-24b_24.2/fls/
echo $GEOFILES
echo $LD_LIBRARY_PATH
printf "Running python geocoding script...\n"
# commented out further test line, but you could put this in if you need to troubleshoot geosupport:
#exec python3 MT-geosupport-test-install.py "$@"

# NOTE: this script does NOT leave those variables set since it calls a subprocess, sets the vars, and then runs the following script in the subprocess with those vars set.

# Launch python script with vars set:
#exec python3 flask-upload-excel-test.py "$@"
# This version to use custom conda env on R server at DOHMH:
exec /opt/py-geosupport-conda-env/bin/python3 flask-upload-excel-test.py "$@"



