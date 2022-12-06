import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

function FileTrack() {
    const { fileId } = useParams();
    const [ history, setHistory ] = useState([]);
    const [ file, setFile ] = useState({});
    const [ qr, setQr ] = useState("");
    const qrRef = useRef();

    const navigate = useNavigate();
    const { user } = useSelector ( state => ({
        user: state.userStore.user
    }))

    console.log(fileId)
    const getFileHistory = async ()=>{
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
            setHistory(response.data.history);
            setFile(response.data.file);
            setQr(response.data.qr);
        }
        else{
            setHistory(null);
        }
    }
    const printQR = () => {
        const printContents = `<img src="data:image/jpeg;base64,${qr}" alt="QR" style="width:100%"/>`
        const w=window.open();
        w.document.write(printContents);
        w.print();
        w.close();
        console.log(printContents)
    }
    useEffect( ()=>{
        if( !user._id ){
            navigate("/file-tracker-frontend");
        }
        else{
            getFileHistory();
        }
    }, [])
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
                                <div className={`track-spot`} key={h._id}>
                                    {h.userId.firstName + " " + h.userId.lastName} <br/>
                                    {new Date(h.reachedAt).toString() } <br/>
                                    { h.info }
                                    <div className={ i + 1 === history.length ? "circle curr-spot" : "circle old-spot"}></div>
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