import React from 'react';

const ModalTable = (props) => {

    const m = Object.entries(props.content).map((p) =>
        <tr>
            <td>{p[0]}</td>
            <td>{p[1]}</td>
        </tr>
    );

    return (
        <table>
            {m}
        </table>
    )
}

export default ModalTable;