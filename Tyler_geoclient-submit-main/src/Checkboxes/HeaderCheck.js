import React from "react";
// import { useState } from "react";

function HeaderCheck(props) {
    let headers = {};

    const options = Object.keys(props.headers).map((header) =>
        <option value={props.headers[header]} key={props.headers[header]}>{props.headers[header]}</option>
    );

    const headerMapping = Object.keys(props.params).map((param,i) =>
        <div  key={"l"+i}>
            <label htmlFor={props.params[param]["param"]} className="header-label" style={{paddingRight:'8px'}}>{props.params[param]["label"]}</label>
            <select name={props.params[param]["param"]} id={props.params[param]["param"]} label={props.params[param]["param"]} key={"s"+i} style={{fontFamily:"inherit"}}>
                <option value="" key={"option_"+i}>Select {props.params[param]["label"]}</option>
                {options}
            </select>
        </div>

    );

    // need to ship the header map to parent element...
    const handleOnChange = () => {
        Object.keys(props.params).map((param) =>
            headers[props.params[param]["param"]] = document.getElementById(props.params[param]["param"]).value
        );
        props.onHeaderMap(headers);
    }

    return (
        <div>
            <form onChange={handleOnChange}>
                {headerMapping}
            </form>
        </div>
    );
}

export default HeaderCheck;