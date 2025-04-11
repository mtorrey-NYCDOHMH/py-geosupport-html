import { useState, useEffect } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const ResponseTableTab = (props) => {
    const [errorCount, setErrorCount] = useState(0);
    const [successCount, setSuccessCount] = useState(0);

    useEffect(() => {
        if (typeof (props.service) !== 'undefined') {
            if (props.service.test === 'ts' | props.service.test === 'gc') {
                let sc = props.response.filter(function (n) { return n['address']['latitude'] }).length;
                let ec = props.response.length - (props.response.filter(function (n) { return n['address']['latitude'] }).length);

                setErrorCount(ec);
                setSuccessCount(sc);
            }
            if (props.service.test === 'ws') {
                // console.log('Trying to set WS tab response: ');
                let sc = props.response.filter(n => n['Address']['Latitude'] !== "0").length;
                let ec = props.response.length - sc;

                setErrorCount(ec);
                setSuccessCount(sc);
            }
        }
        else {
            console.log('Service not yet defined.')
        }
    }, [props.response])

    const successFilterHandler = () => {
        console.log('CONSTRUCT SUCCESS FILTER HERE');
    }

    const errorFilterHandler = () => {
        console.log('CONSTRUCT ERROR FILTER HERE');
    }

    return (
        <Stack direction="row" style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div>Results Table
                {props.response.length > 0 && <Chip label={successCount} size="small" color="success" style={{ marginLeft: '10px' }} onClick={successFilterHandler} />}
                {props.response.length > 0 && <Chip label={errorCount} size="small" color="warning" style={{ marginLeft: '10px' }} onClick={errorFilterHandler} />}
            </div>

        </Stack>

    )
}

export default ResponseTableTab;