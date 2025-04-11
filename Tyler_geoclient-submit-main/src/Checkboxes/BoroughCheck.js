import React, { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";

import IconButton from "@mui/material/IconButton";
import HelpCenterIcon from '@mui/icons-material/HelpCenter';



function BoroughCheck(props) {
    const [boroCheckmap, setBoroCheckMap] = useState({});

    const acceptableBoros = ['1', '2', '3', '4', '5', 'Manhattan', 'Bronx', 'Brooklyn', 'Queens', 'Staten Island', NaN, undefined]
    const options = ['Manhattan', 'Bronx', 'Brooklyn', 'Queens', 'Staten Island']

    var bh

    //filter file input boroughs for unique and against the acceptableBoros variable - this will be used to construct the boro mapping

    if (props.service.test === 'ws') {
        bh = props.boroughHeaders['boro'];
    }
    if (props.service.test === 'gc') {
        bh = props.boroughHeaders['borough'];
    }
    if (props.service.test === 'ts') {
        bh = props.boroughHeaders['borough'];
    }

    // const unique = [...new Set(props.fileRows.map(i => i[bh]))].filter(item => !acceptableBoros.includes(item));
    const unique_whole_row = [...new Set(props.fileRows.map(i => i))].filter(item => !acceptableBoros.includes(item[bh]));


    const boro_options = Object.keys(options).map((oo) =>
        < option value={options[oo]} key={options[oo]} > {options[oo]}</option >
    );

    const boroMapping = Object.keys(unique_whole_row).map((u, i) =>
        <div key={"l" + i}>
            <label htmlFor={unique_whole_row[u][bh]} className="header-label" style={{ paddingRight: '8px' }}>{unique_whole_row[u][bh]}</label>
            <select name={unique_whole_row[u][bh]} id={unique_whole_row[u][bh]} label={unique_whole_row[u][bh]} key={"s" + i} style={{ fontFamily: "inherit" }}>
                <option value="" key={"option_" + i}>Select Borough</option>
                {boro_options}
            </select>
            <Tooltip title={Object.keys(unique_whole_row[u]).map((u2, i) => String(unique_whole_row[u][u2]).concat(", "))} placement="right-start">
                <IconButton>
                    <HelpCenterIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </div>
    )

    const boroMapHandler = (e) => {
        setBoroCheckMap({
            ...boroCheckmap,
            [e.target.name]: e.target.value
        });
    }

    useEffect(() => {
        props.onBoroCheck(boroCheckmap);
    }, [boroCheckmap])


    return (
        <div>
            <form onChange={boroMapHandler}>
                {boroMapping}
            </form>
        </div>

    )
}

export default BoroughCheck;