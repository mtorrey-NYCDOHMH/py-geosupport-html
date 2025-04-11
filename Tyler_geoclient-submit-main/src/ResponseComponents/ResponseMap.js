import 'leaflet/dist/leaflet.css';
import './ResponseMap.css'
import React, { useEffect, useState } from 'react';
import MapMask from './MapMask';
import marker from '../leaflet/images/marker-icon.png';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet';



const myIcon = new Icon({
    iconUrl: marker,
    iconSize: [20, 32]
});

function ResponseMap(props) {
    const [view, setView] = useState([40.733183, -73.985289])
    const [markers, setMarkers] = useState([])

    //creates markers by filtering the props.response for every address with a latitude...
    useEffect(() => {
        if (props.service.test === 'gc' | props.service.test === 'ts') {
            const mappedAd = props.response.filter(function (n) { return n['address']['latitude']; });
            props.response.length > 0 &&
                setMarkers(
                    Object.keys(mappedAd).map((item, i) => (
                        <Marker position={[mappedAd[i]['address']['latitude'], mappedAd[i]['address']['longitude']]} icon={myIcon} key={i}>
                            <Popup>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 100 }} size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><b>Input Address</b></TableCell>
                                                <TableCell align="right"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                                <TableRow
                                                    key={1}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">Building Number</TableCell>
                                                    <TableCell align="right">{mappedAd[i]['address']['houseNumberIn']}</TableCell>
                                                </TableRow>
                                                <TableRow
                                                    key={2}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">Street Name</TableCell>
                                                    <TableCell align="right">{mappedAd[i]['address']['streetName1In']}</TableCell>
                                                </TableRow>
                                                <TableRow
                                                    key={3}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">Borough</TableCell>
                                                    <TableCell align="right">{mappedAd[i]['address']['boroughCode1In']}</TableCell>
                                                </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Popup>
                        </Marker>
                    ))
                )
        }
        else {
            const mappedAd = props.response.filter(n => n['Address']['Latitude'] !== "0");
                Object.keys(mappedAd).map((item, i) => (
                    console.log(mappedAd[i]['Address']['Latitude'])
                ))
                setMarkers(
                    Object.keys(mappedAd).map((item, i) => (
                        <Marker position={[mappedAd[i]['Address']['Latitude'], mappedAd[i]['Address']['Longitude']]} icon={myIcon} key={i}>
                            <Popup>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 100 }} size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><b>Input Address</b></TableCell>
                                                <TableCell align="right"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                                <TableRow
                                                    key={1}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">Building Number</TableCell>
                                                    <TableCell align="right">{mappedAd[i]['Address']['BuildingNumber']}</TableCell>
                                                </TableRow>
                                                <TableRow
                                                    key={2}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">Street Name</TableCell>
                                                    <TableCell align="right">{mappedAd[i]['Address']['Street']}</TableCell>
                                                </TableRow>
                                                <TableRow
                                                    key={3}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">Borough</TableCell>
                                                    <TableCell align="right">{mappedAd[i]['Address']['Boro']}</TableCell>
                                                </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Popup>
                        </Marker>
                    ))
                )
        }

    }, [props.response])

    const mappp =
        <MapContainer center={view} zoom={11} scrollWheelZoom={false} className="map" id="maproot">
            {Object.keys(markers).length === 0 && <MapMask></MapMask>}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers}
        </MapContainer>

    return (
        <div className='customMapContainer'>
            {mappp}
        </div>


    );
}

export default ResponseMap;
