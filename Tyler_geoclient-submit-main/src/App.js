import { React, useState } from "react";
import styled from 'styled-components'
import { ThemeProvider, createTheme } from '@mui/material/styles';

import ResponseTabGroup from "./ResponseComponents/ResponseTabGroup";
import InputTableTab from "./ResponseComponents/InputTableTab";
import MapTab from "./ResponseComponents/MapTab";

import ProcessStepper from "./ProcessStepper";
import ResponseTableTab from "./ResponseComponents/ResponseTableTab";

import logo from "./static/health_color_horz.gif"

const Wrapper = styled.section`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: .5fr 1fr;
  grid-template-areas:
      "sidebar main";
  grid-gap: 10px;
  padding: 10px;
  background: grey;
  height: 100%;
  textAlign: "center";
  min-height: 0;
`;

const SideWrapper = styled.section`
  background: white;
  textAlign: center;
  grid-area: sidebar;
  height: 100%;
  overflow: overlay;
  padding: 0px;
`;

const MainWrapper = styled.section`
  background: white;
  color:black;
  textAlign: center;
  grid-area: main;
  height: 100%;
  overflow: overlay;
`;

const theme = createTheme({
  palette: {
    primary: {
      main: '#5d87a1',
    },
    secondary: {
      main: '#002d62',
    }
  },
});

const holder_service = {
  "none": {
      "label": "",
      "parameters": [],
      "outputs": [],
      "base_url": "",
      "path": "",
      "disabled": false,
      "test": "do not display"
  }
}

function App() {
  const [response, setResponse] = useState([])
  const [inputHeaders, setInputHeaders] = useState()
  const [inputRows, setInputRows] = useState([])
  const [responseStage, setResponseStage] = useState('Uninitiated')
  const [service, setService] = useState(holder_service)

  const responseTypes = [
    { name: 'Introduction', displayName: 'Introduction' },
    { name: 'Input Table', displayName: <InputTableTab rowCount={inputRows.length} /> },
    { name: 'Results Table', displayName: <ResponseTableTab response={response}  service={service} /> },
    { name: 'Map', displayName: <MapTab /> }
  ]


  const responseHandler = (r) => {
    setResponse(r);
    setResponseStage('Initial Response');
    // console.log('RESPONSE from App.js:', r)
  }

  const responseUpdateHandler = (r) => {
    setResponseStage('Updated');
    setResponse(r);
    console.log('NEW RESPONSE RECEIVED:', r)
  }

  const inputRowHandler = (rh) => {
    setInputRows(rh);
  }

  const inputHeaderHandler = (hr) => {
    setInputHeaders(hr);
  }

  const serviceHandler = (ss) => {
    setService(ss);
  }

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <SideWrapper>
          <img src={logo} width="200px" height="50px" style={{ padding: "10px" }}></img>
          <ProcessStepper onResponse={responseHandler} onInputRows={inputRowHandler} onInputHeaders={inputHeaderHandler} onServiceSelect={serviceHandler} response={response}/>
        </SideWrapper>
        <MainWrapper>
          <ResponseTabGroup responseTypes={responseTypes} response={response} inputRows={inputRows} inputHeaders={inputHeaders} responseStage={responseStage} onResponseUpdate={responseUpdateHandler} service={service}/>
        </MainWrapper>
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
