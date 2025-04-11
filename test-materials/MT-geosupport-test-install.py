#!/sbin/python
# Last modified: 2025-04-11 12:50
# this file: MT-geosupport-test-install.py

# TLDR: run MT-to-set-geosupport-env-vars.sh instead of this. See explanation in that file.
print(" ")
print("MT-geosupport-test-install.py: This script tests whether geosupport is working. Environmental variables must be set before running, so be sure to use the wrapper script MT-to-set-geosupport-env-vars.sh instead of running this script directly.")
print(" ")

################################################################################
# An alternative for setting env vars: It is possible to set environment variables in python, but because geosupport uses the linked C libraries, you have to set the env vars and then call a separate script. So as an option (suggested by ChatGPT) you could create a small python wrapper script that set the environment variables:
#import os
#os.environ["GEOFILES"] = "/usr/share/R/library/geocoding_tests/version-24d_24.4/fls"
#os.environ["LD_LIBRARY_PATH"] = "/usr/share/R/library/geocoding_tests/version-24d_24.4/lib"
## And then calls another python script that does the actual geosupport stuff with those enviornment variables set:
#script = "MT-python-geosupport-test-stuff.py"
#args = [script] + sys.argv[1:]
#os.execve(sys.executable, [sys.executable] + args, os.environ)
## Obviously, this would not work for using python interactively.
################################################################################

########################################
# test that geosupport has it's environment variables set (and linked) and geosupport is working correctly.
import os
import sys

print("Did the next script get the correct environment variables?")
print("GEOFILES (in Python):", os.environ.get("GEOFILES"))
print("LD_LIBRARY_PATH (in Python):", os.environ.get("LD_LIBRARY_PATH"))

# Import the library and create a `Geosupport` object.
from geosupport import Geosupport, GeosupportError
# (This will fail if python-geosupport is not install correctly)

def check_geosupport_env():
    required_vars = ["LD_LIBRARY_PATH", "GEOFILES"]
    missing = [var for var in required_vars if not os.environ.get(var)]

    if missing:
        print("Content-Type: text/plain\n")
        print(f"Error: Missing required environment variable(s): {', '.join(missing)}")
        sys.exit(1)

    try:
        # This will fail with a geosupport error like libgeo.so is missing if the enviroment variable is set wrong.
        gtest = Geosupport()
        # If this works, try a minimal address lookup to confirm it's working
        result = gtest.address(house_number="1", street_name="Centre St", borough="Manhattan")
        if not result or "Message" in result and "error" in result["Message"].lower():
            raise GeosupportError("Geosupport responded with error.")
        print("Geosupport environment variables checked, moving on...")
        print(" ")
    except Exception as e:
        print("Content-Type: text/plain\n")
        print(f"Error initializing Geosupport: {e}")
        sys.exit(1)

# Call the check function:
check_geosupport_env()
########################################

# If you wanted to use this code as part of calling another script, you might want to call the next script this way:
#import subprocess
#subprocess.run(["./MT-geosupport-example-code.py"])


