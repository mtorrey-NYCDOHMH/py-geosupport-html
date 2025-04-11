import React from "react";

function APICall(props) {
    return (
        <div>
            {props.base}
            {/* {props.params} */}
            {Object.keys(props.params).map((p) => (
                <div>{JSON.stringify(props.params[p])}</div>
            ))}
        </div>
    )
}

export default APICall;
