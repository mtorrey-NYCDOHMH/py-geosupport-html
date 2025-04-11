import React from "react";

import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const services = {
    "DOOIT Geoclient": {
        "label": "DOOIT Geoclient",
        "parameters": [{ "param": "houseNumber", "label": "House Number" }, { "param": "street", "label": "Street" }, { "param": "borough", "label": "Borough" }],
        "outputs": ["latitude", "longitude"],
        "base_url":'https://csgis-dev-web.csc.nycnet:81/geoclient',
        "path": "/v2/address.json?",
        "disabled": false,
        "test": "gc"
    },
    "DOHMH Web Service": {
        "label": "DOHMH Web Service",
        "parameters": [{ "param": "buildingNumber", "label": "Building Number" }, { "param": "street", "label": "Street" }, { "param": "boro", "label": "Borough" }],
        "outputs": ["latitude", "longitude"],
        "base_url": "https://devwebdts500.health.dohmh.nycnet/geocoding-api",
        "path": "?",
        "disabled": false,
        "test": "ws"
    },
    "Test Service": {
        "label": "DOOIT Geoclient Test",
        "parameters": [{ "param": "houseNumber", "label": "House Number" }, { "param": "street", "label": "Street" }, { "param": "borough", "label": "Borough" }],
        "outputs": ["latitude", "longitude"],
        "base_url": "https://api.nyc.gov/geo/geoclient",
        "path": "/v1/address.json?",
        "disabled": false,
        "test": "ts"
    }
}

function ServiceCheck(props) {
    const [alignment, setAlignment] = React.useState();

    const selectServiceHandler = (selectedService, newAlignment) => {
        setAlignment(newAlignment);
        const service = {
            ...selectedService
        };
        // console.log(services[newAlignment]);
        props.onServiceSelect(services[newAlignment]);
    }

    return (
        <div>
            <form>
                <ToggleButtonGroup
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={selectServiceHandler}
                    aria-label="Platform"
                >
                    <ToggleButton value="DOOIT Geoclient">DOOIT Geoclient</ToggleButton>
                    <ToggleButton value="DOHMH Web Service">DOHMH Web Service</ToggleButton>
                    <ToggleButton value="Test Service">Test Service</ToggleButton>
                </ToggleButtonGroup>

            </form>

        </div>
    )
}

export default ServiceCheck;