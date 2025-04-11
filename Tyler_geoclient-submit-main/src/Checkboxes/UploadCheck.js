import React, { useState, useEffect } from "react";
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { Button } from "@mui/material";
import * as XLSX from 'xlsx/xlsx.mjs';

function UploadCheck(props) {
    const [file, setFile] = useState('');
    const [rows, setRows] = useState([{}]);
    const [fileName, setFileName] = useState('Upload File');
    const [filetype, setFileType] = useState('');

    //if all row values are undefined...drop the row
    const csvFileToArray = string => {
        const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
        const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

        // console.log('ROWS BEOFRE ROWS: ', csvRows);

        const array = csvRows.map(i => {
            const values = i.split(",");
            const obj = csvHeader.reduce((object, header, index) => {
                object[header] = values[index];
                return object;
            }, {});
            return obj;
        });

        // console.log(array);

        setRows(array);
    };

    const xlsxFileToArray = d => {
        const workbook = XLSX.read(d);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const demo = XLSX.utils.sheet_to_csv(worksheet);
        csvFileToArray(demo);
    }

    //currently only accepts csv and xls
    const handleOnChange = (e) => {
        setFile(e.target.files[0]);

        const fn = e.target.files[0].name;
        setFileName(fn);

        const extension = fn.substring(fn.lastIndexOf('.') + 1);
        setFileType(extension);
    }

    // Removes the carriage return from the csv. could lead to errors?
    useEffect(() => {

        if (file && filetype === 'csv') {
            const fileReader = new FileReader();
            fileReader.onload = function (event) {
                const csvOutput = event.target.result.replace(/[\r]+/g, '');
                csvFileToArray(csvOutput);
            };
            fileReader.readAsText(file);
        }

        if (file && filetype === 'xlsx') {
            const fileReader = new FileReader();
            fileReader.onload = function (event) {
                const data = event.target.result;
                xlsxFileToArray(data);
            };
            fileReader.readAsArrayBuffer(file);
        }


        props.headersOnFileSubmit(Object.keys(rows[0]));
        props.rowsOnFileSubmit(rows);

    }, [file]);

    useEffect(() => {
        if (rows.length > 0) {
            props.rowsOnFileSubmit(rows);
            props.headersOnFileSubmit(Object.keys(rows[0]));
        }
    }, [rows])

    return (
        <div>
            <form>
                <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadFileIcon />}
                    sx={{ marginRight: "1rem" }}
                >
                    {fileName}
                    <input type="file" id="csvFileInput" accept=".csv, .xls, .xlsx" hidden onChange={handleOnChange} />
                </Button>
            </form>
        </div>
    );
}

export default UploadCheck;