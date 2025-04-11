import React, { useState } from "react";
import Button from '@mui/material/Button';

import { FormGroup, FormControlLabel } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import Checkbox from "@mui/material/Checkbox";

function ExportCheck(props) {
    const [checkStatus, setCheckStatus] = useState({ "addCheck": false, "districtCheck": false, "errorCheck": false, "propertyCheck": false });

    const outputOptionsTestService = {
        'Default': {
            'Borough Input': 'boroughCode1In',
            'House Number Input': 'houseNumberIn',
            'Street Name Input': 'streetName1In',
            'Latitude': 'latitude',
            'Longitude': 'longitude',
            'gp2_id': 'gp2_id'
        },
        'Address': {
            'Address Point': '',
            'Borough': 'bblBoroughCode',
            'Geocoded Standardized Address': '',
            'Latitude': 'latitude',
            'Longitude': 'longitude',
            'NTA Code': 'nta',
            'NTA Name': 'nta',
            'X Coordinate': 'xCoordinate',
            'Y Coordinate': 'yCoordinate',
            'Zip Code': 'zipCode',
        },
        'Districts': {
            'Assembly District NYS': 'assemblyDistrict',
            'Census Block 2000': 'censusBlock2000',
            'Census Block 2010': 'censusBlock2010',
            'Census Block Suffix 2000': '',
            'Census Block Suffix 2010': '',
            'Census Tract 2000': 'censusTract2000',
            'Census Tract 2010': 'censusTract2010',
            'City Council District': 'cityCouncilDistrict',
            'Community District': 'communityDistrict',
            'Congressional District': 'congressionalDistrict',
            'DPHO': '',
            'Election District': 'electionDistrict',
            'Fire Battalion': 'fireBattalion',
            'Fire Company Number': 'fireCompanyNumber',
            'Fire Company Type': 'fireCompanyType',
            'Fire Division': 'fireDivision',
            'Health Area': 'healthArea',
            'Health Center District': 'healthCenterDistrict',
            'Municipal Court District': '',
            'Police Precinct': 'policePrecinct',
            'Santitation District': 'sanitationDistrict',
            'School District': 'communitySchoolDistrict',
            'State Senate District': 'stateSenatorialDistrict',
            'UHF Neighborhood Code': '',
            'United Hospital Fund Neighborhood': '',

        },
        'Errors': {
            'District Error Code': '',
            'District Error Message': '',
            'Error Code': 'geosupportReturnCode',
            'Error Message': 'message',
            'Property Error Code': '',
            'Property Error Message': '',
        },
        'Property': {
            'BBL': 'bbl',
            'BIN': 'buildingIdentificationNumber',
            'Coop Identification Number': 'cooperativeIdNumber',
            'Corner Code': 'cornerCode',
            'Hurricane Evacuation Zone': 'hurricaneEvacuationZone',
            'Interior Lot Flag': '',
            'Number of Buildings on Tax Lot': 'numberOfExistingStructuresOnLot',
            'Property X Coordinate': 'xCoordinate',
            'Property Y Coordinate': 'yCoordinate',
            'RPAD Building Classification Code': 'rpadBuildingClassificationCode',
            'RPAD Self-Check Code (SCC) for BBL': 'rpadSelfCheckCodeForBbl',
            'Sanborn Map Volume': 'sanbornVolumeNumber',
            'Sanborn Page Number': 'sanbornPageNumber',
            'Tax Block': 'bblTaxBlock',
            'Tax Lot': 'bblTaxLot',
            'Vacant Lot Flag': '',

        }
    }
    const outputOptionsWebService = {
        'Default': {
            'Borough Input': 'Boro',
            'House Number Input': 'BuildingNumber',
            'Street Name Input': 'Street',
            'Latitude': 'Latitude',
            'Longitude': 'Longitude',
            'gp2_id': 'gp2_id'
        },
        'Address': {
            'Address Point': '',
            'Borough': 'Boro',
            'Geocoded Standardized Address': '',
            'Latitude': 'Latitude',
            'Longitude': 'Longitude',
            'NTA Code': '',
            'NTA Name': '',
            'X Coordinate': 'XCoordinate',
            'Y Coordinate': 'YCoordinate',
            'Zip Code': 'ZipCode',
        },
        'Districts': {
            'Assembly District NYS': 'AssemblyDistrict',
            'Census Block 2000': 'Census_block_2000',
            'Census Block 2010': 'Census_block_2010',
            'Census Block Suffix 2000': 'Census_block_suffix_2000',
            'Census Block Suffix 2010': 'Census_block_suffix_2010',
            'Census Tract 2000': 'Census_tract_2000',
            'Census Tract 2010': 'Census_tract_2010',
            'City Council District': 'CityCouncilDistrict',
            'Community District': 'CommunityDistrict',
            'Congressional District': 'CongressDistrict',
            'DPHO': 'Dpho',
            'Election District': 'ED',
            'Fire Battalion': 'Fire_Bat',
            'Fire Company Number': 'Fire_co_num',
            'Fire Company Type': 'Fire_co_type',
            'Fire Division': 'Fire_Div',
            'Health Area': 'HealthArea',
            'Health Center District': 'HealthCenterDistrict',
            'Municipal Court District': 'MunicipalCourtDist',
            'Police Precinct': 'PolicePrecinct',
            'Santitation District': 'SanitationDistrict',
            'School District': 'SchoolDistrict',
            'State Senate District': 'StateSenateDistrict',
            'UHF Neighborhood Code': 'Uhf',
            'United Hospital Fund Neighborhood': '',

        },
        'Errors': {
            'District Error Code': 'DistrictErrorCode',
            'District Error Message': 'DistrictErrorMessage',
            'Error Code': 'ErrorCode',
            'Error Message': 'ErrorMessage',
            'Property Error Code': 'PropertyErrorCode',
            'Property Error Message': 'PropertyErrorMessage',
        },
        'Property': {
            'BBL': '',
            'BIN': 'Bin',
            'Coop Identification Number': 'CoopNum',
            'Corner Code': 'Corner_code',
            'Hurricane Evacuation Zone': 'HurricanEvacZone',
            'Interior Lot Flag': 'Interior_Flag',
            'Number of Buildings on Tax Lot': 'NoOfBldgs',
            'Property X Coordinate': 'XCoordinate',
            'Property Y Coordinate': 'YCoordinate',
            'RPAD Building Classification Code': 'RPADBuildingClass',
            'RPAD Self-Check Code (SCC) for BBL': 'RPADSCC',
            'Sanborn Map Volume and Page': 'Sanborn',
            'Tax Block': '',
            'Tax Lot': '',
            'Vacant Lot Flag': 'VacantLotFlag',

        }
    }

    const gcFieldsPretty = {
        "boroughCode1In": "Borough Input",
        "houseNumberIn": "House Number Input",
        "streetName1In": "Street Name Input",
        "latitude": "Latitude",
        "longitude": "Longitude",
        "": "Address Point",
        "bblBoroughCode": "Borough",
        "": "Geocoded Standardized Address",
        "latitude": "Latitude",
        "longitude": "Longitude",
        "nta": "NTA Code",
        "nta": "NTA Name",
        "xCoordinate": "X Coordinate",
        "yCoordinate": "Y Coordinate",
        "zipCode": "Zip Code",
        "assemblyDistrict": "Assembly District NYS",
        "censusBlock2000": "Census Block 2000",
        "censusBlock2010": "Census Block 2010",
        "": "Census Block Suffix 2000",
        "": "Census Block Suffix 2010",
        "censusTract2000": "Census Tract 2000",
        "censusTract2010": "Census Tract 2010",
        "cityCouncilDistrict": "City Council District",
        "communityDistrict": "Community District",
        "congressionalDistrict": "Congressional District",
        "": "DPHO",
        "electionDistrict": "Election District",
        "fireBattalion": "Fire Battalion",
        "fireCompanyNumber": "Fire Company Number",
        "fireCompanyType": "Fire Company Type",
        "fireDivision": "Fire Division",
        "healthArea": "Health Area",
        "healthCenterDistrict": "Health Center District",
        "": "Municipal Court District",
        "policePrecinct": "Police Precinct",
        "sanitationDistrict": "Santitation District",
        "communitySchoolDistrict": "School District",
        "stateSenatorialDistrict": "State Senate District",
        "": "UHF Neighborhood Code",
        "": "United Hospital Fund Neighborhood",
        "": "District Error Code",
        "": "District Error Message",
        "geosupportReturnCode": "Error Code",
        "message": "Error Message",
        "": "Property Error Code",
        "": "Property Error Message",
        "bbl": "BBL",
        "buildingIdentificationNumber": "BIN",
        "cooperativeIdNumber": "Coop Identification Number",
        "cornerCode": "Corner Code",
        "hurricaneEvacuationZone": "Hurricane Evacuation Zone",
        "": "Interior Lot Flag",
        "numberOfExistingStructuresOnLot": "Number of Buildings on Tax Lot",
        "xCoordinate": "Property X Coordinate",
        "yCoordinate": "Property Y Coordinate",
        "rpadBuildingClassificationCode": "RPAD Building Classification Code",
        "rpadSelfCheckCodeForBbl": "RPAD Self-Check Code (SCC) for BBL",
        "sanbornVolumeNumber": "Sanborn Map Volume",
        "sanbornPageNumber": "Sanborn Page Number",
        "bblTaxBlock": "Tax Block",
        "bblTaxLot": "Tax Lot",
        "": "Vacant Lot Flag",
        "gp2_id": "GP2 ID"
    }

    const wsFieldsPretty = {
        "Borough Input": "Boro",
        "House Number Input": "BuildingNumber",
        "Street Name Input": "Street",
        "Latitude": "Latitude",
        "Longitude": "Longitude",
        "Address Point": "",
        "Borough": "Boro",
        "Geocoded Standardized Address": "",
        "NTA Code": "",
        "NTA Name": "",
        "X Coordinate": "XCoordinate",
        "Y Coordinate": "YCoordinate",
        "Zip Code": "ZipCode",
        "Assembly District NYS": "AssemblyDistrict",
        "Census Block 2000": "Census_block_2000",
        "Census Block 2010": "Census_block_2010",
        "Census Block Suffix 2000": "Census_block_suffix_2000",
        "Census Block Suffix 2010": "Census_block_suffix_2010",
        "Census Tract 2000": "Census_tract_2000",
        "Census Tract 2010": "Census_tract_2010",
        "City Council District": "CityCouncilDistrict",
        "Community District": "CommunityDistrict",
        "Congressional District": "CongressDistrict",
        "DPHO": "Dpho",
        "Election District": "ED",
        "Fire Battalion": "Fire_Bat",
        "Fire Company Number": "Fire_co_num",
        "Fire Company Type": "Fire_co_type",
        "Fire Division": "Fire_Div",
        "Health Area": "HealthArea",
        "Health Center District": "HealthCenterDistrict",
        "Municipal Court District": "MunicipalCourtDist",
        "Police Precinct": "PolicePrecinct",
        "Santitation District": "SanitationDistrict",
        "School District": "SchoolDistrict",
        "State Senate District": "StateSenateDistrict",
        "UHF Neighborhood Code": "Uhf",
        "United Hospital Fund Neighborhood": "",
        "District Error Code": "DistrictErrorCode",
        "District Error Message": "DistrictErrorMessage",
        "Error Code": "ErrorCode",
        "Error Message": "ErrorMessage",
        "Property Error Code": "PropertyErrorCode",
        "Property Error Message": "PropertyErrorMessage",
        "BBL": "",
        "BIN": "Bin",
        "Coop Identification Number": "CoopNum",
        "Corner Code": "Corner_code",
        "Hurricane Evacuation Zone": "HurricanEvacZone",
        "Interior Lot Flag": "Interior_Flag",
        "Number of Buildings on Tax Lot": "NoOfBldgs",
        "Property X Coordinate": "XCoordinate",
        "Property Y Coordinate": "YCoordinate",
        "RPAD Building Classification Code": "RPADBuildingClass",
        "RPAD Self-Check Code (SCC) for BBL": "RPADSCC",
        "Sanborn Map Volume and Page": "Sanborn",
        "Tax Block": "",
        "Tax Lot": "",
        "Vacant Lot Flag": "VacantLotFlag",
        "gp2_id": "GP2 ID"
    }

    const downloadFile = ({ data, fileName, fileType }) => {
        const b = new Blob([data], { type: fileType })

        const a = document.createElement('a')
        a.download = fileName
        a.href = window.URL.createObjectURL(b)
        const clickEvt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        })
        a.dispatchEvent(clickEvt)
        a.remove()
    }

    const exportHandlerJSON = () => {
        downloadFile({
            data: JSON.stringify(props.responseList, null, 2),
            fileName: 'geocoding.json',
            fileType: 'text/json',
        })
    }

    // Pulls headers from the first element, what we need to do is find the longest element, among other things.
    const exportHandlerCsv = () => {
        const replacer = (key, value) => value === null ? '' : value
        const outputHeaders = {};

        if (props.service.test === 'gc' | props.service.test === 'ts') {
            Object.keys(outputOptionsTestService['Default']).map((i) => outputHeaders[outputOptionsTestService['Default'][i]] = i);

            if (checkStatus["addCheck"] === true) {
                Object.keys(outputOptionsTestService['Address']).map((i) => outputHeaders[outputOptionsTestService['Address'][i]] = i);
            }
            if (checkStatus["districtCheck"] === true) {
                Object.keys(outputOptionsTestService['Districts']).map((i) => outputHeaders[outputOptionsTestService['Districts'][i]] = i);
            }
            if (checkStatus["errorCheck"] === true) {
                Object.keys(outputOptionsTestService['Errors']).map((i) => outputHeaders[outputOptionsTestService['Errors'][i]] = i);
            }
            if (checkStatus["propertyCheck"] === true) {
                Object.keys(outputOptionsTestService['Property']).map((i) => outputHeaders[outputOptionsTestService['Property'][i]] = i);
            }
            const header = Object.keys(props.responseList[0]['address']).filter(h => Object.keys(outputHeaders).includes(h));
            const prettyHeader = Object.values(header).map(m => gcFieldsPretty[m]);

            //need to find a way to get the outputOptionsTestService values here?
            console.log("OUTPUT HEADERS: ", header);
            console.log("PRETTY HEADERS: ", prettyHeader);
            prettyHeader.push("gp2_id");
            console.log(props.responseList[0]['address']);

            const csv = [
                prettyHeader.join(','),
                ...props.responseList.map(row => header.map(fieldName => JSON.stringify(row['address'][fieldName], replacer)).join(','))
            ].join('\r\n')

            downloadFile({
                data: csv,
                fileName: 'geocoding.csv',
                fileType: 'text/csv',
            })
        }
        if (props.service.test === 'ws') {
            Object.keys(outputOptionsWebService['Default']).map((i) => outputHeaders[outputOptionsWebService['Default'][i]] = i);

            if (checkStatus["addCheck"] === true) {
                Object.keys(outputOptionsWebService['Address']).map((i) => outputHeaders[outputOptionsWebService['Address'][i]] = i);
            }
            if (checkStatus["districtCheck"] === true) {
                Object.keys(outputOptionsWebService['Districts']).map((i) => outputHeaders[outputOptionsWebService['Districts'][i]] = i);
            }
            if (checkStatus["errorCheck"] === true) {
                Object.keys(outputOptionsWebService['Errors']).map((i) => outputHeaders[outputOptionsWebService['Errors'][i]] = i);
            }
            if (checkStatus["propertyCheck"] === true) {
                Object.keys(outputOptionsWebService['Property']).map((i) => outputHeaders[outputOptionsWebService['Property'][i]] = i);
            }

            const header = Object.keys(props.responseList[0]['Address']).filter(h => Object.keys(outputHeaders).includes(h));
            const prettyHeader = Object.values(header).map(m => wsFieldsPretty[m]);
            prettyHeader.push("gp2_id");
            console.log("OUTPUT HEADERS: ", header);
            console.log("PRETTY HEADERS: ", prettyHeader);

            const csv = [
                header.join(','),
                ...props.responseList.map(row => header.map(fieldName => JSON.stringify(row['Address'][fieldName], replacer)).join(','))
            ].join('\r\n')

            downloadFile({
                data: csv,
                fileName: 'geocoding.csv',
                fileType: 'text/csv',
            })
        }
    }

    const addressInfo = Object.keys(outputOptionsTestService['Address']).map((i) => <li>{i}</li>)
    const districtInfo = Object.keys(outputOptionsTestService['Districts']).map((i) => <li>{i}</li>)
    const errorInfo = Object.keys(outputOptionsTestService['Errors']).map((i) => <li>{i}</li>)
    const propertyInfo = Object.keys(outputOptionsTestService['Property']).map((i) => <li>{i}</li>)

    const addressInfo_WS = Object.keys(outputOptionsTestService['Address']).map((i) => <li>{i}</li>)
    const districtInfo_WS = Object.keys(outputOptionsTestService['Districts']).map((i) => <li>{i}</li>)
    const errorInfo_WS = Object.keys(outputOptionsTestService['Errors']).map((i) => <li>{i}</li>)
    const propertyInfo_WS = Object.keys(outputOptionsTestService['Property']).map((i) => <li>{i}</li>)


    const tooltipA = (<div> Address
        <Tooltip title={addressInfo} placement="right-start">
            <IconButton>
                <HelpCenterIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    </div>)

    const tooltipD = (<div> Districts
        <Tooltip title={districtInfo} placement="right-start">
            <IconButton>
                <HelpCenterIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    </div>)

    const tooltipE = (<div> Errors
        <Tooltip title={errorInfo} placement="right-start">
            <IconButton>
                <HelpCenterIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    </div>)

    const tooltipP = (<div> Property
        <Tooltip title={propertyInfo} placement="right-start">
            <IconButton>
                <HelpCenterIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    </div>)

    const checkHandler = (e) => {
        const newCS = checkStatus;
        newCS[e.target.id] = e.target.checked;
        setCheckStatus(newCS);
    }

    return (
        <div>
            <FormGroup>
                <FormControlLabel control={<Checkbox check={false} id="addCheck" onChange={checkHandler} />} label={tooltipA} />
                <FormControlLabel control={<Checkbox check={false} id="districtCheck" onChange={checkHandler} />} label={tooltipD} />
            </FormGroup>
            <FormGroup>
                <FormControlLabel control={<Checkbox check={false} id="errorCheck" onChange={checkHandler} />} label={tooltipE} />
                <FormControlLabel control={<Checkbox check={false} id="propertyCheck" onChange={checkHandler} />} label={tooltipP} />
            </FormGroup>

            <br></br>
            <Button onClick={exportHandlerJSON} variant="outlined" color="secondary" style={{ margin: "0" }}>Export your results to json.</Button>
            <br></br>
            <Button onClick={exportHandlerCsv} variant="outlined" color="secondary" style={{ margin: "10px 0" }}>Export your results to csv.</Button>
        </div>

    )
}

export default ExportCheck;