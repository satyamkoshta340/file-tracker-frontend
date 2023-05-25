import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function FileTrack() {
    const { fileId } = useParams();
    const [ history, setHistory ] = useState([]);
    const [ file, setFile ] = useState({});
    const [ qr, setQr ] = useState("");
    const qrRef = useRef();
    const [isLoading, setIsLoading] = useState(false);

    // const navigate = useNavigate();
    // const user = useSelector ( state => state.user.value );

    // console.log(fileId)
    const getFileHistory = async ()=>{
        setIsLoading(true);
        try{
            const resp = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/file/history/${fileId}`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
                headers:{
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            const response = await resp.json();
            console.log(response);
            if(response.data.history){
                setHistory(response.data.history.reverse());
                setFile(response.data.file);
                setQr(response.data.qr);
            }
            else{
                setHistory(null);
            }
        }
        catch(err){
            console.log(err);
        }
        setIsLoading(false);
    }
    const printQR = () => {
        const printContents = `<div style="display:flex; flex-direction:column; align-items: center"><h1>${file.fileName}</h1><img src="data:image/jpeg;base64,${qr}" alt="QR" style="width:80%"/></div>`;
      
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContents);
        printWindow.document.close();
      
        printWindow.onload = () => {
          printWindow.print();
          printWindow.close();
        };
      };
    useEffect( ()=>{
        getFileHistory();
    }, [])
    
    if( isLoading ){
        return (
            <Box sx={{ display: 'flex', flex: 1, height: '95vh', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress color="secondary"/>
            </Box>
        );
    }

    return (
    <div className='track-view page-box'>
        <div className='container'>
            {
                history === null &&
                <h3>
                    Invalid FileId
                </h3>
            }
            {
                history !== null &&
                <div className="history-box">
                    <div className="file-container flex-col-box">
                        <div>
                            <b>Name</b> <br/>
                            {file?.fileName}
                        </div>
                        <div>
                        <b>Description</b> <br/>
                            {file?.description}
                        </div>
                    </div>
                    <div className="tracks">
                        <div className="qr-box">
                            <img src={`data:image/jpeg;base64,${qr}`} alt="QR" ref={qrRef}/>
                            <div className="btn align-middle qr-print-btn" onClick={(e)=> printQR()}>
                                Print QR
                            </div>
                        </div>
                    {
                        history.map((h, i)=>{
                            return(
                                <div className={ i+1 === history.length ? "track-spot" : `track-spot lb`} key={h._id}>
                                    <div className={ i  === 0 ? "circle curr-spot" : i+1 === history.length ? "circle start-spot": "circle old-spot"}></div>
                                    {h.userId?.firstName + " " + h.userId?.lastName + ` (${h.userId.email})`} <br/>
                                    {new Date(h.reachedAt).toString() } <br/>
                                    { h.info }
                                </div>
                            )
                        })
                    }
                    </div>
                </div>
            }
        </div>
    </div>
  )
}

export default FileTrack