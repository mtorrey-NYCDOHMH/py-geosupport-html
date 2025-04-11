import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';



const InputTableTab = (props) => {
    return (
            <Stack direction="row" style={{display: 'flex', justifyContent: 'space-around'}}>
                <div>Input Table
                    {props.rowCount - 1 > 0 && <Chip label={props.rowCount} size="small" style={{ marginLeft: '10px' }} color="primary"/>}
                </div>
            </Stack>
    )
}

export default InputTableTab;