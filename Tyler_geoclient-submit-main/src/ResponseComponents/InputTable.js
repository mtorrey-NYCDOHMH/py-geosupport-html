import React from 'react';
import { useEffect, useState } from 'react';
import './TablesInputResponse.css'

import styled from 'styled-components'

import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';


import InputTableMask from './InputTableMask';

// import RowModal from './RowModal';

// const modalStyle = {
//   position: 'absolute',
//   overflow: 'scroll',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

export default function InputTable(props) {
  // Input rows and columns come from inputRows and inputHeaders from ResponseTabGroup.js
  const [inputRows, setInputRows] = useState([]);
  const [inputColumns, setInputColumns] = useState([]);

  useEffect(() => {
    if (typeof props.inputHeaders !== "undefined" && props.inputHeaders.length > 0) {
      const ic = Object.keys(props.inputHeaders.slice(0, 9)).map(c => (
        { field: props.inputHeaders[c], headerName: props.inputHeaders[c], flex: 1 }
      ))
      setInputColumns(ic)
    }
  }, [props.inputHeaders])

  useEffect(() => {
    if (typeof props.inputRows !== "undefined" && props.inputRows.length > 0) {
      const rows2 = [];
      let count = 0;
      props.inputRows.forEach(element => {
        element.id = count;
        rows2.push(element);
        count += 1;
      });
      setInputRows(rows2);
    }
  }, [props.inputRows])

  return (
    <div className='customInputContainer'>
      <Box
        sx={{
          height: .93,
          width: 1,
          '& .MuiDataGrid-cell--editable': {
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#376331' : 'rgb(228 147 147)',
          },
        }}
      >
        {inputRows.length === 1 && <InputTableMask />}
        {inputRows.length > 1 &&
          <DataGrid
            rows={inputRows}
            columns={inputColumns}>
          </DataGrid>
        }

      </Box>
    </div>
  );
}