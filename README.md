# py-geosupport-html
* This repo provides some html and scripts for bulk uploading and processing of addresses with NYC's powerful [Geosupport](https://www.nyc.gov/site/planning/data-maps/open-data/dwn-gde-home.page) geocoding software.
* Geosupport is powerful but complex. These scripts let a normal person upload a basic csv with an address and a zip code column to a web page and get back geocoded XY coordinates.
* While rGBAT-html does the same geocoding processing with R (using rGBAT library on the back end), this repo uses Ian Shiland's [python-geosupport](https://github.com/ishiland/python-geosupport/tree/master)
* This is configured for the specific setup on RHEL using apache and python in a conda env. You would have to make adjustments to get it to run elsewhere.

## Flask stuff
* (from: ChatGPT 2025-04-24)
* `to-set-geosupport-env-vars.sh` is the executable you should run to start flask
    * it sets geosupport's env vars, and then calls your flask python file (flask-upload-excel-test.py)
    * `flask-upload-excel-test.py` does the main work.
        * This will start a webserver on http://127.0.0.1:5000 which you can visit to interact with the test page.
* templates/ holds the html page templates that your flask file (flask-upload-excel-test.py) uses.

## Other stuff included:
* test-materials/
    * Example data for testing, and some python scripts for testing python-geosupport install.

## General install notes (and Arch install notes)
* For python, you need to install:
    * openpyxl (python-openpyxl as Arch package)
    * python-geosupport https://github.com/ishiland/python-geosupport/tree/master
        * (See notes in python-geosupport-MT fork-branch)
    * flask (python-flask on Arch)
    * pandas (python-pandas on Arch)
    * werkzeug.utils (python-werkzeug on Arch)
    * (Note: you need to have installed flask and openpyxl, on Arch: `sudo pacman -S python-flask python-openpyxl`.)
* Eventually:
    * You will want to move this to the RHEL server. There you will want to use the /opt/py-geosupport-env conda environment (install flask).
    * You will want to move to a WSGI server (gunicorn or mod_wsgi Apache module).

## RHEL install notes
* (See notes for initializing conda in DOHMH-bb wiki)
* Install pandas 
    * On our server, pandas has to be installed in a conda environment.
        * Use: `sudo conda create -y -p /opt/py-geosupport-conda-env python=3.9 pandas`
        * Change permissions so other users can use the conda env:
            * `sudo chmod -R 755 /opt/py-geosupport-conda-env`
* install flask
    * `sudo su -` and `conda activate /opt/py-geosupport-conda-env/`
    * conda install flask
* install openpyxl using the same method
* Install python-geosupport
    * Copy the repo to the RHEL server with no internet access
    * `sudo su -` and `conda activate /opt/py-geosupport-conda-env/`
    * cd into directory with the repo. Run `pip install . --no-index`
        * --no-index tells pip not to try to install dependencies from pypi
        * If pip fails for missing dependencies, the use `conda install dependency` to install them to the current conda environment.
* Install geosupport
	1. Manually download NYC's Geosupport version 24B from Bytes of the Big Apple:
	    * Search for Linux version of Geosupport Desktop Edition, 24B on NYC DCP's BYTES of the BIG APPLE™ Archive page.
	    * Or try this url for direct download: https://s-media.nyc.gov/agencies/dcp/assets/files/zip/data-tools/bytes/linux_geo24b_24.2.zip
	2. Unzip the downloaded file (linux_geo24b_24.2.zip) somewhere so you get a `version-24b_24.2/` directory with all the Geosupport libraries in it. 
	3. Make sure these environment variables get set:
	    ```
	    export GEOFILES=/var/geosupport/version-19b/fls/
	    export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/var/geosupport/version-19b/lib/
	    ```
	    * See: https://python-geosupport.readthedocs.io/en/latest/installation.html#linux
	    * For flask application, these get set when you run to-set-geosupport-env-vars.sh
* test that all packages are installed:
    * `conda activate /opt/py-geosupport-conda-env/` (as yourself, no sudo)
    * `which python` (should show you are using /opt/py-geosupport-conda-env)
    * Start `python3` and then run down the list of imports in the flask file testing that each library imports correctly.
	    * Don't forget to test import of openpyxl
* Things to change if you are running in a standard Linux box vs RHEL DOHMH server:
    * in `to-set-geosupport-env-vars.sh` change location of python in flask run line
        * change location of geosupport in env vars
    * in `flask-upload-excel-test.py` change app.run line from default localhost to actual server if you are running on RHEL server.

## TODO
* Set up flask to run with apache/systemwide
* Implement https connection
* Add other Geosupport field options
* Add comment column with version of Geosupport, and the name of this tool

## License and credits
* test-materials/ contains some stuff for testing.
    * `Actual-NYC-addresses-test-data_restaurants.csv` is a (small) subset of restaurant inspection data from Open Data NYC that you can use for testing geocoding.
* The original package, rGBAT, was written by Gretchen Culp (https://github.com/gmculp), initially exclusively for use on DOHMH's RHEL R server. (rGBATl simply extends its use to generalized Linux for the public.)
* This package is released under an MIT license (see LICENSE file).
* Geosupport Desktop Edition™ copyrighted by the New York City Department of City Planning. This product is freely available to the public with no limitations. 


