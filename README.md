# py-geosupport-html
* This repo provides some html and scripts to allow bulk upload and processing of addresses with NYC's powerful [Geosupport](https://www.nyc.gov/site/planning/data-maps/open-data/dwn-gde-home.page) geocoding software.
* Geosupport is powerful but complex. These scripts let a normal person upload a basic csv with an address and a zip code column to a web page and get back geocoded XY coordinates.
* While rGBAT-html does the same geocoding processing with R (using rGBAT library on the back end), this repo uses Ian Shiland's [python-geosupport](https://github.com/ishiland/python-geosupport/tree/master)

## Installation


## Usage
* Web browse to where upload.html is being served by your web server.
* Select your data csv file for upload.
* Select the column from the drop-down menu that contains your Addresses
* **You have to have zip codes in a separate column and that column has to be named ZIP_CODE**
    * (I'll fix this so it's selectable eventually.)

## RHEL install notes
* process.py runs as user `apache` on my RHEL server, which I discovered by replacing process.py with this code:
    ```
    import getpass
    print("Content-Type: text/plain\n")
    print("Running as user:", getpass.getuser())
    exit()
    ```
* Need to install pandas 
    * (Be sure to run process.py locally to catch errors like this before attempting to run it through the html upload. Through html, it will fail silently.)

## TODO
* Add selectable zip code column.
* Excel instead of csv
* Add other Geosupport field options
* Add support for split addresses? (geosupport can handle it)

## License and credits
* `Actual-NYC-addresses-test-data_restaurants.csv` is a (small) subset of restaurant inspection data from Open Data NYC that you can use for testing geocoding.
* The original package, rGBAT, was written by Gretchen Culp (https://github.com/gmculp), initially exclusively for use on DOHMH's RHEL R server. (rGBATl simply extends its use to generalized Linux for the public.)
* This package is released under an MIT license (see LICENSE file).
* Geosupport Desktop Edition™ copyrighted by the New York City Department of City Planning. This product is freely available to the public with no limitations. 


