import React from 'react';
import { useEffect, useState } from 'react';
import './TablesInputResponse.css'

import ResubmitRowForm from './ResubmitRowForm';
import RequestResponseTableMask from './RequestResponseTableMask';
import ModalTable from './ModalTable.js'


import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Modal } from '@mui/material';

// import RowModal from './RowModal';

// address columns for the geoclient service
const gcAddressColumns = [
  { field: 'gp2_id', headerName: 'GP2 ID', editable: true },
  { field: 'houseNumberIn', headerName: 'Building Number', width: 140, editable: true },
  { field: 'streetName1In', headerName: 'Street Name', flex: .5, editable: true },
  { field: 'boroughCode1In', headerName: 'Borough', width: 100, editable: true },
  { field: 'message', headerName: 'Geocoding Result', flex: 1, editable: true }
  // { field: 'latitude', headerName: 'Latitude', width: 140, editable: false },
  // { field: 'longitude', headerName: 'Longitude', width: 140, editable: false },
];

const wsAddressColumns = [
  { field: 'gp2_id', headerName: 'GP2 ID', editable: true },
  { field: 'BuildingNumber', headerName: 'Building Number', width: 140, editable: true },
  { field: 'Street', headerName: 'Street Name', flex: .5, editable: true },
  { field: 'Boro', headerName: 'Borough', width: 100, editable: true },
  { field: 'ErrorMessage', headerName: 'Geocoding Result', flex: 1, editable: true }
  // { field: 'latitude', headerName: 'Latitude', width: 140, editable: false },
  // { field: 'longitude', headerName: 'Longitude', width: 140, editable: false },
];

const modalStyle = {
  position: 'absolute',
  overflow: 'overlay',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '500px',
};


export default function RequestResponseTable(props) {
  const [responseRows, setResponseRows] = useState([]);
  const [rowModal, setRowModal] = useState();
  const [open, setOpen] = useState(false);

  //need to basically reconstruct response rows by mapping it and replacing the old row with the new row. Afterwards, will push the response Rows object up to be exported...
  const rowUpdateHandler = (r) => {
    if (r) {
      console.log('R: ', r);
      //This filters the table, pulls out the old row and puts in the new one...it does this whether or not the geocoding has succeeded...
      if (props.service.test === 'ts' | props.service.test === 'gc') {
        console.log('R: ', r);
        const newResponseRows = responseRows.reduce(function (filtered, row) {
          if (row['gp2_id'] !== r['address']['gp2_id']) {
            filtered.push(row);
          }
          else {
            filtered.push(r['address'])
          }
          return filtered;
        }, [])

        setResponseRows(newResponseRows);
        props.onResponseUpdate(Object.keys(newResponseRows).map((row, r) => (
          { 'address': newResponseRows[r] }
        )))
      }
      if (props.service.test === 'ws') {
        console.log('R: ', r);
        const newResponseRows = responseRows.reduce(function (filtered, row) {
          if (row['gp2_id'] !== r['Address']['gp2_id']) {
            filtered.push(row);
          }
          else {
            filtered.push(r['Address'])
          }
          return filtered;
        }, [])

        setResponseRows(newResponseRows);
        props.onResponseUpdate(Object.keys(newResponseRows).map((row, r) => (
          { 'Address': newResponseRows[r] }
        )))
      }
    }
  }

  //~~~~~~~~~~ MODAL
  const handleOpen = (p) => {
    setOpen(true);
    // How is p different between ws and ts?
    console.log(p);
    if (props.service.test === 'gc' | props.service.test === 'ts') {
      if (p.latitude) {
        setRowModal(<ModalTable content={p}/>);
      }
      else {
        setRowModal(<ResubmitRowForm row={p} headers={props.inputHeaders} onRowUpdate={rowUpdateHandler} service={props.service} />);
      }
    }
    if (props.service.test === 'ws') {
      if (p.Latitude !== "0") {
        setRowModal(<ModalTable content={p}/>);
      }
      else {
        setRowModal(<ResubmitRowForm row={p} headers={props.inputHeaders} onRowUpdate={rowUpdateHandler} service={props.service} />);
      }
    }

  }
  const handleClose = () => setOpen(false);

  //~~~~~~~~~~ ADDS ID
  //Adds an id here - should this be done earlier in the response process? Why are we adding an id here?
  //This ID needs to somehow relate BACK to the input rows...
  //need to consider changing where and how this is applied, pretty sloppy...
  useEffect(() => {
    if (props.responseStage !== 'Updated') {
      const rows2 = [];
      let count = 0;
      if (props.service.test === 'gc' | props.service.test === 'ts') {
        props.response.forEach(element => {
          element.address.id = count;
          element.address.gp2_id = count;
          rows2.push(element.address);
          count += 1;
        });
        // console.log('ROWS2: ', rows2);
        setResponseRows(rows2);
      }
      if (props.service.test === 'ws') {
        props.response.forEach(element => {
          element.Address.id = count;
          element.Address.gp2_id = count;
          rows2.push(element.Address);
          count += 1;
        });
        // console.log('ROWS2: ', rows2);
        setResponseRows(rows2);
      }
    }
    else {
      const rows2 = [];
      props.response.forEach(element => {
        rows2.push(element.address);
      });
      setResponseRows(rows2);
    }
  }, [props.response])


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
        {responseRows.length === 0 && <RequestResponseTableMask />}
        {responseRows.length > 0 && props.service.test === 'gc' &&
          <DataGrid
            onRowClick={(params, event, details) => handleOpen(params.row)}
            rows={responseRows}
            columns={gcAddressColumns}
            isCellEditable={(params) => params.row.latitude === undefined}
            experimentalFeatures={{ newEditingApi: true }}
          />
        }
        {responseRows.length > 0 && props.service.test === 'ts' &&
          <DataGrid
            onRowClick={(params, event, details) => handleOpen(params.row)}
            rows={responseRows}
            columns={gcAddressColumns}
            isCellEditable={(params) => params.row.latitude === undefined}
            experimentalFeatures={{ newEditingApi: true }}
          />
        }
        {responseRows.length > 0 && props.service.test === 'ws' &&
          <DataGrid
            onRowClick={(params, event, details) => handleOpen(params.row)}
            rows={responseRows}
            columns={wsAddressColumns}
            isCellEditable={(params) => params.row.Latitude === "0"}
            experimentalFeatures={{ newEditingApi: true }}
          />
        }
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            {rowModal}
          </Box>
        </Modal>
      </Box>
    </div>
  );
}