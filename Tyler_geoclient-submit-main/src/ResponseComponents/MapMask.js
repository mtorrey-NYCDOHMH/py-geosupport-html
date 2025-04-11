import React from "react";
import { Backdrop } from "@mui/material";

// import CircularProgress from "@mui/material/CircularProgress";

export default function MapMask() {
    const [open, setOpen] = React.useState(true);
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <div style={{position: 'absolute', height: '100%', width: '100%'}}>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'relative', height: '100%', width: '100%'}}
          style={{backdropFilter:'blur(3px)'}}
          open={open}
          onClick={handleClose}
        >
            <div>THE MAP WILL DISPLAY AFTER GEOCODING IS COMPLETE</div>
        </Backdrop>
      </div>
    );
  }