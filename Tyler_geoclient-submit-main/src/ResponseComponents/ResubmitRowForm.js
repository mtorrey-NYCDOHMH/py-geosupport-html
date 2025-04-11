import { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import { Button } from "@mui/material";
import { findRenderedDOMComponentWithClass } from "react-dom/test-utils";

const ResubmitRowForm = (props) => {
    const [input, setInput] = useState(props.row)
    const [rowUpdate, setRowUpdate] = useState()
    const [warningStatus, setWarningStatus] = useState('hidden')
    const [successStatus, setSuccessStatus] = useState('hidden')

    const gcFields = { 'boroughCode1In': 'Borough', 'streetName1In': 'Street Name', 'houseNumberIn': 'House Number' }
    const paramDictGC = { 'boroughCode1In': 'borough', 'streetName1In': 'street', 'houseNumberIn': 'houseNumber' }

    const wsFields = { 'Boro': 'Borough', 'Street': 'Street Name', 'BuildingNumber': 'House Number' }
    const paramDictWS = { 'Boro': 'boro', 'Street': 'street', 'BuildingNumber': 'buildingNumber' }

    const testQuery = (q) => {
        fetch("https://api.nyc.gov/geo/geoclient/v1/address.json?" + new URLSearchParams(q), {
            headers: {
                'Cache-Control': 'no cache',
                'Ocp-Apim-Subscription-Key': '9bd351f7589f4cf3ae4362559d3012d1'
            }
        })
            .then(response => response.json())
            .then(newRow => {
                newRow['address']['id'] = props.row['id']
                newRow['address']['gp2_id'] = props.row['gp2_id']
                setRowUpdate(newRow)
            })
    }

    // Need to finish - call
    const csgisQuery = (q) => {
        fetch("https://csgis-dev-web.csc.nycnet:81/geoclient/v2/address.json?" + new URLSearchParams(q), {
            headers: {
                app_id: 'dohmh-devgis',
                app_key: 'YLLCT0GUVNFHWKATO'
            }
        })
            .then(response => response.json())
            .then(newRow => {
                newRow['address']['id'] = props.row['id']
                newRow['address']['gp2_id'] = props.row['gp2_id']
                setRowUpdate(newRow)
            })

    }

    // Need to finish - call
    const wsQuery = (q) => {
        fetch("https://devwebdts500.health.dohmh.nycnet/geocoding-api?" + new URLSearchParams(q))
            .then(response => response.json())
            .then(newRow => {
                newRow['Address']['id'] = props.row['id']
                newRow['Address']['gp2_id'] = props.row['gp2_id']
                setRowUpdate(newRow)
            })

    }


    const resubmitRowHandler = (r) => {
        r.preventDefault();
        const resubmitParams = {}
        if (props.service.test === 'ts') {
            Object.keys(gcFields).map((f) => {
                resubmitParams[paramDictGC[f]] = document.getElementById(f).value;
            });
            testQuery(resubmitParams);
        }
        if (props.service.test === 'gc') {
            Object.keys(gcFields).map((f) => {
                resubmitParams[paramDictGC[f]] = document.getElementById(f).value;
            });
            csgisQuery(resubmitParams);
        }
        if (props.service.test === 'ws') {
            Object.keys(wsFields).map((f) => {
                resubmitParams[paramDictWS[f]] = document.getElementById(f).value;
            });
            wsQuery(resubmitParams);
        }
    }

    //I don't think we really need this...
    const rowChangeHandler = (r) => {
        setInput({
            ...input,
            [r.target.name]: r.target.value
        });
    }

    // We might not need this either, if we set props.onRowUpdate in the testQuery function...
    useEffect(() => {
        setSuccessStatus('hidden');
        setWarningStatus('hidden');

        props.onRowUpdate(rowUpdate);
        console.log("ROW UPDATE RESULT: ", rowUpdate);

        if (props.service.test === 'gc' | props.service.test === 'ts') {
            if (typeof rowUpdate !== 'undefined') {
                if (rowUpdate['address']['returnCode1a'] === '00') {
                    setSuccessStatus('visible');
                }
                else {
                    setWarningStatus('visible');
                }
            }
        }
        if (props.service.test === 'ws' ) {
            if (typeof rowUpdate !== 'undefined') {
                if (rowUpdate['Address']['Latitude'] !== '0') {
                    setSuccessStatus('visible');
                }
                else {
                    setWarningStatus('visible');
                }
            }
        }


    }, [rowUpdate])

    let inputSource

    if (props.service.test === "ws"){
        inputSource = wsFields
    }
    else {
        inputSource = gcFields
    }

    // Need to change input based on props...right now it just maps gc fields...
    const inputs = Object.keys(inputSource).map((p) =>
            <div>
                <label style={{ paddingRight: '8px' }}>
                    {inputSource[p]}
                </label>
                <input type="text" id={p} name={p} value={input[p]} onChange={rowChangeHandler} />
            </div>
        );

    return (
        <div>
            <h3>Edit and Resubmit Address:</h3>
            <form id="yolo_form">
                {inputs}
                {/* <button type="submit">Resubmit the Address</button> */}
                <Button onClick={resubmitRowHandler} variant="contained" color="secondary" style={{ marginTop: '10px' }}>Resubmit This Address</Button>
            </form>
            <Alert severity="warning" id="warning_alert_gp" style={{ visibility: warningStatus }}>The given address has failed to geo-locate. Edit your inputs and try again.</Alert>
            <Alert severity="success" id="success_alert_gp" style={{ visibility: successStatus }}>Success! Your address has been geo-located and added to the results.</Alert>

        </div>
    )
}

export default ResubmitRowForm;