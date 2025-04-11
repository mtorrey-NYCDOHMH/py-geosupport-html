import React from "react";
import logo from "../static/health_color_horz.gif"
import PublicIcon from '@mui/icons-material/Public';
import EmailIcon from '@mui/icons-material/Email';



export default function Introduction() {

    return (
        <div style={{ overflow: 'overlay' }}>
            <div style={{ textAlign: 'center', padding: '70px ' }}>
                Welcome to the GeoPortal 2 Beta.
            </div>
            <div style={{ textAlign: 'center', padding: '0 25%' }}>
                With this tool you will be able to geocode (or get the locations of, in latitude and longitude) a set of addresses. To do this, simply follow the steps on the left-hand side.
                As you progress through the steps, you'll be able to see the results of the geocoding as both a table and a map. At the end you will be able to export your results to a spreadsheet or .json file.
                <br></br><br></br>
                If you want to geocode just a single address, you can use the <a href="https://devwebdts500.health.dohmh.nycnet/geoclient-compare">'Geocoding Compare' tool</a>. This tool will also allow you to compare geocoding responses between the DOOIT Geoclient service and the DOHMH Web Service.
                <br></br><br></br>
            </div>
            <div style={{ textAlign: 'center', padding: '0 25%' }}>
                If this application doesn't have all of the functionality you're looking for, you can try the <a href="https://diitwebint15.health.dohmh.nycnet/GeoPortal/default.aspx">original DOHMH GeoPortal</a> for your geocoding. You can also Email Us, with questions or ideas for improvement.
                <br></br><br></br>
            </div>

            <div style={{ textAlign: 'center', padding: '10px 0' }}>
                {/* <img src={logo} width="20%" height= "20%"></img> <br></br><br></br> */}
                <a href="https://nycdohmh.sharepoint.com/sites/epi1/giscenter/SitePages/GIS%20Center.aspx"><PublicIcon style={{ position: 'absolute', margin: '0 0 0 -30' }} color="secondary"></PublicIcon></a>Visit the GIS Center <br></br><br></br>
                <a href="mailto:giscenter@health.nyc.gov"><EmailIcon style={{ position: 'absolute', margin: '0 0 0 -30' }} color="secondary"></EmailIcon></a>Email Us
            </div>
        </div>

    );
}