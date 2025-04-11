// import React from "react";
// import { useState } from "react";


// function EndpointCheck(props) {
//     const options = Object.keys(props.endpoints).map((endpoint) =>
//         <option value={endpoint} key={endpoint} disabled={props.endpoints[endpoint]["disabled"]}>{props.endpoints[endpoint]["label"]}</option>
//     );
    

//     const selectEndpointHandler = (selectedEndpoint) => {
//         const endpoint = {
//             ...selectedEndpoint
//         };
//         props.onEndpointSelect(endpoint);
//     }

//     return (
//         <div>
//             <form onChange={selectEndpointHandler}>
//                 <label htmlFor="endpoint_select">Select an endpoint:  </label>
//                 <select defaultValue={'DEFAULT'} name='endpoint' id='endpoint_select' label="Select your endpoint:">
//                     <option value='DEFAULT'>Select an Endpoint</option>
//                     {options}
//                 </select>
//             </form>

//         </div>
//     )
// }

// export default EndpointCheck;