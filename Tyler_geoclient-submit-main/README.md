# DOHMH Geocoding Portal
## The DOHMH NYC Geocoding Browser Application

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This project represents work done by the DOHMH GIS Center Team to rewrite an existing .NET geocoding web application using modern web development tools.

The project is built with React 18 and node.js (npm). With node.js you can deploy your own instance of the Geocoding Portal.

Internally at DOHMH the Geocoding Portal leverages two different geocoding APIs, which both use DCP Geosupport instances to geocode addresses.

Last Readme Update: October 17, 2023

## Development

To start developing locally: 
1. Clone this repo with git
2. Open a terminal in the top level of the repo and install package dependencies by running: 

    `npm install`
3. You can 

    `npm run start`

## Deployment

1. Build the app by running the following command from the top-level directory:

    `npm run build`
2. Copy the contents of the build folder to the web server you want to host with and configure the web server to host index.js

## Internally at DOHMH

This application currently runs on devwebdts500.

Updating the application is done using the deployment instructions in this document. The application can be developed anywhere, compiled with `npm run build` and the results can be moved to the web server to server the updated application.

## The Structure of the Application

This Geocoding Portal is built with React. To start developing the application, first familiarize yourself with React.

The application is fairly complex because of the challenge of passing State through a large stack due to

The most important files and directories for understanding the application are the following:

- `src/App.js`: The main application, where state gets passed from input to output
- `src/ProcessStepper.js`: A holding component that builds the steps of the form for the application - this is where the actual request takes place
- `src/Checkboxes`: Directory with the forms and some logic for each step in the ProcessStepper
- `src/ResponseComponents`: directory with the response elements, the state and data get passed from App.js to here


## ToDo

- [ ] Error handling of requests...tell the user if the request fails, and offer to send a message to the maintainer.
- [ ] Keep form filled out as you step through the stepper...
- [ ] Show modal if the geoclient website needs to be opened and given permission
- [ ] Include in documentation information about keeping the web service running - ie there is a seperate server api that does the work of converting WS to json...
- [ ] Resubmit fail for address makes row white for web service...

- [ ] Filter response table with chips
- [ ] Improve the export quality

