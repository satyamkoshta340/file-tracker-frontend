import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

function FileTrack() {
    const { fileId } = useParams();
    const [ history, setHistory ] = useState([]);
    const [ file, setFile ] = useState({});

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
                'content-type': 'application/json'
            }
        });
        const response = await resp.json();
        console.log(response);
        if(response.data.history){
            setHistory(response.data.history);
            setFile(response.data.file);
        }
        else{
            setHistory(null);
        }
    }
    useEffect( ()=>{
        if( !user.gID ){
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