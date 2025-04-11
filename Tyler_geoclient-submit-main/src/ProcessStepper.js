import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import styled from 'styled-components'

import UploadCheck from './Checkboxes/UploadCheck';
import HeaderCheck from './Checkboxes/HeaderCheck';
import BoroughCheck from './Checkboxes/BoroughCheck';
import ExportCheck from './Checkboxes/ExportCheck';
import RequestCheck from './Checkboxes/RequestCheck';
import ServiceCheck from './Checkboxes/ServiceCheck';

import { useState, useEffect } from 'react';

const StyledStepper = styled(Stepper)`
  padding: 0px;
`
export default function ProcessStepper(props) {
  const [activeStep, setActiveStep] = useState(0);
  const [params, setEndpointParams] = useState('');
  const [fileRows, setFileRows] = useState([]);
  const [boroCheckedRows, setBoroCheckedRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [headerMap, setHeaderMap] = useState({});
  const [service, setService] = useState({});
  const [queryLoading, setQueryLoading] = useState('hidden');
  const [querySuccess, setQuerySuccess] = useState('');

  // ~~~~~~~~~~~ HANDLE STEPPER
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // ~~~~~~~~~~~ HANDLERS - all your step handlers 
  const rowSubmitHandler = fileRows => {
    setFileRows(fileRows);
    props.onInputRows(fileRows);
  }

  const serviceSelectHandler = e => {
    setService(e);
    setEndpointParams(e.parameters);
    props.onServiceSelect(e)
  }

  const headerSubmitHandler = fileHeaders => {
    setHeaders(fileHeaders);
    props.onInputHeaders(fileHeaders);
  }

  const headerMapHandler = headerMapping => {
    setHeaderMap(headerMapping);
  }

  //Edit the boroughs in the filerows as they're changed
  const boroCheckHandler = b => {
    const bcr = []
    if (service.test === 'ts') {
      fileRows.forEach(r => {
        if (r[headerMap['borough']] in b) {
          const nr = { ...r };
          nr[headerMap['borough']] = b[r[headerMap['borough']]]
          bcr.push(nr);
        }
        else {
          bcr.push(r);
        }
      }
      );
    } else if (service.test === 'ws') {
      fileRows.forEach(r => {
        if (r[headerMap['boro']] in b) {
          const nr = { ...r };
          nr[headerMap['boro']] = b[r[headerMap['boro']]]
          bcr.push(nr);
        }
        else {
          bcr.push(r);
        }
      }
      );
    } else if (service.test === 'gc') {
      fileRows.forEach(r => {
        if (r[headerMap['borough']] in b) {
          const nr = { ...r };
          nr[headerMap['borough']] = b[r[headerMap['borough']]]
          bcr.push(nr);
        }
        else {
          bcr.push(r);
        }
      }
      );
    }
    setBoroCheckedRows(bcr);
  }

  // ~~~~~~~~~~~ QUERY STUFF
  //Query parameters are defined in the 'ServiceCheck.js' component
  async function testQuery(q) {
    setQueryLoading('visible');
    setQuerySuccess('');

    await Promise.all(q[3].map(queryLine =>
      fetch(q[0] + new URLSearchParams(queryLine), {
        headers: {
          'Cache-Control': 'no cache',
          'Ocp-Apim-Subscription-Key': '9bd351f7589f4cf3ae4362559d3012d1'
        }
      }).then(response => response.json())
    )).catch((error => {
      setQuerySuccess('Error')
      console.log("lil error here: ", error.message)
    }))
      .then(data => {
        props.onResponse(data)
      })

    setQueryLoading('hidden');
    setQuerySuccess('Success');
  }

  async function csgisQuery(q) {
    setQueryLoading('visible');
    setQuerySuccess('');

    await Promise.all(q[3].map(queryLine =>
      fetch(q[0] + new URLSearchParams(queryLine), {
        headers: {
          app_id: 'dohmh-devgis',
          app_key: 'YLLCT0GUVNFHWKATO'
        }
      })
        .then(response => response.json())
    )).catch((error => {
      setQuerySuccess('Error')
      console.log("lil error here: ", error.message)
    })).then(data => {
      console.log('ALL THE DATA: ', data)
    })
      .then(data => {
        props.onResponse(data)
      })

    setQueryLoading('hidden');
    setQuerySuccess('Success');
  }

  async function webServiceQuery(q) {
    setQueryLoading('visible');
    setQuerySuccess('');

    await Promise.all(q[3].map(queryline =>
      fetch(q[0] + new URLSearchParams(queryline))
        .then(response => response.json())
    )).catch((error => {
      setQuerySuccess('Error')
      console.log("lil error here: ", error.message)
    }))
      .then(data => {
        props.onResponse(data)
      })
    
    setQuerySuccess('Success');
    setQueryLoading('hidden');
  }

  // props.onResponse is updated here to be an array of responses
  const querySubmitHandler = (qq) => {

    if (service.test === 'ts') {
      testQuery(qq);
    } else if (service.test === 'ws') {
      webServiceQuery(qq);
    } else if (service.test === 'gc') {
      csgisQuery(qq);
    }
  }

  // ~~~~~~~~~~~ STEPS
  const steps = [
    {
      label: 'Upload Address Data',
      description: <Typography variant="caption">Upload your input file (.csv or .xlsx).</Typography>,
      form: <UploadCheck headersOnFileSubmit={headerSubmitHandler} rowsOnFileSubmit={rowSubmitHandler} />,
      name: 'upload',
    },
    {
      label: 'Choose Your Geocoding Source',
      description: <Typography variant="caption">**Please limit test uploads to 50 addresses or less during beta.**<br></br>To see the difference in output among the difference services you can use the <a href="http://devwebdts500/geoclient-compare">'Geocoding Compare' tool</a>.</Typography>,
      form: <ServiceCheck onServiceSelect={serviceSelectHandler} />,
      name: 'service',
    },
    {
      label: 'Define Your Header Mapping',
      description:
        <Typography variant="caption">Assign the column headers (dropdown) from your input file to the Geosupport inputs. This step may be easier if you reference the Input Table tab on the right. <br></br> <strong>Geoportal 2 current only accepts parsed addresses (building number and street name in seperate columns).</strong> <br></br> <br></br></Typography>,
      form: <HeaderCheck params={params} headers={headers} onHeaderMap={headerMapHandler} />,
      name: 'header',
    },
    {
      label: 'Clean-up Your Boroughs',
      description:
        <Typography variant="caption">Geosupport expects either Borough Code or one of the five borough names. Here, review the data from the 'Borough' column of your data and set any unexpected values to the correct borough for processing.</Typography>,
      form: <BoroughCheck boroughHeaders={headerMap} fileRows={fileRows} service={service} onBoroCheck={boroCheckHandler}></BoroughCheck>,
      name: 'borough',
    },
    {
      label: 'Review and Edit Your Results',
      description: <Typography variant="caption">First click the 'Submit Geocoding Request' button below and wait while your input is geocoded. When the geocoding is complete, you can view your results in the 'Results Table' and 'Map' on the right. In the 'Results Table' you can click on any row that did not geocode successfully (in red) and edit the input values then resubmit the row for geocoding.</Typography>,
      form: <RequestCheck headerMap={headerMap} fileRows={boroCheckedRows} service={service} onQuerySubmit={querySubmitHandler} loadingState={queryLoading} successState={querySuccess}/>,
      name: 'map',
    },
    {
      label: 'Export Your Results',
      description: <Typography variant="caption">Finally, select from the categories below what columns you would like exported with your results. Use the <strong>'?'</strong> tooltip next to each group to see the attributes that will be included with that selection. Latitude and Longitude are included by default.</Typography>,
      form: <ExportCheck responseList={props.response} service={service}></ExportCheck>,
      name: 'export',
    },
  ];


  // ~~~~~~~~~~~ THE ACTUAL PROCESS STEPPER
  return (
    <Box sx={{
      maxWidth: 400,
      p: 2,
    }}>
      <StyledStepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              {step.form}
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </StyledStepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>
            All steps completed - you&apos;re finished. <br></br>
            If you have more datasets to geocode, click the 'Reset' button below. <br></br> <br></br>
            If you had any issues, or you have any ideas about how to improve the Geoportal, please contact GIS.
            <br></br>
            <br></br>
            GIS@contact.org
          </Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}