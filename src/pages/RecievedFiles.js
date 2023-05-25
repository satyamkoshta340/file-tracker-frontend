import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TablePagination } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));




export default function CustomizedTables() {
    const [rows, setRows] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [visibleRows, setVisibleRows] = useState([]);

    useEffect(
        () => {
            const func = async () => {
                fetch(`${process.env.REACT_APP_SERVER_URL}/api/user/recievedFiles`, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    }
                }).then(async (resp) => {
                    const response = await resp.json();
                    if (response.status === "success") {
                        setRows(response.data?.recievedFiles)
                        setVisibleRows(response.data?.recievedFiles.slice(0, rowsPerPage))
                        console.log(response.data.recievedFiles)
                    }
                }
                )
            }
            func();
        }, []
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log(newPage, page)
        setVisibleRows(rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage))
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    return (
        <div className='page-box' style={{display:'flex', flexDirection:'column', alignItems: 'center'}}>
            <h2>Recieved Files</h2>
            {
                visibleRows.length > 0 &&
                <div style={{ "width": "90vw", marginTop: '2rem' }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Sr. No.</StyledTableCell>
                                    <StyledTableCell>File Name</StyledTableCell>
                                    <StyledTableCell align="right">File Owner</StyledTableCell>
                                    <StyledTableCell align="right">Sent By</StyledTableCell>
                                    <StyledTableCell align="right">Sent To</StyledTableCell>
                                    <StyledTableCell align="right">Recieved By</StyledTableCell>
                                    <StyledTableCell align="right">Sent Date</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {visibleRows.map((row, key) => (
                                    <StyledTableRow key={row._id}>
                                        <StyledTableCell align="left">{row.rownum}</StyledTableCell>
                                        <StyledTableCell component="th" scope="row">{row.fileName}</StyledTableCell>
                                        <StyledTableCell align="right">{row.owner}</StyledTableCell>
                                        <StyledTableCell align="right">{row.sentBy}</StyledTableCell>
                                        <StyledTableCell align="right">{row.sentTo}</StyledTableCell>
                                        <StyledTableCell align="right">{row.recievedBy}</StyledTableCell>
                                        <StyledTableCell align="right">{row.sentAt?.substr(0, 10)}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
            }
        </div>
    );
}
