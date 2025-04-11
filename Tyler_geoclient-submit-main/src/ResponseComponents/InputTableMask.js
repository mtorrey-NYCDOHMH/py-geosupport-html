import React from "react";
import { Backdrop } from "@mui/material";



export default function InputTableMask() {
  const [open, setOpen] = React.useState(true);

  return (
    <div style={{ height: '100%', padding: '1%'}}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'relative', width: '100%' }}
        style={{ backdropFilter: 'blur(3px)', height: '97%'}}
        open={open}
      >
        <div style={{ display: "block", fontFamily: "Helvetica Neue, Arial, Helvetica, sans-serif", fontSize: "0.75rem" , padding: '100px'}}>
          THE INPUT TABLE WILL DISPLAY AFTER A DATASET IS UPLOADED
        </div>
      </Backdrop>
    </div>
  );
}

  // Welcome to GeoPortal, where you can geocode a list of addresses. To begin, follow the steps on the left-hand side, starting with uploading a table of addresses.
