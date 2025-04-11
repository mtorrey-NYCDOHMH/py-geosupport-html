import React, { useState } from "react";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function RequestCheck(props) {

    const requestHandler = () => {
        const requestLines = [];

        Object.keys(props.fileRows).map((row) => {
            const line = {};
            Object.keys(props.headerMap).map((h) => {
                return (line[h] = props.fileRows[row][props.headerMap[h]])
            })
            return (requestLines.push(line))
        });

        // This pushes the request... should do something like...define the url in the process stepper...
        props.onQuerySubmit([props.service['base_url'] + props.service['path'], props.headerMap, props.fileRows, requestLines]);
    }

    return (
        <div>
            <br></br>
            <Button onClick={requestHandler} variant="contained" color="secondary">Submit Geocoding Request</Button>
            <CircularProgress color="secondary" style={{visibility: props.loadingState, position: 'absolute', padding: "0 10px"}} id="1234"></CircularProgress>
            {props.successState === "Success" && <CheckCircleOutlineIcon style={{ position: 'absolute', padding: "5 18px"}} color="success"/>}
            {props.successState === "Error" && <ErrorOutlineIcon style={{position: 'absolute', padding: "5 18px"}} color="error"/>}
        </div>

    )
}

export default RequestCheck;